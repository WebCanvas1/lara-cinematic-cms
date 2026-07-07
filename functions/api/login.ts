import { json, error, readJson, type Env } from "../_lib/env";
import { makeSessionCookie, passwordEquals } from "../_lib/session";

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const expected = ctx.env.ADMIN_PASSWORD;
  if (!expected) return error(500, "ADMIN_PASSWORD is not configured on this deployment.");
  const body = await readJson<{ password?: string }>(ctx.request);
  if (!body?.password || !passwordEquals(body.password, expected)) {
    // Constant-ish delay to blunt naive brute force
    await new Promise((r) => setTimeout(r, 400));
    return json({ ok: false });
  }
  const cookie = await makeSessionCookie(expected);
  return json({ ok: true }, { headers: { "Set-Cookie": cookie } });
};

export const onRequest: PagesFunction<Env> = () =>
  new Response("Method not allowed", { status: 405 });