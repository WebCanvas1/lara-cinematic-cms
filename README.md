# Lara Cinematography

A luxury, editorial cinematography website with a built-in admin CMS.
Built on Lovable (TanStack Start on Cloudflare Workers + Lovable Cloud / Postgres).

## Public site

- `/` – Home (hero, featured films, about, gallery preview, services, why choose, testimonials, Instagram, contact CTA)
- `/portfolio` – Filterable films (Weddings, Engagements, Events, Commercial, Reels)
- `/gallery` – Masonry gallery with lightbox and category filter
- `/about` – Story, mission, approach, experience
- `/contact` – Enquiry form + WhatsApp + contact details
- `/sitemap.xml`, `/robots.txt`

## Admin dashboard – `/admin`

Protected by a shared password stored server-side as `ADMIN_PASSWORD`.
Session is an encrypted cookie signed with `SESSION_SECRET` (auto-generated).

Tabs:
- Overview – counts + recent enquiries
- Hero – headline, subheading, CTAs, background image or video URL
- About – portrait upload, story, mission, approach, experience
- Services – add / edit / delete / drag-to-reorder / show or hide
- Portfolio – add / edit / delete / drag-to-reorder / feature on home / YouTube or Vimeo embed / thumbnail
- Gallery – bulk image upload (auto-compressed), inline alt / category / feature toggle
- Testimonials – add / edit / delete / drag-to-reorder
- Why Choose – editable list of icon cards
- Contact & Social – email, phone, WhatsApp, address, hours, Instagram / Facebook / YouTube / TikTok / Vimeo
- Footer – tagline and copyright
- Enquiries – all submissions with delete

## Changing the admin password

Rotate it from **Project settings → Secrets → ADMIN_PASSWORD**.

## Deployment

Click **Publish** in the Lovable editor. Backend (database + server functions)
deploys automatically on save; the front-end goes live when you click Publish.
A custom domain can be connected from **Project settings → Domains** after the
first publish.

## Data model

Postgres tables managed automatically:
`site_content`, `settings`, `services`, `portfolio`, `gallery`, `testimonials`, `enquiries`.
All public content has public read policies; all writes go through server
functions gated by the admin session cookie.

## Images

Uploads are compressed client-side to ~1.4 MB max JPEG then stored as base64 in
Postgres. Simple, permanent, no external storage config needed.

## Notes for future maintenance

- Any Lucide icon name (e.g. `Heart`, `Camera`, `Plane`) can be used in Services and Why Choose.
- For video hero, set Hero → Background type to `video` and paste an mp4/webm URL.
- Featured portfolio films appear on the homepage; featured gallery images appear in the home gallery preview.