export interface Env {
  LARA_CINEMATOGRAPHY_KV: KVNamespace;
  ADMIN_PASSWORD?: string;
}

export type Ctx = EventContext<Env, string, { isAdmin?: boolean }>;

export function json(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...(init.headers || {}),
    },
  });
}

export function error(status: number, message: string): Response {
  return json({ error: message }, { status });
}

export function requireAdmin(ctx: Ctx): Response | null {
  if (!ctx.data.isAdmin) return error(401, "Unauthorized");
  return null;
}

export async function readJson<T = unknown>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }
}