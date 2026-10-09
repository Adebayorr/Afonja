import { useCart } from "../context/CartContext";
import { buildWhatsAppOrderLink, formatNaira } from "../utils/whatsapp";
import "./CartDrawer.css";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, clearCart, subtotal } = useCart();

  function handleOrder() {
    const link = buildWhatsAppOrderLink(items, subtotal);
    window.open(link, "_blank", "noopener,noreferrer");
    clearCart();
    closeCart();
  }

  return (
    <>
      <div
        className={`cart-scrim ${isOpen ? "is-visible" : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`cart-drawer ${isOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
      >
        <div className="cart-drawer__head">
          <h2>Your cart</h2>
          <button type="button" className="cart-drawer__close" onClick={closeCart} aria-label="Close cart">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <p>Your cart is empty right now.</p>
            <a href="#products" className="btn btn-outline btn-sm" onClick={closeCart}>
              Browse products
            </a>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((line) => (
                <li className="cart-line" key={line.key}>
                  <img src={line.image} alt="" width="56" height="56" className="cart-line__img" decoding="async" />
                  <div className="cart-line__body">
                    <p className="cart-line__name">{line.name}</p>
                    <p className="cart-line__option">{line.optionLabel}</p>
                    <div className="cart-line__qty">
                      <button
                        type="button"
                        onClick={() => updateQty(line.key, line.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{line.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(line.key, line.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-line__end">
                    <p className="cart-line__price">{formatNaira(line.price * line.qty)}</p>
                    <button
                      type="button"
                      className="cart-line__remove"
                      onClick={() => removeItem(line.key)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__subtotal">
                <span>Subtotal</span>
                <strong>{formatNaira(subtotal)}</strong>
              </div>
              <p className="cart-drawer__note">
                Delivery fee is confirmed on WhatsApp based on your address.
              </p>
              <button type="button" className="btn btn-whatsapp btn-block" onClick={handleOrder}>
                Order via WhatsApp
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
