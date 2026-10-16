import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { formatNaira } from "../utils/whatsapp";
import "./ProductCard.css";

export default function ProductCard({ product, variant = "green" }) {
  const { addItem, items } = useCart();
  const [selectedId, setSelectedId] = useState(product.options[0]?.id);
  const [justAdded, setJustAdded] = useState(false);

  const selected = useMemo(
    () => product.options.find((opt) => opt.id === selectedId) || product.options[0],
    [product.options, selectedId]
  );

  const cartQtyForSelection = items.find(
    (line) => line.productId === product.id && line.optionId === selected?.id
  )?.qty;

  const pillLabel = product.soldBy === "unit" ? "Size" : "Weight";
  const displayImage = selected?.image || product.image;

  function handleAdd() {
    if (!product.inStock || !selected) return;
    addItem({
      product,
      optionId: selected.id,
      optionLabel: selected.label,
      price: selected.price,
      image: selected.image || product.image,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <article className={`product-card product-card--${variant} ${!product.inStock ? "is-out" : ""}`}>
      <div className="product-card__media">
        <img
          src={displayImage}
          alt={product.name}
          width="500"
          height="500"
          loading="lazy"
          decoding="async"
        />
        {!product.inStock && <span className="product-card__ribbon">Out of stock</span>}
      </div>

      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p className="product-card__price">{formatNaira(selected?.price ?? 0)}</p>

        <fieldset className="product-card__options" disabled={!product.inStock}>
          <legend>{pillLabel}</legend>
          <div className="pill-row">
            {product.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`pill ${selected?.id === opt.id ? "is-active" : ""}`}
                onClick={() => setSelectedId(opt.id)}
                aria-pressed={selected?.id === opt.id}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          className={`btn btn-primary btn-block btn-sm product-card__add ${
            justAdded ? "is-added" : ""
          }`}
          onClick={handleAdd}
          disabled={!product.inStock}
        >
          {!product.inStock
            ? "Unavailable"
            : justAdded
            ? "Added ✓"
            : cartQtyForSelection >= 1
            ? `Add more`
            : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
