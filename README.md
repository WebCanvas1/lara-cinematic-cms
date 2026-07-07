# Lara Cinematography — Cloudflare Pages CMS

A React + Vite static site with a lightweight admin CMS, powered entirely by
Cloudflare Pages Functions and Cloudflare KV. No external database, no
external storage — images are compressed to Base64 and stored in KV.

## Tech stack

- React 19 + Vite + Tailwind v4 + TanStack Query
- `react-router-dom` HashRouter
- Cloudflare Pages Functions in `/functions`
- Cloudflare KV binding `LARA_CINEMATOGRAPHY_KV`
- Auth: shared `ADMIN_PASSWORD` env var + HMAC-SHA-256 signed HttpOnly cookie

## Local dev

```bash
bun install
bun run dev                        # SPA only, /api mocked by defaults
bun run build && bunx wrangler pages dev dist \
  --kv LARA_CINEMATOGRAPHY_KV \
  --binding ADMIN_PASSWORD=changeme
```

## Deploy to Cloudflare Pages

1. `bunx wrangler kv:namespace create LARA_CINEMATOGRAPHY_KV` and copy the
   returned `id` into `wrangler.toml`.
2. Connect the GitHub repo in the Cloudflare Pages dashboard.
   - Framework preset: None (or Vite)
   - Build command: `npm run build`
   - Build output directory: `dist`
3. Pages project → Settings → Functions → KV namespace bindings:
   bind variable `LARA_CINEMATOGRAPHY_KV` to the namespace from step 1
   (Production and Preview).
4. Pages project → Settings → Environment variables: add `ADMIN_PASSWORD`
   for Production and Preview, then redeploy.

## Admin

Visit `/admin` on the deployed site, sign in with `ADMIN_PASSWORD`. The
dashboard manages hero/about/why-choose/footer copy, services, portfolio
films, gallery images (bulk upload + drag reorder), testimonials, contact
and social links, and enquiries.

## KV keys

| Key            | Shape                                        |
| -------------- | -------------------------------------------- |
| site-content   | { hero, about, why_choose, footer }          |
| settings       | { contact, social, instagram_feed }          |
| services       | Service[]                                    |
| portfolio      | PortfolioItem[]                              |
| gallery        | GalleryItem[] (image_url is Base64)          |
| testimonials   | Testimonial[]                                |
| enquiries      | Enquiry[] (cap 1000, most recent first)      |

If a key is empty, `functions/_lib/defaults.ts` supplies fallback content so
a fresh deploy is fully populated.

## API

All handlers live under `functions/`. See `functions/api/*` for the full list.
Notable endpoints: `GET/POST /api/content`, `/api/portfolio`, `/api/gallery`,
`/api/settings`, `/api/services`, `/api/testimonials`; `POST /api/enquiry`
(public); `POST /api/login`, `POST /api/logout`, `GET /api/session`.

## Notes on images

Uploaded via `browser-image-compression` (~1.4 MB / 1800px cap) then stored
as `data:image/jpeg;base64,...` inside the relevant KV value. Persistent
across redeploys. Each KV value must stay under 25 MB — the gallery holds
all items in one value, so if you plan a large photo archive, move that
collection to R2.

## Maintenance

- Rotate password: update `ADMIN_PASSWORD` in Pages env vars — all existing
  sessions invalidate automatically.
- Reset a section: delete its KV key in the dashboard; defaults return.
