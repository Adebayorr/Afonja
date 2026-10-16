import { useEffect, useState } from "react";
import AdminPinGate, { PIN_STORAGE_KEY } from "../components/AdminPinGate";
import { fetchCatalog, saveCatalog } from "../utils/adminApi";
import { PRODUCTS as SEED_PRODUCTS } from "../data/products";
import "./Admin.css";

export default function Admin() {
  const [pin, setPin] = useState(() => window.sessionStorage.getItem(PIN_STORAGE_KEY) || "");
  const [products, setProducts] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [usingLiveApi, setUsingLiveApi] = useState(true);

  useEffect(() => {
    if (!pin) return;
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchCatalog();
        if (!cancelled) {
          const ids = new Set(data.map((r) => r.id));
          const missing = SEED_PRODUCTS.filter((p) => !ids.has(p.id)).map(stripImages);
          setProducts([...data, ...missing]);
          if (missing.length) setDirty(true);
          setUsingLiveApi(true);
        }
      } catch {
        if (!cancelled) {
          // Strip bundled image objects — they can't be serialized/edited
          // meaningfully here, only price/name/stock fields matter.
          setProducts(SEED_PRODUCTS.map(stripImages));
          setUsingLiveApi(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [pin]);

  function stripImages(product) {
    return {
      ...product,
      image: undefined,
      options: product.options.map(({ image, ...rest }) => rest),
    };
  }

  function handleLogout() {
    window.sessionStorage.removeItem(PIN_STORAGE_KEY);
    setPin("");
    setProducts(null);
  }

  function updateProduct(id, updates) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    setDirty(true);
  }

  function updateOption(productId, optionId, updates) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id !== productId
          ? p
          : {
              ...p,
              options: p.options.map((opt) =>
                opt.id === optionId ? { ...opt, ...updates } : opt
              ),
            }
      )
    );
    setDirty(true);
  }

  async function handleSave() {
    if (!usingLiveApi) {
      setStatus({
        state: "error",
        message: "No Worker connected yet — connect Cloudflare (see README) before saving.",
      });
      return;
    }
    setStatus({ state: "saving", message: "Saving…" });
    try {
      await saveCatalog(pin, products);
      setDirty(false);
      setStatus({ state: "success", message: "Saved. Changes are live on the site." });
    } catch (err) {
      if (err.message === "WRONG_PIN") {
        handleLogout();
        return;
      }
      setStatus({ state: "error", message: "Couldn't save — check your connection and try again." });
    }
  }

  if (!pin) {
    return <AdminPinGate onUnlock={setPin} />;
  }

  if (!products) {
    return (
      <div className="admin-loading">
        <p>Loading inventory…</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="container admin-header__row">
          <div>
            <h1>Inventory manager</h1>
            <p>Update prices and mark products in or out of stock.</p>
          </div>
          <div className="admin-header__actions">
            <a href="/" className="btn btn-outline btn-sm">
              View site
            </a>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      {!usingLiveApi && (
        <div className="container">
          <p className="admin-banner admin-banner--warn">
            Not connected to the Cloudflare Worker yet, so changes here won't
            be saved. Deploy the Worker in <code>/worker</code> and set
            <code> VITE_API_URL</code> — see the README.
          </p>
        </div>
      )}

      <div className="container">
        <div className="admin-table">
          {products.map((product) => (
            <div className="admin-product" key={product.id}>
              <div className="admin-product__head">
                <div>
                  <h2>{product.name}</h2>
                  <span className="admin-product__category">{product.category}</span>
                </div>
                <label className="stock-toggle">
                  <input
                    type="checkbox"
                    checked={product.inStock}
                    onChange={(e) => updateProduct(product.id, { inStock: e.target.checked })}
                  />
                  <span className="stock-toggle__track">
                    <span className="stock-toggle__thumb" />
                  </span>
                  {product.inStock ? "In stock" : "Out of stock"}
                </label>
              </div>

              <div className="admin-options">
                {product.options.map((opt) => (
                  <div className="admin-option" key={opt.id}>
                    <span className="admin-option__label">{opt.label}</span>
                    <div className="admin-option__price">
                      <span>₦</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={opt.price}
                        onChange={(e) =>
                          updateOption(product.id, opt.id, {
                            price: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`admin-savebar ${dirty ? "is-visible" : ""}`}>
        <div className="container admin-savebar__row">
          <span>{status.message || "Unsaved changes"}</span>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={status.state === "saving"}
          >
            {status.state === "saving" ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
