import { json, type Env } from "../_lib/env";
import { clearSessionCookie } from "../_lib/session";

export const onRequestPost: PagesFunction<Env> = () =>
  json({ ok: true }, { headers: { "Set-Cookie": clearSessionCookie() } });