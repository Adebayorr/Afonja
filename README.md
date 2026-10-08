# Afonja Frozen Foods — Website

A React storefront for Afonja Frozen Foods (Oyo town): browse products by
weight or by pack, build an order in a cart that lives in the browser, and
send that order straight to WhatsApp. A separate, PIN-protected page lets
the owner update prices and toggle products in/out of stock, backed by a
small Cloudflare Worker + KV API.

```
afonja/
├── frontend/   React app (Vite) — the public site + /admin page
└── worker/     Cloudflare Worker + KV — the inventory API
```

## 1. Run the frontend locally

```bash
cd frontend
npm install
cp .env.example .env      # then edit VITE_WHATSAPP_NUMBER
npm run dev
```

Open the printed local URL. The site works fully out of the box using the
seed catalog in `src/data/products.js` — you don't need the Worker deployed
to browse products, add to cart, or place a WhatsApp order.

**Before you launch:** open `.env` and set `VITE_WHATSAPP_NUMBER` to the
real WhatsApp number orders should land on, in international format with
no leading `+` (e.g. a Nigerian number `0803 123 4567` becomes
`2348031234567`). Also check `src/config.js` for the business address,
phone and hours shown in the Contact section.

## 2. Deploy the inventory Worker (Cloudflare)

This gives the `/admin` page somewhere to actually save changes, and makes
the product list live for every visitor (not just per-device).

```bash
cd worker
npm install
npx wrangler login

# 1. Create the KV namespace that stores the catalog
npx wrangler kv namespace create PRODUCTS_KV
# Copy the "id" it prints into wrangler.toml under [[kv_namespaces]]

# 2. Set the owner's inventory PIN (you'll be prompted to type it)
npx wrangler secret put ADMIN_PIN

# 3. (Recommended) lock CORS down to your real domain instead of "*"
#    Edit the ALLOWED_ORIGIN value in wrangler.toml

# 4. Seed the catalog with the starting products/prices
npx wrangler kv key put --binding=PRODUCTS_KV products --path=src/seed.json

# 5. Deploy
npm run deploy
```

Wrangler prints your Worker's URL, e.g.
`https://afonja-inventory.<your-subdomain>.workers.dev`.

Back in `frontend/.env`, set:

```
VITE_API_URL=https://afonja-inventory.<your-subdomain>.workers.dev/api
```

Rebuild the frontend and the homepage + `/admin` page will now read and
write through the Worker.

## 3. Using the inventory page

Visit `/admin` on your deployed site, enter the PIN you set in step 2, and
you'll see every product with:
- a toggle to mark it **in stock** / **out of stock** (out-of-stock items
  show a ribbon on the storefront and can't be added to cart)
- an editable price for every weight tier (or, for Ponmo, its two pack sizes)

Changes are staged locally as you edit; press **Save changes** to publish
them. If the Worker isn't connected yet, the page tells you and won't let
you save, so you can't lose changes silently.

## 4. Deploying the frontend

`npm run build` in `frontend/` produces a static `dist/` folder you can
host anywhere static (Cloudflare Pages, Netlify, Vercel, etc.). If you use
**Cloudflare Pages**, you can keep the whole stack on Cloudflare: Pages for
the site, Workers + KV for inventory.

## Notes & things to customize before going live

- **Prices are placeholders.** Every price in `src/data/products.js` /
  `worker/src/seed.json` is a rough estimate — update them from `/admin` or
  edit `seed.json` before your first deploy.
- **Product images** live in `frontend/src/assets/products/`. Adding a
  brand-new product currently means adding an image + an entry in
  `products.js` (and the Worker's `seed.json`) — the admin page can edit
  existing products' prices/stock, but doesn't yet support uploading new
  product photos. A natural next step is wiring in Cloudflare Images or R2
  for that.
- **WhatsApp order button** opens `wa.me` with the order pre-filled as
  plain text; nothing is sent until the customer taps send inside
  WhatsApp. The cart clears the moment this button is used.
- **Admin PIN** is a lightweight gate suited to a single-owner shop, not a
  full auth system — anyone with the PIN can edit the catalog. Keep it
  private and rotate it with `wrangler secret put ADMIN_PIN` if needed.
