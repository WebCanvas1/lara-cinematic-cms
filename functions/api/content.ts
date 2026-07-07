import { json, error, readJson, requireAdmin, type Ctx, type Env } from "../_lib/env";
import { readCollection, writeCollection } from "../_lib/kv";

type ContentMap = Record<string, unknown>;

export const onRequestGet: PagesFunction<Env, string, { isAdmin?: boolean }> = async (ctx) => {
  const content = await readCollection<ContentMap>(ctx.env, "site-content");
  const settings = await readCollection<ContentMap>(ctx.env, "settings");
  const services = await readCollection<{ active?: boolean; sort_order?: number }[]>(ctx.env, "services");
  const portfolio = await readCollection<Record<string, unknown>[]>(ctx.env, "portfolio");
  const gallery = await readCollection<Record<string, unknown>[]>(ctx.env, "gallery");
  const testimonials = await readCollection<{ sort_order?: number }[]>(ctx.env, "testimonials");

  return json({
    hero: content.hero ?? {},
    about: content.about ?? {},
    why_choose: content.why_choose ?? { items: [] },
    footer: content.footer ?? { tagline: "", copyright: "" },
    contact: settings.contact ?? {},
    social: settings.social ?? {},
    instagram_feed: settings.instagram_feed ?? { images: [] },
    services: services.filter((s) => s.active !== false).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    featured_portfolio: portfolio.filter((p) => p.featured).sort((a, b) => ((a.sort_order as number) ?? 0) - ((b.sort_order as number) ?? 0)).slice(0, 9),
    featured_gallery: gallery.filter((g) => g.featured).sort((a, b) => ((a.sort_order as number) ?? 0) - ((b.sort_order as number) ?? 0)).slice(0, 12),
    testimonials: [...testimonials].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
  });
};

export const onRequestPost = async (ctx: Ctx) => {
  const guard = requireAdmin(ctx); if (guard) return guard;
  const body = await readJson<{ key?: string; value?: unknown }>(ctx.request);
  if (!body?.key) return error(400, "Missing key");
  const map = await readCollection<ContentMap>(ctx.env, "site-content");
  map[body.key] = body.value;
  await writeCollection(ctx.env, "site-content", map);
  return json({ ok: true });
};