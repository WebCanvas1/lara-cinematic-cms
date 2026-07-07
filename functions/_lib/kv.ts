import type { Env } from "./env";
import { DEFAULTS } from "./defaults";

export type KvKey = keyof typeof DEFAULTS;

export async function readCollection<T = unknown>(env: Env, key: KvKey): Promise<T> {
  const stored = await env.LARA_CINEMATOGRAPHY_KV.get(key, "json");
  if (stored !== null && stored !== undefined) return stored as T;
  return DEFAULTS[key] as unknown as T;
}

export async function writeCollection(env: Env, key: KvKey, value: unknown): Promise<void> {
  await env.LARA_CINEMATOGRAPHY_KV.put(key, JSON.stringify(value));
}

export function randomId(): string {
  return crypto.randomUUID();
}

export function sortBy<T>(items: T[], field: keyof T): T[] {
  return [...items].sort((a, b) => {
    const av = a[field] as unknown as number;
    const bv = b[field] as unknown as number;
    return (av ?? 0) - (bv ?? 0);
  });
}