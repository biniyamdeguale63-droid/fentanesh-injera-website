const DEFAULT_WHITE_PRICE = 25;
const DEFAULT_RED_PRICE = 22;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/update-pricing" && request.method === "POST") {
      return handleUpdatePricing(request, env);
    }

    if (url.pathname === "/api/pricing" && request.method === "GET") {
      let whiteRaw = null;
      let redRaw = null;
      try {
        [whiteRaw, redRaw] = await Promise.all([
          env.PRICING_KV.get("white_teff_price"),
          env.PRICING_KV.get("red_teff_price"),
        ]);
      } catch (err) {}
      const white = whiteRaw !== null && whiteRaw !== undefined ? parseFloat(whiteRaw) : DEFAULT_WHITE_PRICE;
      const red = redRaw !== null && redRaw !== undefined ? parseFloat(redRaw) : DEFAULT_RED_PRICE;
      return jsonResponse({ white: white, red: red });
    }

    if (url.pathname.startsWith("/api/")) {
      const target = "https://fentanesh-injera-website.onrender.com" + url.pathname + url.search;
      return fetch(target, request);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const contentType = assetResponse.headers.get("content-type") || "";

    if (contentType.includes("text/html")) {
      let whiteRaw = null;
      let redRaw = null;
      try {
        [whiteRaw, redRaw] = await Promise.all([
          env.PRICING_KV.get("white_teff_price"),
          env.PRICING_KV.get("red_teff_price"),
        ]);
      } catch (err) {}

      const white = whiteRaw !== null && whiteRaw !== undefined ? parseFloat(whiteRaw) : DEFAULT_WHITE_PRICE;
      const red = redRaw !== null && redRaw !== undefined ? parseFloat(redRaw) : DEFAULT_RED_PRICE;

      let html = await assetResponse.text();
      html = html.replace(
        /window\.siteSettings\s*=\s*\{[^}]*\};/,
        'window.siteSettings = { white: ' + white + ', red: ' + red + ', minOrder: 50, phone: "+251923065023", email: "fentanesh2321@gmail.com" };'
      );

      const headers = new Headers(assetResponse.headers);
      headers.delete("content-length");

      return new Response(html, {
        status: assetResponse.status,
        headers: headers,
      });
    }

    return assetResponse;
  },
};

async function handleUpdatePricing(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const { whiteTeffPrice, redTeffPrice, adminSecret } = body || {};

  if (!env.ADMIN_SECRET || adminSecret !== env.ADMIN_SECRET) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  if (typeof whiteTeffPrice !== "number" || typeof redTeffPrice !== "number") {
    return jsonResponse({ error: "whiteTeffPrice and redTeffPrice must both be numbers" }, 400);
  }

  await Promise.all([
    env.PRICING_KV.put("white_teff_price", String(whiteTeffPrice)),
    env.PRICING_KV.put("red_teff_price", String(redTeffPrice)),
  ]);

  return jsonResponse({
    success: true,
    whiteTeffPrice: whiteTeffPrice,
    redTeffPrice: redTeffPrice,
  });
}

function jsonResponse(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "Content-Type": "application/json" },
  });
}
