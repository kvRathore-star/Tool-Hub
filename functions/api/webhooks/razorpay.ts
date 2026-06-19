import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import * as schema from "../../../src/db/schema";

async function computeHmacSha256Hex(bodyText: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const secretKeyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    secretKeyData,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );
  const bodyData = encoder.encode(bodyText);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, bodyData);
  
  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function onRequestPost(context: any) {
  const { request } = context;
  
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = context.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return new Response(JSON.stringify({ error: "Webhook secret not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. Signature Verification
    if (signature) {
      const computedSig = await computeHmacSha256Hex(rawBody, webhookSecret);
      if (computedSig !== signature) {
        return new Response(JSON.stringify({ error: "Invalid signature verification failed" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // 2. Parse Event Body
    const event = JSON.parse(rawBody);
    const eventType = event.event; // e.g. 'payment.captured' or 'order.paid'

    // We process successful payments: payment.captured or order.paid
    if (["payment.captured", "order.paid"].includes(eventType)) {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;

      if (context.env.DB) {
        const db = drizzle(context.env.DB, { schema });
        
        // Find matching payment record
        const paymentRecord = await db
          .select()
          .from(schema.payments)
          .where(eq(schema.payments.orderId, orderId))
          .get();

        if (paymentRecord) {
          // Promote user to Pro
          await db
            .update(schema.users)
            .set({ plan: "pro" })
            .where(eq(schema.users.id, paymentRecord.userId));

          // Mark payment status as paid
          await db
            .update(schema.payments)
            .set({ status: "paid" })
            .where(eq(schema.payments.orderId, orderId));
            
          console.log(`User ${paymentRecord.userId} successfully upgraded to Pro via Razorpay Order ${orderId}`);
        } else {
          console.warn(`No payment record found matching Razorpay Order ${orderId}`);
        }
      }
    }

    return new Response(JSON.stringify({ status: "success", provider: "razorpay" }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (err: any) {
    console.error("Razorpay webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
