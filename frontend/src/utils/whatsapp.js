import { WHATSAPP_NUMBER } from "../config";

// Formats naira amounts consistently across the app.
export function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

// Builds a wa.me link with the full order summary pre-filled into the
// message box. WhatsApp opens with the text ready to send — nothing is
// sent automatically, so the customer always confirms before it goes out.
export function buildWhatsAppOrderLink(cartItems, total) {
  const lines = [
    "Hello Afonja Frozen Foods! I'd like to place an order:",
    "",
    ...cartItems.map(
      (item, i) =>
        `${i + 1}. ${item.name} — ${item.optionLabel} x${item.qty} — ${formatNaira(
          item.price * item.qty
        )}`
    ),
    "",
    `Total: ${formatNaira(total)}`,
    "",
    "Please confirm availability and delivery details. Thank you!",
  ];

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

// Simple wa.me link with no prefilled order — used by the general "chat
// with us" contact buttons outside the cart.
export function buildWhatsAppContactLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
