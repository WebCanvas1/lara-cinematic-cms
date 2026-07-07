# Convert to Cloudflare Pages + Functions + KV

You've confirmed:
1. The Lovable preview/editor will stop working after this — the project becomes GitHub → Cloudflare Pages only.
2. Base64 images in KV are acceptable (with the size/perf caveats).
3. HashRouter is preferred.

## What gets removed

- `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/router-plugin`, `@lovable.dev/vite-tanstack-config`, `nitro`, `h3`
- `@supabase/*`, `supabase/` folder, `src/integrations/supabase/`
- `src/routes/`, `src/routeTree.gen.ts`, `src/router.tsx`, `src/server.ts`, `src/start.ts`
- All `*.functions.ts` server-fn modules and `session.server.ts`
- Lovable-specific: `src/lib/lovable-error-reporting.ts`, `src/lib/error-capture.ts`, `src/lib/error-page.ts`

## What gets added

### Vite config
Standard `@vitejs/plugin-react` + Tailwind v4 plugin. Output → `dist/`.

### Routing (`react-router-dom` HashRouter)
```
src/main.tsx        - ReactDOM.createRoot + HashRouter
src/App.tsx         - <Routes> for /, /portfolio, /gallery, /about, /contact, /admin, /admin/unlock, *
```
Each existing route component moves from `src/routes/*.tsx` to `src/pages/*.tsx`, stripped of `createFileRoute`/`head()` — page titles set via a tiny `useDocumentTitle` hook. Static SEO meta goes into `index.html`.

### Cloudflare Pages Functions (`/functions/api/`)
```
functions/
  _middleware.ts           - reads cookie, sets ctx.data.isAdmin, adds CORS
  api/
    content.ts             - GET (public), POST (admin)   → KV key "site-content"
    portfolio.ts           - GET, POST                    → "portfolio"
    gallery.ts             - GET, POST                    → "gallery"
    settings.ts            - GET, POST                    → "settings"
    services.ts            - GET, POST                    → "services" (new; admin currently edits these)
    testimonials.ts        - GET, POST                    → "testimonials"
    login.ts               - POST { password } → sets HttpOnly signed cookie
    logout.ts              - POST → clears cookie
    session.ts             - GET → { unlocked: boolean }
    enquiry.ts             - POST (public), GET (admin), DELETE (admin)
```

Session: HMAC-signed cookie `lara_admin=<timestamp>.<hmacSHA256(timestamp, ADMIN_PASSWORD)>`, 14-day expiry, `HttpOnly; Secure; SameSite=Lax`. Verified via Web Crypto in `_middleware.ts`.

### Default data
`functions/_defaults.ts` — the seed content currently in the SQL migration, re-exported as JSON. If a KV `get` returns null, the function returns defaults (public GET) or seeds KV on first admin write.

### Client data layer
Replace `src/lib/queries.ts` / `admin-queries.ts` / `content.functions.ts` / `admin.functions.ts` with a single `src/lib/api.ts` using `fetch("/api/...")`. Keep TanStack Query — it works fine as a client cache. All existing components keep the same hook signatures (`useSiteBundle`, `useAdminData`, etc.) so section/admin components don't change.

### Image uploads
Client-side compress with `browser-image-compression` (already installed) → base64 data URL → included inline in the JSON payload POSTed to the relevant endpoint. No separate upload endpoint. Same shape as today.

### Cloudflare Pages config
- `wrangler.toml` at repo root with `[[kv_namespaces]] binding = "LARA_CINEMATOGRAPHY_KV"` placeholder
- `public/_redirects`: `/* /index.html 200` (SPA fallback; HashRouter doesn't strictly need it but safer)
- `public/_headers`: basic cache rules for `/assets/*`

### README
Cloudflare Pages setup steps:
1. Create KV namespace `LARA_CINEMATOGRAPHY_KV` (dashboard or `wrangler kv:namespace create`)
2. Bind it in Pages project → Settings → Functions → KV bindings
3. Set env var `ADMIN_PASSWORD` (Production + Preview)
4. Connect GitHub repo, framework = None (or Vite), build = `npm run build`, output = `dist`
5. Deploy

## Rollout note

I'll do this in one large batch since files are tightly coupled — after the rewrite, `bun run build` should produce a working `dist/`. The Lovable preview will show errors during the transition and after (expected — the sandbox runs TanStack Start).

## Section-component compatibility

`SiteHeader`, `SiteFooter`, all `sections/*`, `AdminDashboard`, `ImagePicker` keep their prop shapes. Only the data-fetching hooks change underneath. `<Link to="/x">` from `@tanstack/react-router` becomes `<Link to="/x">` from `react-router-dom` — identical call sites.

Approve and I'll execute the full conversion.
