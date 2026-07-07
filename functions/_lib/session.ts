// Signed session cookie using HMAC-SHA-256 over a timestamp,
// keyed by ADMIN_PASSWORD. No external secret store needed.

const COOKIE = "lara_admin";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function b64url(bytes: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function hmac(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return b64url(sig);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function makeSessionCookie(password: string): Promise<string> {
  const ts = Date.now().toString();
  const sig = await hmac(password, ts);
  const value = `${ts}.${sig}`;
  return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function getCookieHeader(request: Request, name: string): string | null {
  const raw = request.headers.get("Cookie") ?? "";
  for (const part of raw.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}

export async function verifySession(request: Request, password: string): Promise<boolean> {
  const raw = getCookieHeader(request, COOKIE);
  if (!raw) return false;
  const [ts, sig] = raw.split(".");
  if (!ts || !sig) return false;
  const age = Date.now() - Number(ts);
  if (!Number.isFinite(age) || age < 0 || age > MAX_AGE * 1000) return false;
  const expected = await hmac(password, ts);
  return timingSafeEqual(sig, expected);
}

export function passwordEquals(input: string, expected: string): boolean {
  return timingSafeEqual(input, expected);
}