export async function onRequest(context: any) {
  const { request, next } = context;
  
  // Read request cookies to avoid duplicate headers
  const cookieHeader = request.headers.get("Cookie") || "";
  
  const response = await next();
  
  if (!cookieHeader.includes("user-country=")) {
    const country = request.headers.get("cf-ipcountry") || "US";
    // Set cookie for 1 week
    response.headers.append(
      "Set-Cookie", 
      `user-country=${country}; Path=/; Max-Age=604800; SameSite=Lax; Secure`
    );
  }
  
  return response;
}
