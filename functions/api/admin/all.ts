import { json, requireAdmin, type Ctx, type Env } from "../../_lib/env";
import { readCollection } from "../../_lib/kv";
import type { Enquiry } from "../../../src/lib/site-types";

type Map = Record<string, unknown>;

export const onRequestGet: PagesFunction<Env, string, { isAdmin?: boolean }> = async (ctx) => {
  const guard = requireAdmin(ctx as unknown as Ctx); if (guard) return guard;
  const [content, settings, services, portfolio, gallery, testimonials, enquiries, packages, addons] = await Promise.all([
    readCollection<Map>(ctx.env, "site-content"),
    readCollection<Map>(ctx.env, "settings"),
    readCollection<{ sort_order?: number }[]>(ctx.env, "services"),
    readCollection<{ sort_order?: number }[]>(ctx.env, "portfolio"),
    readCollection<{ sort_order?: number }[]>(ctx.env, "gallery"),
    readCollection<{ sort_order?: number }[]>(ctx.env, "testimonials"),
    readCollection<Enquiry[]>(ctx.env, "enquiries"),
    readCollection<{ sort_order?: number }[]>(ctx.env, "packages"),
    readCollection<{ sort_order?: number }[]>(ctx.env, "addons"),
  ]);
  const asRows = (m: Map) => Object.entries(m).map(([key, value]) => ({ key, value }));
  const bySort = <T extends { sort_order?: number }>(r: T[]) => [...r].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  return json({
    content: asRows(content),
    settings: asRows(settings),
    services: bySort(services),
    portfolio: bySort(portfolio),
    gallery: bySort(gallery),
    testimonials: bySort(testimonials),
    enquiries: [...enquiries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 200),
    packages: bySort(packages),
    addons: bySort(addons),
  });
};