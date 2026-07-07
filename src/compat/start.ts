// Shim: replaces `useServerFn(fn)` — returns the function unchanged so
// existing `useServerFn(x)` call sites keep working. Our `x` is now a
// plain async client that speaks to Cloudflare Pages Functions.
export function useServerFn<T extends (...args: never[]) => unknown>(fn: T): T {
  return fn;
}