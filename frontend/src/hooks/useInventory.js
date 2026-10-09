import { useEffect, useState } from "react";
import { PRODUCTS } from "../data/products";
import { API_URL } from "../config";

// The Worker stores products as plain JSON in KV, keyed by product id, in
// the same shape as data/products.js — minus the imported image, since KV
// can't hold a bundled asset. We re-attach the local image by id so the
// Worker only ever needs to own text data (name, price, inStock).
function mergeWithLocalImages(remoteProducts) {
  const byId = new Map(PRODUCTS.map((p) => [p.id, p]));
  return remoteProducts.map((remote) => {
    const local = byId.get(remote.id);
    return {
      ...remote,
      image: local?.image ?? null,
      tone: local?.tone ?? remote.tone ?? null,
      options: remote.options.map((opt, i) => ({
        ...opt,
        image: opt.image ?? local?.options?.[i]?.image ?? local?.image ?? null,
      })),
    };
  });
}

export function useInventory() {
  const [products, setProducts] = useState(PRODUCTS);
  const [source, setSource] = useState("seed"); // "seed" | "live"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error(`API responded ${res.status}`);
        const data = await res.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setProducts(mergeWithLocalImages(data));
          setSource("live");
        }
      } catch (err) {
        // No Worker deployed yet, or it's unreachable — the site still
        // works fully off the local seed catalog.
        if (!cancelled) setSource("seed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, source, loading };
}
