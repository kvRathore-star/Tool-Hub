import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import DodoPayments from "dodopayments";

// Mock environment variables for demonstration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_xxxx";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "xxxxxx";
const DODO_API_KEY = process.env.DODO_API_KEY || "dodo_test_xxxx";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const plan = formData.get("plan") as string;
    const gateway = formData.get("gateway") as string; // 'razorpay' | 'dodo'

    // Validation
    if (plan !== "pro") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

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
        // Note: In a real app, you would save order.id to your D1 DB here.
        // Redirect to a dummy checkout page with the order ID for now.
        return NextResponse.redirect(new URL(`/checkout/razorpay?orderId=${order.id}`, request.url));
      } catch (error) {
        console.error("Razorpay error:", error);
        return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 });
      }
    } 
    
    if (gateway === "dodo") {
      const client = new DodoPayments({
        bearerToken: DODO_API_KEY,
        // Optional environment: "test_mode" or "live_mode"
        environment: "test_mode",
      });

      try {
        // Create a Dodo payment session
        // Assuming $9 USD per month
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

        // Normally, Dodo returns a checkout URL in `paymentInfo.checkoutUrl` (if applicable) 
        // or you embed dodopayments-checkout.
        // We'll redirect to the Dodo generic checkout URL or a local handler.
        return NextResponse.redirect(new URL(`/checkout/dodo?sessionId=${paymentInfo.payment_id}`, request.url));
      } catch (error) {
        console.error("Dodo Payments error:", error);
        return NextResponse.json({ error: "Failed to create Dodo session" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Invalid gateway specified" }, { status: 400 });

  } catch (err) {
    console.error("Payment error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
