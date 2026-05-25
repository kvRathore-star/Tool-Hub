import Razorpay from "razorpay";
import DodoPayments from "dodopayments";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../../src/db/schema";

export async function onRequestPost(context: any) {
  const { request } = context;
  
  try {
    let plan = "";
    let gateway = "";
    let userId = "guest_user";

    // Support both JSON and Form Data payloads
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      plan = body.plan || "";
      gateway = body.gateway || "";
      userId = body.userId || "guest_user";
    } else {
      const formData = await request.formData();
      plan = formData.get("plan")?.toString() || "";
      gateway = formData.get("gateway")?.toString() || "";
      userId = formData.get("userId")?.toString() || "guest_user";
    }

    // Validation
    if (!["weekly", "monthly", "yearly"].includes(plan)) {
      return new Response(JSON.stringify({ error: "Invalid plan selection" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!["razorpay", "dodo"].includes(gateway)) {
      return new Response(JSON.stringify({ error: "Invalid gateway specified" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const RAZORPAY_KEY_ID = context.env.RAZORPAY_KEY_ID || "rzp_test_mockkeyid";
    const RAZORPAY_KEY_SECRET = context.env.RAZORPAY_KEY_SECRET || "mockkeysecret";
    const DODO_API_KEY = context.env.DODO_API_KEY || "dodo_test_mockapikey";

    // Setup Drizzle if DB binding is available
    let db: any = null;
    if (context.env.DB) {
      try {
        db = drizzle(context.env.DB, { schema });
      } catch (dbErr) {
        console.error("Drizzle initialization failed:", dbErr);
      }
    }

    // --- RAZORPAY CHECKOUT (INDIA - INR) ---
    if (gateway === "razorpay") {
      // Pricing in INR (paise)
      let amountInPaise = 29900; // Default Monthly: ₹299
      if (plan === "weekly") amountInPaise = 9900; // ₹99
      if (plan === "yearly") amountInPaise = 299900; // ₹2999

      let orderId = `order_mock_${Date.now()}`;
      
      // Attempt real Razorpay order if keys are not mocks
      if (!RAZORPAY_KEY_ID.includes("mock")) {
        try {
          const razorpay = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_KEY_SECRET,
          });
          const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
          });
          orderId = order.id;
        } catch (error: any) {
          console.warn("Real Razorpay Order creation failed, falling back to mock:", error.message);
        }
      }

      // Record payment intent in database if available
      if (db) {
        try {
          await db.insert(schema.payments).values({
            id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            userId,
            gateway: "razorpay",
            orderId: orderId,
            amount: amountInPaise / 100,
            currency: "INR",
            status: "created",
            createdAt: new Date(),
          });
        } catch (dbInsertErr) {
          console.error("Failed to log payment intent to Drizzle:", dbInsertErr);
        }
      }

      return new Response(
        JSON.stringify({
          gateway: "razorpay",
          key: RAZORPAY_KEY_ID,
          orderId: orderId,
          amount: amountInPaise,
          currency: "INR",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // --- DODO PAYMENTS CHECKOUT (GLOBAL - USD) ---
    if (gateway === "dodo") {
      // Map plans to Dodo product/price IDs
      let productId = "prod_monthly_pro";
      let amount = 14.99;
      if (plan === "weekly") {
        productId = "prod_weekly_pro";
        amount = 4.99;
      }
      if (plan === "yearly") {
        productId = "prod_yearly_pro";
        amount = 149.99;
      }

      let checkoutUrl = `https://test.dodopayments.com/checkout/mock_session_${Date.now()}`;
      let paymentId = `dodo_mock_${Date.now()}`;

      if (!DODO_API_KEY.includes("mock")) {
        try {
          const client = new DodoPayments({
            bearerToken: DODO_API_KEY,
            environment: "test_mode",
          });

          const paymentInfo = await client.payments.create({
            billing: {
              city: "New York",
              country: "US",
              state: "NY",
              street: "100 Broadway",
              zipcode: "10005",
            },
            customer: {
              email: "customer@toolhub.online",
              name: "ToolHub Subscriber",
            },
            product_cart: [
              {
                product_id: productId,
                quantity: 1,
              },
            ],
          });
          
          paymentId = paymentInfo.payment_id;
          // In standard DodoPayments API, checkout_url is provided for hosted checkout redirects
          checkoutUrl = (paymentInfo as any).checkout_url || checkoutUrl;
        } catch (error: any) {
          console.warn("Real DodoPayments Session creation failed, falling back to mock:", error.message);
        }
      }

      // Record payment intent in database if available
      if (db) {
        try {
          await db.insert(schema.payments).values({
            id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            userId,
            gateway: "dodo",
            orderId: paymentId,
            amount: amount,
            currency: "USD",
            status: "created",
            createdAt: new Date(),
          });
        } catch (dbInsertErr) {
          console.error("Failed to log payment intent to Drizzle:", dbInsertErr);
        }
      }

      return new Response(
        JSON.stringify({
          gateway: "dodo",
          paymentId: paymentId,
          checkoutUrl: checkoutUrl,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid configuration state" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("Checkout route internal error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
