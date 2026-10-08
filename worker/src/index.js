/**
 * Afonja Frozen Foods — Inventory Worker
 * Endpoints:
 *   GET  /api/products        -> public, returns the catalog (JSON array)
 *   GET  /api/admin/verify    -> checks x-admin-pin header, 200 or 401
 *   PUT  /api/products        -> replaces the catalog, requires x-admin-pin
 *
 * Bindings: PRODUCTS_KV (KV), ADMIN_PIN (secret),
 *           ALLOWED_ORIGIN (comma-separated list of site origins)
 */

import seed from "./seed.json";

const KV_KEY = "products";

function corsHeaders(request, env) {
  const allowed = (env.ALLOWED_ORIGIN || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const origin = request.headers.get("Origin") || "";

  const headers = {
    "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-pin",
    Vary: "Origin",
  };

  if (allowed.length === 0) {
    headers["Access-Control-Allow-Origin"] = "*";
  } else if (allowed.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

function isAuthorized(request, env) {
  const pin = request.headers.get("x-admin-pin") || "";
  return env.ADMIN_PIN && pin === env.ADMIN_PIN;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (url.pathname === "/api/products" && request.method === "GET") {
      const stored = await env.PRODUCTS_KV.get(KV_KEY, "json");
      return json(stored ?? seed, 200, cors);
    }

    if (url.pathname === "/api/admin/verify" && request.method === "GET") {
      return isAuthorized(request, env)
        ? json({ ok: true }, 200, cors)
        : json({ ok: false }, 401, cors);
    }

    if (url.pathname === "/api/products" && request.method === "PUT") {
      if (!isAuthorized(request, env)) {
        return json({ error: "Unauthorized" }, 401, cors);
      }
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON" }, 400, cors);
      }
      if (!Array.isArray(body)) {
        return json({ error: "Expected an array of products" }, 400, cors);
      }
      await env.PRODUCTS_KV.put(KV_KEY, JSON.stringify(body));
      return json({ ok: true }, 200, cors);
    }

    return json({ error: "Not found" }, 404, cors);
  },
};