import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "afonja-cart";

// A cart line is uniquely identified by product + chosen option (weight or
// pack size), so picking a different weight of the same product adds a
// separate line rather than overwriting the previous one.
function lineKey(productId, optionId) {
  return `${productId}::${optionId}`;
}

function readStoredCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage unavailable (private browsing, quota) — cart just
      // won't persist across reloads, but the session still works.
    }
  }, [items]);

  function addItem({ product, optionId, optionLabel, price, qty = 1, image }) {
    const key = lineKey(product.id, optionId);
    setItems((prev) => {
      const existing = prev.find((line) => line.key === key);
      if (existing) {
        return prev.map((line) =>
          line.key === key ? { ...line, qty: line.qty + qty } : line
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          image: image || product.image,
          optionId,
          optionLabel,
          price,
          qty,
        },
      ];
    });
    setIsOpen(true);
  }

  function updateQty(key, qty) {
    if (qty <= 0) {
      removeItem(key);
      return;
    }
    setItems((prev) => prev.map((line) => (line.key === key ? { ...line, qty } : line)));
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((line) => line.key !== key));
  }

  function clearCart() {
    setItems([]);
  }

  const totals = useMemo(() => {
    const count = items.reduce((sum, line) => sum + line.qty, 0);
    const subtotal = items.reduce((sum, line) => sum + line.qty * line.price, 0);
    return { count, subtotal };
  }, [items]);

  const value = {
    items,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    ...totals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside a CartProvider");
  return ctx;
}
