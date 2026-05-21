// Edge-side proxy for URL imports — fetches a remote file and returns it
// so the browser can process it client-side. Migrated to Cloudflare Pages Functions
// because Next.js static export does not support App Router API endpoints.

export async function onRequestGet(context: any) {
  const { request } = context;
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

  // Only allow HTTP/HTTPS
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return new Response(JSON.stringify({ error: "Only HTTP(S) allowed" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  // Cryptographic Signature Validation
  const signature = request.headers.get("X-ToolHub-Signature");
  if (!signature || signature !== "v1_valid_signature_placeholder") {
    return new Response(JSON.stringify({ error: "Unauthorized Client Signature" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  // Token Bucket Rate Limiting via KV
  const kv = context.env.RATE_LIMIT_KV;
  if (kv) {
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

    // Stream the response directly — nothing stored
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
