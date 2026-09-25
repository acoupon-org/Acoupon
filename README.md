# ACoupon — Production-Oriented Live Coupon & Cashback Platform

ACoupon is an India-focused React/Vite/Tailwind coupon, deal and cashback platform. The frontend uses a single normalized API layer so provider changes do not leak into the UI.

## Live provider architecture

- **CashJosh REST API** — cashback lookup, cashback stores and live coupons. CashJosh documents a no-key JSON API at `https://cashjosh.com/api/v1`; responses are India-only and edge-cached by CashJosh for five minutes.
- **CashJosh MCP** — optional agent integration via `npx -y cashjosh-mcp`.
- **LinkMyDeals REST feed** — JSON coupon/deal feed using `API_KEY` and `format=json`.
- **Four RapidAPI MCP sources** — BlipADeal Worldwide Deals, Free Coupon Codes, LinkMyDeals Coupon Feed and Get Promo Codes.

The ACoupon backend normalizes provider fields into a common offer model, deduplicates overlapping records, keeps external/affiliate URLs intact, supplies image/logo fallbacks, and limits each provider request/result path to **25** records where the provider supports a limit parameter. LinkMyDeals does not document a server-side limit parameter, so ACoupon requests its feed and caps the normalized result to 25 locally.

## Environment

Copy `.env.example` to `.env` and set your own credentials:

```text
RAPIDAPI_KEY=...
LINKMYDEALS_API_KEY=...
```

Never put either key in `VITE_*` variables or frontend source code.

## Run

Requires Node.js 20.19+.

```bash
npm install
copy .env.example .env
npm run dev:server
npm run dev:client
```

Open `http://localhost:5173`.

## API endpoints

```text
GET /api/health
GET /api/providers/status
GET /api/mcp/status
GET /api/coupons?query=Amazon
GET /api/stores?category=Shopping
GET /api/cashback?merchant=mcaffeine.com
GET /api/cashjosh/coupons
GET /api/cashjosh/stores?category=Beauty
GET /api/linkmydeals?query=Amazon
```

## Feed behavior

- Default application result limit: **25**.
- Short server-side feed cache prevents hammering providers; default is five minutes.
- Provider calls have a timeout.
- Failed providers do not take down the aggregate feed.
- Coupon cards preserve working offer/affiliate links.
- Images use provider images first, then merchant logos/favicons.
- Duplicate offers are collapsed using merchant, code/title and URL signals.
- Cashback links from CashJosh preserve `shopUrl` so attribution can work.

## CashJosh examples

The backend uses the documented endpoints:

```text
GET https://cashjosh.com/api/v1/cashback?merchant=mcaffeine.com
GET https://cashjosh.com/api/v1/stores?category=Beauty&sort=cashback&limit=25
GET https://cashjosh.com/api/v1/coupons?merchant=mcaffeine.com&codeOnly=true&limit=25
```

CashJosh's published documentation says the API is un-keyed, India-only, returns cashback as a percentage, and supports `cashback`, `stores`, `stores/{slug}`, `coupons`, and `index` endpoints.

## Production notes

Before public launch, add a persistent database/cache, scheduled feed synchronization, link health checks, analytics, rate limiting, observability, error reporting, and a real admin workflow for featured offers, merchants, categories and SEO pages.
