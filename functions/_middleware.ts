import { verifySession } from "./_lib/session";
import type { Env } from "./_lib/env";

export const onRequest: PagesFunction<Env, string, { isAdmin?: boolean }> = async (ctx) => {
  ctx.data.isAdmin = false;
  if (ctx.env.ADMIN_PASSWORD) {
    try {
      ctx.data.isAdmin = await verifySession(ctx.request, ctx.env.ADMIN_PASSWORD);
    } catch {
      ctx.data.isAdmin = false;
    }
  }
  return ctx.next();
};