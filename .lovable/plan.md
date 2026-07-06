
# Lara Cinematography — Build Plan

Bespoke luxury editorial site + admin CMS. Built on Lovable's stack (TanStack Start on Cloudflare Workers + Lovable Cloud/Postgres + managed storage). Shared-password admin gate as you chose.

## Design system

- Palette: `#FFFFFF` bg, `#FAFAF8` warm-white, `#F5F5F5` accent, `#111111` headings, `#222222` body, `#C6A56B` champagne gold accent. All tokenized in `src/styles.css` (oklch).
- Type: Playfair Display (headings) + Inter (body), via `@fontsource-variable/*` packages.
- Motion: subtle fade-in + scroll reveal (Motion for React), image hover zoom, smooth scroll. No flashy effects.
- Editorial spacing: generous whitespace, large serif display, thin gold hairlines and small-caps labels.

## Public routes

- `/` — Hero (full-viewport, video or image bg, headline, two CTAs), Featured Films grid, Gallery preview (masonry), About preview, Services grid, Why Choose (icon cards), Testimonial slider, Instagram feed, Contact CTA, Footer.
- `/portfolio` — Category filter chips (Weddings, Engagements, Events, Commercial, Reels), video grid, YouTube/Vimeo lightbox.
- `/gallery` — Masonry, category filter, lightbox, lazy-load.
- `/about` — Story, portrait, experience, philosophy, behind-the-scenes.
- `/contact` — Full enquiry form (name, email, phone, date, venue, service, budget, message) with zod validation, WhatsApp CTA, contact cards, map placeholder, socials. Submissions saved to `enquiries` table.
- SEO: per-route `head()` with title/description/OG/Twitter, JSON-LD LocalBusiness on home, VideoObject on portfolio items, `sitemap.xml` route, `robots.txt`.

## Admin (`/admin`) — shared password gate

- Server-only `ADMIN_PASSWORD` + `SESSION_SECRET` env vars (I'll generate `SESSION_SECRET`; you enter `ADMIN_PASSWORD`).
- `useSession` encrypted cookie, timing-safe compare inside a `createServerFn` (per Lovable's shared-password gate pattern).
- `/admin/unlock` login form, `/admin/*` gated via server-fn checks + client redirect.
- Sidebar layout, white UI. Sections: Dashboard, Hero, About, Services, Portfolio, Gallery, Testimonials, Why-Choose, Contact & Social, Footer, Enquiries.
- CRUD + drag-and-drop reorder (dnd-kit) for portfolio/gallery/services/testimonials/why-choose.
- Image uploads → Lovable Cloud Storage bucket `media` (public read). Client-side compression before upload, progress, previews. (Note: managed storage instead of base64-in-KV — same UX, far better performance and no size limits.)
- Toast confirmations, unsaved-changes warning, delete confirmation, graceful errors.

## Data (Lovable Cloud / Postgres)

Tables, all with `TO anon` SELECT policies for public content; writes gated by admin server fns using service-role after password check:

- `site_content` (single row, JSON blobs per section: hero, about, why_choose, footer)
- `settings` (contact info, social links, business hours)
- `services` (id, icon, title, description, order, active)
- `portfolio` (id, title, category, description, youtube_url, vimeo_url, thumbnail_url, cover_url, featured, order)
- `gallery` (id, image_url, alt, category, featured, order)
- `testimonials` (id, name, role, quote, avatar_url, order)
- `enquiries` (id, name, email, phone, event_date, venue, service, budget, message, created_at) — insert allowed for anon; admin-only read.

Defaults seeded via migration if tables empty (based on the reference site's services/content areas — you'll edit real copy in `/admin`).

## Technical notes

- All writes go through `createServerFn` handlers that verify the encrypted session cookie set by the password gate before using service-role client.
- Image compression via `browser-image-compression`.
- Video embeds: lite YouTube/Vimeo facades for perf.
- `<Suspense>` + `useSuspenseQuery` loader pattern for SEO-critical routes.

## Deliverables in this build

Full public site + full admin + seeded defaults + SEO + sitemap/robots. README with admin password setup + content management guide.

## What I need from you after approval

1. Approve so I can enable Lovable Cloud.
2. Enter `ADMIN_PASSWORD` when I open the secure form (I'll generate `SESSION_SECRET` automatically).
3. Optionally upload a hero background video/image later — I'll ship with a generated cinematic hero image and you can swap it in `/admin`.

Approve to proceed?
