import "dotenv/config";
import http from "node:http";
import { URL } from "node:url";
import { getMcpStatus, mcpServers, callBestTool } from "./mcp.js";

const PORT = Number(process.env.PORT || 4000);
const WEB_LIMIT = 25;
const PROVIDER_LIMIT = 100;
const LIMIT = WEB_LIMIT;
const CACHE_TTL_MS = Number(process.env.FEED_CACHE_TTL_MS || 60000);
const LINKMYDEALS_URL = process.env.LINKMYDEALS_FEED_URL || "https://feed.linkmydeals.com/getOffers/";
const LINKMYDEALS_API_KEY = process.env.LINKMYDEALS_API_KEY || "";
const CASHJOSH_BASE_URL = "https://cashjosh.com/api/v1";

const categoryAliases = {
  fashion: "Fashion", shopping: "Shopping", electronics: "Electronics", beauty: "Beauty", health: "Health",
  grocery: "Grocery", travel: "Travel", sports: "Sports", food: "Food", transport: "Transport",
  recharge: "Recharge", bills: "Bills", hotels: "Hotels", hotel: "Hotels", restaurants: "Restaurants", restaurant: "Restaurants",
  "food-dining": "Food", "recharge-bills": "Recharge", cab: "Transport",
  "home-living": "Home", "software-services": "Software", entertainment: "Entertainment",
  education: "Education", "bank-payment": "Bank & Payment", automotive: "Automotive",
  "baby-kids": "Baby & Kids", "pet-care": "Pet Care", gifts: "Gifts & Occasions",
  "local-deals": "Local Deals",
};

const cache = new Map();
function cached(key, loader, ttl = CACHE_TTL_MS) {
  const existing = cache.get(key);
  if (existing && existing.expiresAt > Date.now()) return existing.promise;
  const promise = Promise.resolve().then(loader).catch((error) => {
    cache.delete(key);
    throw error;
  });
  cache.set(key, { promise, expiresAt: Date.now() + ttl });
  return promise;
}

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=180",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(body);
}

function safeHttpUrl(value, fallback = "") {
  if (!value || typeof value !== "string") return fallback;
  try {
    const parsed = new URL(value.trim());
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.toString() : fallback;
  } catch { return fallback; }
}

function resolveUrl(value, base = "") {
  if (!value || typeof value !== "string") return "";
  const absolute = safeHttpUrl(value);
  if (absolute) return absolute;
  try { return safeHttpUrl(new URL(value.trim(), base).toString()); } catch { return ""; }
}

function faviconForUrl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return `https://icons.duckduckgo.com/ip3/${host}.ico`;
  } catch { return ""; }
}

function scalar(value, fallback = "") {
  if (value == null) return fallback;

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    return (
      value.name ||
      value.domain ||
      value.storeName ||
      value.merchant ||
      value.title ||
      value.url ||
      fallback
    );
  }

  return fallback;
}

function objectUrl(value) {
  if (!value || typeof value !== "object") return "";

  return (
    value.url ||
    value.href ||
    value.link ||
    value.website ||
    value.domain ||
    ""
  );
}

function firstUrl(item, keys, fallback = "", base = "") {
  for (const key of keys) {
    const value = item?.[key];

    const url = resolveUrl(
      typeof value === "object" ? objectUrl(value) : value,
      base
    );

    if (url) return url;
  }
  return fallback;
}

function normalizeKey(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

const categoryLookup = Object.fromEntries(Object.entries(categoryAliases).map(([key, value]) => [normalizeKey(key), normalizeKey(value)]));

function canonicalCategory(value) {
  const key = normalizeKey(value);
  return categoryLookup[key] || key;
}

function slugify(value) {
  return String(value || "store").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "store";
}

function normalizeItems(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (payload.result) return normalizeItems(payload.result);
  if (payload.structuredContent) return normalizeItems(payload.structuredContent);
  if (Array.isArray(payload.content)) {
    for (const part of payload.content) {
      if (part?.type === "text" && typeof part.text === "string") {
        try {
          const parsed = JSON.parse(part.text);
          const items = normalizeItems(parsed);
          if (items.length) return items;
        } catch {}
      }
    }
  }
  for (const key of ["data", "results", "items", "coupons", "deals", "offers", "stores", "promocodes", "promoCodes", "records"])
    if (Array.isArray(payload[key])) return payload[key];
  return [];
}

const demoStores = [
  { name: "Amazon", slug: "amazon", category: "Shopping", categories: ["Shopping", "Electronics"], cashbackRate: 8, description: "Everyday shopping, electronics and more.", url: "https://www.amazon.in/" },
  { name: "AJIO", slug: "ajio", category: "Fashion", categories: ["Fashion", "Shopping"], cashbackRate: 12, description: "Fashion, footwear and accessories.", url: "https://www.ajio.com/" },
  { name: "Myntra", slug: "myntra", category: "Fashion", categories: ["Fashion"], cashbackRate: 10, description: "Fashion and lifestyle deals.", url: "https://www.myntra.com/" },
  { name: "Flipkart", slug: "flipkart", category: "Shopping", categories: ["Shopping", "Electronics"], cashbackRate: 7, description: "Shopping across thousands of products.", url: "https://www.flipkart.com/" },
  { name: "Swiggy", slug: "swiggy", category: "Food", categories: ["Food", "Grocery"], cashbackRate: 6, description: "Food delivery and quick commerce.", url: "https://www.swiggy.com/" },
  { name: "Zomato", slug: "zomato", category: "Food", categories: ["Food", "Restaurants"], cashbackRate: 5, description: "Restaurants and food delivery.", url: "https://www.zomato.com/" },
  { name: "Blinkit", slug: "blinkit", category: "Grocery", categories: ["Grocery"], cashbackRate: 5, description: "Quick grocery and daily essentials.", url: "https://blinkit.com/" },
  { name: "Zepto", slug: "zepto", category: "Grocery", categories: ["Grocery"], cashbackRate: 5, description: "Quick commerce and daily needs.", url: "https://www.zeptonow.com/" },
  { name: "Ola", slug: "ola", category: "Transport", categories: ["Transport", "Travel"], cashbackRate: 4, description: "Cab and mobility offers.", url: "https://www.olacabs.com/" },
  { name: "Uber", slug: "uber", category: "Transport", categories: ["Transport", "Travel"], cashbackRate: 4, description: "Ride and travel offers.", url: "https://www.uber.com/in/en/" },
  { name: "MakeMyTrip", slug: "makemytrip", category: "Travel", categories: ["Travel", "Hotels"], cashbackRate: 9, description: "Flights, hotels and holiday offers.", url: "https://www.makemytrip.com/" },
  { name: "redBus", slug: "redbus", category: "Travel", categories: ["Travel", "Transport"], cashbackRate: 5, description: "Bus tickets and travel offers.", url: "https://www.redbus.in/" },
  { name: "Nykaa", slug: "nykaa", category: "Beauty", categories: ["Beauty"], cashbackRate: 9, description: "Beauty, skincare and personal care.", url: "https://www.nykaa.com/" },
];

const storeDomains = Object.fromEntries(demoStores.map((s) => [s.slug, s.url]));

function normalizeStore(item, index, source, base = "") {
  const rawName =
    item.storeName ||
    item.store ||
    item.merchant ||
    item.name ||
    item.title ||
    `Store ${index + 1}`;

  const name = scalar(rawName, `Store ${index + 1}`);
  const key = normalizeKey(name);
  const storeUrl = firstUrl(item, ["storeUrl", "storeURL", "website", "websiteUrl", "merchantUrl", "Merchant Homepage", "url", "link"], storeDomains[key] || "", base);
  const logo = firstUrl(item, ["logo", "logoUrl", "logo_url", "storeLogo", "storeLogoUrl", "merchantLogo", "merchantLogoUrl", "image", "Image"], "", base) || faviconForUrl(storeUrl);
  const cashback = item.cashbackRate ?? item.cashback?.rate ?? item.cashback ?? item.cashback_percentage ?? item.cashbackPercent;
  const categories = Array.isArray(item.categories) ? item.categories : String(item.categories || item.category || item.categoryName || "Deals").split(",").map((x) => x.trim()).filter(Boolean);
  return {
    ...item,
    name, slug: slugify(name), category: categories[0] || "Deals", categories,
    cashbackRate: cashback, logo, logoUrl: logo, url: storeUrl,
    description: item.description || item.title || "Latest offers and savings.", image: firstUrl(item, ["image", "imageUrl", "banner", "bannerUrl", "thumbnail", "thumbnailUrl", "storeImage", "storeImageUrl"], "", base) || logo, source,
  };
}

function normalizeCoupon(item, source, index, base = "") {
  const rawStore =
    item.storeName ||
    item.store ||
    item.merchant ||
    item.brand ||
    item.shop ||
    item.vendor ||
    item.Store ||
    "Store";

  const store = scalar(rawStore, "Store");
  const key = normalizeKey(store);
  const offerUrl = firstUrl(item, [
    "affiliateLink", "Affiliate Link", "affiliateUrl", "affiliateURL", "trackingUrl", "redirectUrl", "clickUrl",
    "url", "URL", "link", "offerUrl", "offerURL", "couponUrl", "couponURL", "dealUrl", "dealURL", "Merchant Homepage"
  ], storeDomains[key] || "", base);
  const logo = firstUrl(item, ["logo", "logoUrl", "storeLogo", "storeLogoUrl", "merchantLogo", "merchantLogoUrl", "brandLogo", "Logo"], "", base) || faviconForUrl(offerUrl);
  const image = firstUrl(item, ["image", "imageUrl", "banner", "bannerUrl", "thumbnail", "thumbnailUrl", "dealImage", "couponImage", "creative", "Image"], "", base) || logo || faviconForUrl(offerUrl);
  const title = item.title || item.Title || item.offerText || item["Offer Text"] || item.name || item.description || item.offer || "Latest offer";
  const code = item.code || item.couponCode || item["Coupon Code"] || item.promoCode || item.promo_code || item.voucherCode || "";
  const discount = item.discount || item.discountText || item.offerText || item["Offer Value"] || item["Offer"] || item.savings || item.value || item.deal || "Special offer";
  const expires = item.expires || item.expiry || item.expiryDate || item.endDate || item["End Date"] || item.validUntil || "";
  const categories = Array.isArray(item.categories) ? item.categories : String(item.categories || item.category || item.categoryName || "").split(",").map((x) => x.trim()).filter(Boolean);
  const type = getItemType({ ...item, code, couponCode: code });
  const id = item.id || item.couponId || item.dealId || item["LMD ID"] || `${key}-${index}-${slugify(title).slice(0, 30)}`;
  return {
    ...item, id: String(id), store, storeSlug: slugify(store), title, code, discount: String(discount), expires, categories, category: categories[0] || item.category || "Deals", type,
    logo, storeLogo: logo, image, url: offerUrl,
    verified: Boolean(item.verified ?? item.verifiedCoupon ?? (item["Publisher Exclusive"] === "Yes") ?? false),
    hot: Boolean(item.hot || item.Hot || item.featured === "Yes" || item.Featured === "Yes"),
    source,
  };
}


function normalizeFilter(value) {
  return normalizeKey(scalar(value, value));
}

function getItemCategories(item) {
  const values = [
    ...(Array.isArray(item.categories) ? item.categories : []),
    item.category,
    item.categoryName,
    item.Category,
    item.category_name,
  ];
  return values.map((value) => canonicalCategory(value)).filter(Boolean);
}

function getItemStore(item) {
  return normalizeFilter(item.store || item.storeName || item.merchant || item.brand || item.shop || item.vendor || item.Store);
}

function matchesStoreFilter(item, storeFilter) {
  const wanted = normalizeFilter(storeFilter);
  if (!wanted) return true;
  const raw = item.store || item.storeName || item.merchant || item.brand || item.shop || item.vendor || item.Store || "";
  const actual = normalizeFilter(raw);
  const slug = slugify(scalar(raw, ""));
  return actual === wanted || slug === String(storeFilter || "").toLowerCase();
}

function getItemType(item) {
  const explicit = scalar(item.type || item.offerType || item.couponType || item.kind || item.contentType || item.dealType, "").toLowerCase();
  if (explicit.includes("coupon") || explicit.includes("promo") || explicit.includes("voucher")) return "coupon";
  if (explicit.includes("deal") || explicit.includes("offer")) return "deal";
  return item.code || item.couponCode || item.promoCode || item.voucherCode ? "coupon" : "deal";
}

function matchesFilters(item, { query = "", category = "", store = "", type = "" } = {}) {
  const normalizedCategory = normalizeFilter(category);
  const normalizedStore = normalizeFilter(store);
  const normalizedQuery = String(query || "").trim().toLowerCase();

  if (normalizedCategory) {
    const categories = getItemCategories(item);
    if (!categories.includes(canonicalCategory(normalizedCategory))) return false;
  }

  if (normalizedStore && !matchesStoreFilter(item, store)) return false;

  if (type && getItemType(item) !== type) return false;

  if (normalizedQuery) {
    const haystack = JSON.stringify(item).toLowerCase();
    if (!haystack.includes(normalizedQuery)) return false;
  }

  return true;
}

function filterAndLimit(items, filters = {}) {
  return items.filter((item) => matchesFilters(item, filters)).slice(0, WEB_LIMIT);
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Number(process.env.FEED_TIMEOUT_MS || 12000));
  try {
    const response = await fetch(url, { ...options, signal: controller.signal, headers: { Accept: "application/json", ...(options.headers || {}) } });
    const text = await response.text();
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 300)}`);
    try { return JSON.parse(text); } catch { throw new Error("Provider returned non-JSON response"); }
  } finally { clearTimeout(timer); }
}

async function fetchCashback(merchant) {
  if (!merchant) throw new Error("merchant is required");
  const url = `${CASHJOSH_BASE_URL}/cashback?merchant=${encodeURIComponent(merchant)}`;
  return cached(`cashback:${merchant}`, () => fetchJson(url));
}

async function fetchCashJoshCoupons(query = "") {
  const params = new URLSearchParams({ limit: String(PROVIDER_LIMIT) });
  if (query && /\.[a-z]{2,}$/i.test(query)) { params.set("merchant", query); params.set("codeOnly", "true"); }
  const url = `${CASHJOSH_BASE_URL}/coupons?${params.toString()}`;
  const payload = await cached(`cashjosh-coupons:${query}`, () => fetchJson(url));
  return normalizeItems(payload).slice(0, PROVIDER_LIMIT).map((item, i) => normalizeCoupon(item, "CashJosh", i, CASHJOSH_BASE_URL));
}

async function fetchCashJoshStores(category = "") {
  const params = new URLSearchParams({ limit: String(PROVIDER_LIMIT), sort: "cashback" });
  if (category) params.set("category", category);
  const url = `${CASHJOSH_BASE_URL}/stores?${params.toString()}`;
  const payload = await cached(`cashjosh-stores:${category}`, () => fetchJson(url));
  return normalizeItems(payload).slice(0, PROVIDER_LIMIT).map((item, i) => normalizeStore(item, i, "CashJosh", CASHJOSH_BASE_URL));
}

async function fetchLinkMyDeals(query = "") {
  if (!LINKMYDEALS_API_KEY) throw new Error("LINKMYDEALS_API_KEY is not configured");
  const params = new URLSearchParams({ API_KEY: LINKMYDEALS_API_KEY, format: "json", off_record: "1" });
  const payload = await cached("linkmydeals:full", () => fetchJson(`${LINKMYDEALS_URL}?${params.toString()}`));
  const items = normalizeItems(payload);
  const filtered = query ? items.filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase())) : items;
  return filtered.slice(0, PROVIDER_LIMIT).map((item, i) => normalizeCoupon(item, "LinkMyDeals", i, LINKMYDEALS_URL));
}

async function fetchMcpCoupons(query = "") {
  return cached(`mcp-coupons:${query}`, async () => {
    const sources = [mcpServers.freeCoupons, mcpServers.linkMyDeals, mcpServers.promoCodes, mcpServers.deals];
    const results = await Promise.allSettled(sources.map((server) => callBestTool(server, {
      query, limit: PROVIDER_LIMIT, keywords: ["coupon", "promo", "code", "offer", "deal"]
    })));
    return results.flatMap((result, index) => result.status === "fulfilled"
      ? normalizeItems(result.value.result).slice(0, PROVIDER_LIMIT).map((item, i) => normalizeCoupon(item, sources[index].name, i))
      : []);
  });
}

function dedupeCoupons(items) {
  const map = new Map();
  for (const item of items) {
    const key = [normalizeKey(item.store), normalizeKey(item.code || item.title), safeHttpUrl(item.url)].join("|");
    if (!map.has(key)) map.set(key, item);
    else {
      const old = map.get(key);
      if ((!old.image || old.image === old.logo) && item.image) map.set(key, { ...old, ...item });
      else if (!old.verified && item.verified) map.set(key, { ...old, verified: true });
    }
  }
  return [...map.values()];
}

function rankCoupons(items) {
  return [...items].sort((a, b) => Number(b.verified) - Number(a.verified) || Number(b.hot) - Number(a.hot) || String(a.store).localeCompare(String(b.store)));
}

async function fetchCoupons({ query = "", category = "", store = "", type = "" } = {}) {
  const results = await Promise.allSettled([
    fetchLinkMyDeals(query),
    fetchCashJoshCoupons(query),
    fetchMcpCoupons(query),
  ]);
  const all = rankCoupons(dedupeCoupons(results.flatMap((r) => r.status === "fulfilled" ? r.value : [])));
  const data = filterAndLimit(all, { query, category, store, type });
  return {
    source: data.length ? "live-aggregate" : "none",
    limit: WEB_LIMIT,
    providerLimit: PROVIDER_LIMIT,
    filters: { query, category, store, type },
    providers: { linkmydeals: results[0].status === "fulfilled", cashjosh: results[1].status === "fulfilled", rapidapiMcp: results[2].status === "fulfilled" },
    data,
  };
}

async function fetchStores(category = "", store = "", query = "") {
  const apiCategory = categoryAliases[String(category).toLowerCase()] || category;
  const [cash, mcp] = await Promise.allSettled([
    fetchCashJoshStores(apiCategory),
    Promise.allSettled(Object.values(mcpServers).map((server) => callBestTool(server, { category: apiCategory, query: store || query || apiCategory, store, limit: PROVIDER_LIMIT, keywords: ["store", "merchant", "shop", "deal", "offer"] })))
  ]);
  const mcpItems = mcp.status === "fulfilled" ? mcp.value.flatMap((r, sourceIndex) => r.status === "fulfilled" ? normalizeItems(r.value.result).slice(0, PROVIDER_LIMIT).map((item, i) => normalizeStore(item, i, Object.values(mcpServers)[sourceIndex].name)) : []) : [];
  const cashItems = cash.status === "fulfilled" ? cash.value : [];
  const all = [...cashItems, ...mcpItems];
  const unique = [...new Map(all.map((s) => [normalizeKey(s.name), s])).values()];
  const filtered = unique.filter((item) => matchesFilters(item, { category, store, query })).slice(0, WEB_LIMIT);
  return {
    source: filtered.length ? "live-aggregate" : "demo-fallback",
    category,
    store,
    query,
    limit: WEB_LIMIT,
    providerLimit: PROVIDER_LIMIT,
    data: filtered.length ? filtered : (category || store ? [] : demoStores.slice(0, WEB_LIMIT)),
  };
}

const demoCoupons = [
  { id: "amazon-1", store: "Amazon", title: "Save on selected products", code: "ACSAVE", discount: "Up to 20% OFF", verified: true, expires: "30 Sep 2026", url: storeDomains.amazon, image: faviconForUrl(storeDomains.amazon), logo: faviconForUrl(storeDomains.amazon), source: "demo" },
  { id: "ajio-1", store: "AJIO", title: "Extra savings on fashion", code: "AJIO20", discount: "Extra 20% OFF", verified: true, expires: "28 Sep 2026", url: storeDomains.ajio, image: faviconForUrl(storeDomains.ajio), logo: faviconForUrl(storeDomains.ajio), source: "demo" },
];

const requestHandler = async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === "OPTIONS") return json(res, 204, {});

    if (requestUrl.pathname === "/api/health") return json(res, 200, { ok: true, service: "acoupon-api", limit: LIMIT, providers: ["CashJosh", "LinkMyDeals", "RapidAPI MCP"] });
    if (requestUrl.pathname === "/api/mcp/status") return json(res, 200, { ok: true, configured: Boolean(process.env.RAPIDAPI_KEY), servers: await getMcpStatus() });
    if (requestUrl.pathname === "/api/providers/status") {
      const status = { cashjosh: false, linkmydeals: Boolean(LINKMYDEALS_API_KEY), rapidapiMcp: Boolean(process.env.RAPIDAPI_KEY) };
      const checks = await Promise.allSettled([fetchCashJoshStores("Beauty"), LINKMYDEALS_API_KEY ? fetchLinkMyDeals() : Promise.reject(new Error("API key missing"))]);
      status.cashjosh = checks[0].status === "fulfilled";
      status.linkmydeals = checks[1].status === "fulfilled";
      return json(res, 200, { ok: Object.values(status).some(Boolean), limit: LIMIT, status, cacheTtlMs: CACHE_TTL_MS });
    }
    if (requestUrl.pathname === "/api/cashback") {
      const merchant = requestUrl.searchParams.get("merchant") || "";
      return json(res, 200, await fetchCashback(merchant));
    }
    if (requestUrl.pathname === "/api/linkmydeals") return json(res, 200, { source: "LinkMyDeals", limit: WEB_LIMIT, providerLimit: PROVIDER_LIMIT, data: (await fetchLinkMyDeals(requestUrl.searchParams.get("query") || "")).slice(0, WEB_LIMIT) });
    if (requestUrl.pathname === "/api/cashjosh/coupons") return json(res, 200, { source: "CashJosh", limit: WEB_LIMIT, providerLimit: PROVIDER_LIMIT, data: (await fetchCashJoshCoupons(requestUrl.searchParams.get("query") || "")).slice(0, WEB_LIMIT) });
    if (requestUrl.pathname === "/api/cashjosh/stores") return json(res, 200, { source: "CashJosh", limit: WEB_LIMIT, providerLimit: PROVIDER_LIMIT, data: (await fetchCashJoshStores(requestUrl.searchParams.get("category") || "")).slice(0, WEB_LIMIT) });
    if (requestUrl.pathname === "/api/stores") return json(res, 200, await fetchStores(requestUrl.searchParams.get("category") || "", requestUrl.searchParams.get("store") || "", requestUrl.searchParams.get("query") || ""));
    if (requestUrl.pathname === "/api/coupons" || requestUrl.pathname === "/api/deals") {
      const filters = {
        query: requestUrl.searchParams.get("query") || "",
        category: requestUrl.searchParams.get("category") || "",
        store: requestUrl.searchParams.get("store") || "",
        type: requestUrl.pathname === "/api/deals" ? "deal" : (requestUrl.searchParams.get("type") || "coupon"),
      };
      try { return json(res, 200, await fetchCoupons(filters)); }
      catch (error) { return json(res, 200, { source: "demo-fallback", limit: WEB_LIMIT, providerLimit: PROVIDER_LIMIT, error: error.message, data: filters.type === "deal" ? [] : demoCoupons }); }
    }
    if (requestUrl.pathname === "/api/categories") return json(res, 200, { limit: WEB_LIMIT, providerLimit: PROVIDER_LIMIT, data: Object.entries(categoryAliases).map(([slug, name]) => ({ slug, name })) });
    return json(res, 404, { error: "Not found" });
  } catch (error) { return json(res, 500, { error: error.message }); }
};

const server = http.createServer(requestHandler);

if (process.env.VERCEL !== "1") {
  server.listen(PORT, () => {
    console.log(`ACoupon API running at http://localhost:${PORT}`);
  });
}

export default requestHandler;
