const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

function toParams(input = "") {
  if (typeof input === "string") return input ? { query: input } : {};
  return input || {};
}

function encodeParams(input = {}) {
  const params = new URLSearchParams({ limit: "25" });
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && value !== null && String(value) !== "") params.set(key, String(value));
  }
  return params.toString();
}

export function getStores(filters = "") {
  const input = typeof filters === "string" ? { category: filters } : filters;
  return request(`/stores?${encodeParams(input)}`);
}

export function getCoupons(filters = "") {
  const input = toParams(filters);
  return request(`/coupons?${encodeParams({ ...input, type: input.type || "coupon" })}`);
}

export function getDeals(filters = "") {
  const input = toParams(filters);
  return request(`/deals?${encodeParams(input)}`);
}

export function getCashback(merchant) {
  return request(`/cashback?merchant=${encodeURIComponent(merchant)}`);
}

export function getProviderStatus() { return request("/providers/status"); }
