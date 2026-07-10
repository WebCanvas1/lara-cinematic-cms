import { json, error, readJson, requireAdmin, type Ctx, type Env } from "../_lib/env";
import { readCollection, writeCollection } from "../_lib/kv";
import type { HomepageSection } from "../../src/lib/site-types";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const items = await readCollection<HomepageSection[]>(ctx.env, "homepage-layout");
  return json([...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
};

export const onRequestPost = async (ctx: Ctx) => {
  const guard = requireAdmin(ctx); if (guard) return guard;
  const body = await readJson<{ items?: HomepageSection[] }>(ctx.request);
  if (!Array.isArray(body?.items)) return error(400, "Missing items");
  await writeCollection(ctx.env, "homepage-layout", body.items);
  return json({ ok: true });
};