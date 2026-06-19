import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../../src/db/schema";
import { eq } from "drizzle-orm";

function generateKey(): { rawKey: string; uuid: string } {
  const uuid = crypto.randomUUID();
  return { rawKey: `th_live_${uuid}`, uuid };
}

async function hashKey(rawKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(rawKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  // Verify user session
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ") && !auth?.startsWith("Session ")) {
    // For web UI, accept session cookie-based auth
    const cookieHeader = request.headers.get("Cookie") || "";
    if (!cookieHeader.includes("better-auth")) {
      return new Response(JSON.stringify({ error: "Authentication required. Sign in to create API keys." }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
  }

  // Extract user from session - for now use x-user-id header set by dashboard
  // In production, validate the better-auth session token
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return new Response(JSON.stringify({ error: "Could not identify user" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const db = drizzle(env.DB, { schema });

  // Count existing non-revoked keys
  const existing = await db.select().from(schema.apiKeys).where(eq(schema.apiKeys.userId, userId)).all();
  const activeKeys = existing.filter(k => !k.revokedAt);

  const userRecord = await db.select().from(schema.users).where(eq(schema.users.id, userId)).all();
  const plan = userRecord.length > 0 ? userRecord[0].plan : "free";
  const maxKeys = plan === "pro" ? 10 : 2;

  if (activeKeys.length >= maxKeys) {
    return new Response(JSON.stringify({ error: `Maximum ${maxKeys} active keys allowed on your plan. Revoke an existing key first.` }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  let name = "My API Key";
  try {
    const body = await request.json();
    if (body.name) name = body.name;
  } catch { }

  const { rawKey, uuid } = generateKey();
  const keyHash = await hashKey(rawKey);

  await db.insert(schema.apiKeys).values({
    id: crypto.randomUUID(),
    userId,
    keyPrefix: uuid,
    keyHash,
    name,
    plan: "free",
    requestsUsed: 0,
    requestsLimit: 50,
    createdAt: new Date(),
  });

  return new Response(JSON.stringify({
    key: rawKey,
    keyId: uuid,
    name,
    hint: "Save this key — it will not be shown again.",
  }), { status: 201, headers: { "Content-Type": "application/json" } });
}

export async function onRequestGet(context: any) {
  const { request, env } = context;

  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return new Response(JSON.stringify({ error: "Could not identify user" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const db = drizzle(env.DB, { schema });
  const keys = await db.select().from(schema.apiKeys).where(eq(schema.apiKeys.userId, userId)).all();

  const sanitized = keys.map(k => ({
    id: k.keyPrefix,
    name: k.name,
    plan: k.plan,
    prefix: k.keyPrefix.slice(0, 8),
    requestsUsed: k.requestsUsed,
    requestsLimit: k.requestsLimit,
    createdAt: k.createdAt,
    revokedAt: k.revokedAt,
  }));

  return new Response(JSON.stringify({ keys: sanitized }), { status: 200, headers: { "Content-Type": "application/json" } });
}
