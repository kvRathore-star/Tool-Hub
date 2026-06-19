import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../src/db/schema";
import { eq } from "drizzle-orm";

async function hashKey(rawKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(rawKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const url = new URL(request.url).searchParams.get("url");

  if (!url) {
    return new Response(JSON.stringify({ error: "Missing URL" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid URL" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return new Response(JSON.stringify({ error: "Only HTTP(S) allowed" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  // --- Authentication ---
  // Try Bearer token first (developer API key), then fall back to X-ToolHub-Signature (internal tools)
  const authHeader = request.headers.get("Authorization");
  let isAuthenticated = false;
  let isDeveloperKey = false;

  if (authHeader?.startsWith("Bearer ")) {
    // Developer API key auth
    const rawKey = authHeader.slice(7).trim();
    if (!rawKey.startsWith("th_live_")) {
      return new Response(JSON.stringify({ error: "Invalid API key format" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const uuidPart = rawKey.slice(8);
    const db = drizzle(env.DB, { schema });
    const results = await db.select().from(schema.apiKeys).where(eq(schema.apiKeys.keyPrefix, uuidPart)).all();

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: "API key not found" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const keyRecord = results[0];
    if (keyRecord.revokedAt) {
      return new Response(JSON.stringify({ error: "API key has been revoked" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const hashHex = await hashKey(rawKey);
    if (hashHex !== keyRecord.keyHash) {
      return new Response(JSON.stringify({ error: "Invalid API key" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    if (keyRecord.requestsUsed >= keyRecord.requestsLimit) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Upgrade your plan for higher limits." }), { status: 429, headers: { "Content-Type": "application/json" } });
    }

    isAuthenticated = true;
    isDeveloperKey = true;

    // Increment usage asynchronously (fire-and-forget — don't block the proxy)
    const db2 = drizzle(env.DB, { schema });
    db2.update(schema.apiKeys)
      .set({ requestsUsed: keyRecord.requestsUsed + 1, lastUsedAt: new Date() })
      .where(eq(schema.apiKeys.keyPrefix, uuidPart))
      .catch(() => {});
  } else {
    // Internal tool auth via shared secret
    const signature = request.headers.get("X-ToolHub-Signature");
    const expectedSignature = env.PROXY_SECRET;
    if (!signature || !expectedSignature || signature !== expectedSignature) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    isAuthenticated = true;
  }

  if (!isAuthenticated) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  // --- Rate limiting ---
  // Per-IP for internal tools, per-key limits already checked above for developer keys
  const kv = env.RATE_LIMIT_KV;
  if (kv && !isDeveloperKey) {
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    const key = `ratelimit_${ip}`;
    const current = await kv.get(key);
    const count = current ? parseInt(current) : 0;

    if (count >= 3) {
      return new Response(JSON.stringify({ error: "Too Many Requests" }), { status: 429, headers: { "Content-Type": "application/json" } });
    }
    await kv.put(key, (count + 1).toString(), { expirationTtl: 60 });
  }

  // Block localhost / internal IPs
  if (
    parsed.hostname === "localhost" ||
    parsed.hostname === "127.0.0.1" ||
    parsed.hostname === "[::1]" ||
    parsed.hostname.startsWith("192.168.") ||
    parsed.hostname.startsWith("10.") ||
    parsed.hostname.startsWith("172.16.")
  ) {
    return new Response(JSON.stringify({ error: "Internal URLs blocked" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "ToolHub/1.0 (URL-Import-Proxy)",
      },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Upstream returned ${res.status}` }), { status: 502, headers: { "Content-Type": "application/json" } });
    }

    const contentType = res.headers.get("content-type") ?? "application/octet-stream";

    return new Response(res.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Fetch failed" }), { status: 502, headers: { "Content-Type": "application/json" } });
  }
}
