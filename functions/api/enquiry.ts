import { json, error, readJson, requireAdmin, type Ctx, type Env } from "../_lib/env";
import { readCollection, writeCollection, randomId } from "../_lib/kv";
import type { Enquiry } from "../../src/lib/site-types";

export const onRequestGet = async (ctx: Ctx) => {
  const guard = requireAdmin(ctx); if (guard) return guard;
  const items = await readCollection<Enquiry[]>(ctx.env, "enquiries");
  return json([...items].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 200));
};

export const onRequestPost: PagesFunction<Env, string, { isAdmin?: boolean }> = async (ctx) => {
  const body = await readJson<Record<string, unknown>>(ctx.request);

  if (body?.action === "delete") {
    const guard = requireAdmin(ctx as unknown as Ctx); if (guard) return guard;
    const id = body.id;
    if (typeof id !== "string") return error(400, "Missing id");
    const items = await readCollection<Enquiry[]>(ctx.env, "enquiries");
    await writeCollection(ctx.env, "enquiries", items.filter((i) => i.id !== id));
    return json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  if (!name || !email || !message) return error(400, "Missing required fields");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return error(400, "Invalid email");
  if (name.length > 200 || email.length > 255 || message.length > 4000) return error(400, "Field too long");

  const enquiry: Enquiry = {
    id: randomId(),
    name, email, message,
    phone: (body.phone as string) || null,
    event_date: (body.event_date as string) || null,
    venue: (body.venue as string) || null,
    service: (body.service as string) || null,
    budget: (body.budget as string) || null,
    created_at: new Date().toISOString(),
  };
  const items = await readCollection<Enquiry[]>(ctx.env, "enquiries");
  await writeCollection(ctx.env, "enquiries", [enquiry, ...items].slice(0, 1000));
  return json({ ok: true });
};