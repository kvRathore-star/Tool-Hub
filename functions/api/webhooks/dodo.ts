import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import * as schema from "../../../src/db/schema";

// Helper to convert ArrayBuffer to Base64 in Edge runtime
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function verifyDodoSignature(
  webhookId: string,
  timestamp: string,
  rawBody: string,
  signatureHeader: string,
  secretStr: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    
    // Standard Webhooks secret key verification
    // Secrets can be prefixed with whsec_ or be raw keys
    let secretKey = secretStr;
    if (secretStr.startsWith("whsec_")) {
      secretKey = secretStr.substring(6); // remove whsec_ prefix
    }
    
    // Import secret key
    const secretData = encoder.encode(secretKey);
    const key = await crypto.subtle.importKey(
      "raw",
      secretData,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );

    // Message to sign is: webhookId.timestamp.body
    const message = `${webhookId}.${timestamp}.${rawBody}`;
    const messageData = encoder.encode(message);

    // Compute signature
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, messageData);
    const computedSignature = arrayBufferToBase64(signatureBuffer);

    // Standard Webhooks header format: v1,signature1 v1,signature2...
    const signatures = signatureHeader.split(" ");
    for (const sig of signatures) {
      if (sig.startsWith("v1,")) {
        const sigValue = sig.substring(3);
        if (sigValue === computedSignature) {
          return true;
        }
      } else if (sig === computedSignature) {
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error("Dodo signature verification error:", err);
    return false;
  }
}

export async function onRequestPost(context: any) {
  const { request } = context;
  
  try {
    const rawBody = await request.text();
    const webhookId = request.headers.get("webhook-id") || "";
    const signatureHeader = request.headers.get("webhook-signature") || "";
    const timestamp = request.headers.get("webhook-timestamp") || "";
    const webhookSecret = context.env.DODO_WEBHOOK_SECRET || "mock_dodo_webhook_secret";

    // 1. Verify signature if not in mock mode
    if (webhookId && signatureHeader && !webhookSecret.includes("mock")) {
      const isValid = await verifyDodoSignature(
        webhookId,
        timestamp,
        rawBody,
        signatureHeader,
        webhookSecret
      );
      if (!isValid) {
        return new Response(JSON.stringify({ error: "Invalid signature verification failed" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // 2. Parse Event Body
    const event = JSON.parse(rawBody);
    const eventType = event.event; // e.g. 'payment.succeeded' or 'subscription.created'

    if (eventType === "payment.succeeded") {
      const paymentData = event.data;
      const paymentId = paymentData.payment_id;

      if (context.env.DB) {
        const db = drizzle(context.env.DB, { schema });
        
        // Find matching payment record
        const paymentRecord = await db
          .select()
          .from(schema.payments)
          .where(eq(schema.payments.orderId, paymentId))
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
            .where(eq(schema.payments.orderId, paymentId));
            
          console.log(`User ${paymentRecord.userId} successfully upgraded to Pro via Dodo Payment ${paymentId}`);
        } else {
          console.warn(`No payment record found matching Dodo Payment ${paymentId}`);
        }
      }
    }

    return new Response(JSON.stringify({ status: "success", provider: "dodo" }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (err: any) {
    console.error("Dodo webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
