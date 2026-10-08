// Central place to tweak business details without hunting through components.

// Cloudflare Worker base URL that serves /api/products.
// Set VITE_API_URL in a .env file (see .env.example) once the Worker is
// deployed. Falls back to same-origin "/api" for local wrangler dev.
export const API_URL = import.meta.env.VITE_API_URL || "/api";

// WhatsApp number orders are sent to, in international format, no
// leading "+" or spaces (e.g. Nigerian number 0803 123 4567 -> 2348031234567).
export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || "2347078554359";

export const BUSINESS = {
  name: "Afonja Frozen Foods",
  tagline: "Meat and fish without the market stress delivered in 30 minutes",
  town: "Bolarinwa Street, Ayetoro, Oyo, Oyo State",
  phone: "+234 707 855 4359",
  whatsappDisplay: "+234 707 855 4359",
  hours: "Mon – Sun: 8am – 8pm ",
  email: "afonjafrozenfoods@gmail.com",
};
