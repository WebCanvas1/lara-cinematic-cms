import { json, error, readJson, requireAdmin, type Ctx } from "./env";
import { readCollection, writeCollection, randomId, type KvKey } from "./kv";

type Item = { id: string; sort_order?: number; [k: string]: unknown };

export async function handleCollectionGet(ctx: Ctx, key: KvKey) {
  const items = await readCollection<Item[]>(ctx.env, key);
  return json([...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
}

export async function handleCollectionPost(ctx: Ctx, key: KvKey) {
  const guard = requireAdmin(ctx); if (guard) return guard;
  const body = await readJson<{
    action?: "upsert" | "delete" | "reorder";
    item?: Partial<Item>;
    id?: string;
    ids?: string[];
  }>(ctx.request);
  const items = await readCollection<Item[]>(ctx.env, key);

  if (body.action === "delete") {
    if (!body.id) return error(400, "Missing id");
    await writeCollection(ctx.env, key, items.filter((i) => i.id !== body.id));
    return json({ ok: true });
  }

  if (body.action === "reorder") {
    if (!Array.isArray(body.ids)) return error(400, "Missing ids");
    const byId = new Map(items.map((i) => [i.id, i]));
    const next: Item[] = [];
    body.ids.forEach((id, index) => {
      const found = byId.get(id);
      if (found) { next.push({ ...found, sort_order: index }); byId.delete(id); }
    });
    byId.forEach((leftover) => next.push(leftover));
    await writeCollection(ctx.env, key, next);
    return json({ ok: true });
  }

  const incoming = body.item;
  if (!incoming) return error(400, "Missing item");
  const id = incoming.id ?? randomId();
  const existing = items.find((i) => i.id === id);
  const merged: Item = { ...(existing ?? {}), ...incoming, id };
  const next = existing ? items.map((i) => (i.id === id ? merged : i)) : [...items, merged];
  await writeCollection(ctx.env, key, next);
  return json({ ok: true, item: merged });
}