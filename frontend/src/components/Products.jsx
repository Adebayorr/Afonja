import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { CATEGORIES } from "../data/products";
import "./Products.css";

export default function Products({ products }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const visible = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <section className="section products" id="products">
      <div className="container">
        <div className="section-head">
          <h2>Fresh Frozen Foods</h2>
          <p>Items that you can't just miss</p>
        </div>

        <div className="category-row" role="tablist" aria-label="Filter products by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`category-chip ${activeCategory === cat.id ? "is-active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {visible.length > 0 ? (
          <div className="product-grid">
            {visible.map((product, index) => (
              <ProductCard key={product.id} product={product} variant={index % 2 === 0 ? "green" : "white"} />
            ))}
          </div>
        ) : (
          <p className="products__empty">No products in this category right now — check back soon.</p>
        )}
      </div>
    </section>
  );
}
