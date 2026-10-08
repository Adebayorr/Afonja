import { API_URL } from "../config";

// Used only to validate the PIN at login time — doesn't touch product data.
export async function verifyPin(pin) {
  const res = await fetch(`${API_URL}/admin/verify`, {
    headers: { "x-admin-pin": pin },
  });
  return res.ok;
}

export async function fetchCatalog() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error(`Failed to load catalog (${res.status})`);
  return res.json();
}

// Replaces the whole product catalog in KV. The Worker checks the
// x-admin-pin header against its ADMIN_PIN secret before writing.
export async function saveCatalog(pin, products) {
  const res = await fetch(`${API_URL}/products`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-pin": pin,
    },
    body: JSON.stringify(products),
  });

  if (res.status === 401) {
    throw new Error("WRONG_PIN");
  }
  if (!res.ok) {
    throw new Error(`Failed to save catalog (${res.status})`);
  }
  return res.json();
}
