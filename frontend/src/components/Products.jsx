import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { CATEGORIES } from "../data/products";
import "./Products.css";

export default function Products({ products }) {
  const [activeCategory, setActiveCategory] = useState("all");

  // Available products first, out-of-stock ones last. Within each group the
  // cards are interleaved by their image backdrop (green / gray) so the
  // alternating look is preserved, continuing the pattern across the two groups.
  const visible = useMemo(() => {
    const list =
      activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);

    const queues = {
      available: list.filter((p) => p.inStock),
      unavailable: list.filter((p) => !p.inStock),
    };

    const result = [];
    let want = "green";
    for (const group of [queues.available, queues.unavailable]) {
      const pool = [...group];
      while (pool.length) {
        let i = pool.findIndex((p) => p.tone === want);
        if (i === -1) i = 0; // no more of that colour — just take the next one
        const [next] = pool.splice(i, 1);
        result.push(next);
        want = next.tone === "green" ? "gray" : "green";
      }
    }
    return result;
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
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} variant={product.tone === "gray" ? "white" : "green"} />
            ))}
          </div>
        ) : (
          <p className="products__empty">No products in this category right now — check back soon.</p>
        )}
      </div>
    </section>
  );
}
