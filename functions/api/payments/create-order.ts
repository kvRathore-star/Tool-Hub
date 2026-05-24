import Razorpay from "razorpay";
import DodoPayments from "dodopayments";

export async function onRequestPost(context: any) {
  const { request } = context;
  try {
    const formData = await request.formData();
    const plan = formData.get("plan");
    const gateway = formData.get("gateway"); // 'razorpay' | 'dodo'

    // Validation
    if (plan !== "pro") {
      return new Response(JSON.stringify({ error: "Invalid plan" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const RAZORPAY_KEY_ID = context.env.RAZORPAY_KEY_ID || "rzp_test_xxxx";
    const RAZORPAY_KEY_SECRET = context.env.RAZORPAY_KEY_SECRET || "xxxxxx";
    const DODO_API_KEY = context.env.DODO_API_KEY || "dodo_test_xxxx";

    if (gateway === "razorpay") {
      const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
      });

      // Rs. 399 / month = 39900 paise
      const options = {
        amount: 39900,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      };

      try {
        const order = await razorpay.orders.create(options);
        // Note: Response.redirect status must be a redirect status code (301, 302, 303, 307, 308)
        return Response.redirect(new URL(`/checkout/razorpay?orderId=${order.id}`, request.url), 303);
      } catch (error: any) {
        console.error("Razorpay error:", error);
        return new Response(JSON.stringify({ error: "Failed to create Razorpay order", details: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    } 
    
    if (gateway === "dodo") {
      const client = new DodoPayments({
        bearerToken: DODO_API_KEY,
        environment: "test_mode",
      });

      try {
        const paymentInfo = await client.payments.create({
          billing: {
            city: "San Francisco",
            country: "US",
            state: "CA",
            street: "123 Market St",
            zipcode: "94105",
          },
          customer: {
            email: "user@example.com",
            name: "John Doe",
          },
          product_cart: [
            {
              product_id: "pro_plan_usd",
              quantity: 1,
            },
          ],
        });

        return Response.redirect(new URL(`/checkout/dodo?sessionId=${paymentInfo.payment_id}`, request.url), 303);
      } catch (error: any) {
        console.error("Dodo Payments error:", error);
        return new Response(JSON.stringify({ error: "Failed to create Dodo session", details: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Invalid gateway specified" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("Payment error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
