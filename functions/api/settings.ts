import { json, error, readJson, requireAdmin, type Ctx, type Env } from "../_lib/env";
import { readCollection, writeCollection } from "../_lib/kv";

type Map = Record<string, unknown>;

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  return json(await readCollection<Map>(ctx.env, "settings"));
};

export const onRequestPost = async (ctx: Ctx) => {
  const guard = requireAdmin(ctx); if (guard) return guard;
  const body = await readJson<{ key?: string; value?: unknown }>(ctx.request);
  if (!body?.key) return error(400, "Missing key");
  const map = await readCollection<Map>(ctx.env, "settings");
  map[body.key] = body.value;
  await writeCollection(ctx.env, "settings", map);
  return json({ ok: true });
};