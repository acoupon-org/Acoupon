# ACoupon — Vercel production setup

## Runtime
- Vite + React frontend
- Native Node HTTP API exposed through `api/[...path].js`
- Live providers are fetched server-side; API credentials never enter the browser.

## Data flow
1. Provider calls are requested in parallel.
2. Provider-side requests use `limit=100` where supported.
3. Responses are normalized into one ACoupon schema.
4. Category, store, query and coupon/deal type filters are applied on the server.
5. Results are deduplicated and capped at **25 web results**.
6. Server cache is 60 seconds; Vercel can serve stale data for up to 180 seconds while refreshing.

## Environment variables
Set these in Vercel Project Settings → Environment Variables:
- `RAPIDAPI_KEY`
- `LINKMYDEALS_API_KEY`
- `LINKMYDEALS_FEED_URL` (optional)
- `FEED_CACHE_TTL_MS` (optional, default 60000)
- `FEED_TIMEOUT_MS` (optional, default 12000)

Do not use `VITE_` for private provider credentials.

## API examples
- `/api/stores?category=Travel`
- `/api/stores?store=makemytrip`
- `/api/coupons?category=Fashion`
- `/api/coupons?store=myntra`
- `/api/deals?category=Travel`
- `/api/deals?store=redbus`
- `/api/coupons?query=amazon`

Each customer-facing endpoint returns at most 25 records. The server fetches/requests up to 100 records from providers before filtering whenever the provider supports that parameter.

## Travel quick access
The homepage contains a lightweight static quick-access section for redBus and MakeMyTrip. These cards do not block the live offer API requests and use lazy-loaded brand assets.

## Local development
Run the API and frontend separately:
- `npm run dev:server`
- `npm run dev`

Vite proxies `/api` to `http://localhost:4000` during development.
