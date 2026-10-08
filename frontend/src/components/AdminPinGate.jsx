import { useState } from "react";
import { verifyPin } from "../utils/adminApi";
import "./AdminPinGate.css";

export const PIN_STORAGE_KEY = "afonja-admin-pin";

export default function AdminPinGate({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!pin.trim()) return;
    setChecking(true);
    setError("");
    try {
      const ok = await verifyPin(pin.trim());
      if (!ok) {
        setError("That PIN isn't right. Try again.");
        return;
      }
      window.sessionStorage.setItem(PIN_STORAGE_KEY, pin.trim());
      onUnlock(pin.trim());
    } catch {
      setError("Couldn't reach the inventory server. Check your connection and try again.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="pin-gate">
      <form className="pin-gate__card" onSubmit={handleSubmit}>
        <span className="pin-gate__mark">❄</span>
        <h1>Inventory access</h1>
        <p>Enter the owner PIN to manage products and stock.</p>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          autoFocus
        />
        {error && <p className="pin-gate__error">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={checking}>
          {checking ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}
