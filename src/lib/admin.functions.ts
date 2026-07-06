import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// All server-only imports (session config, admin client) are loaded inside .handler()
// bodies so this file remains safe to import from client-reachable modules.

export const checkAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { useSession } = await import("@tanstack/react-start/server");
  const { adminSessionConfig } = await import("./session.server");
  const session = await useSession<{ unlocked?: boolean }>(adminSessionConfig);
  return { unlocked: Boolean(session.data.unlocked) };
});

export const unlockAdmin = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ password: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("Admin password not configured");
    const { useSession } = await import("@tanstack/react-start/server");
    const { adminSessionConfig, passwordMatches } = await import("./session.server");
    if (!passwordMatches(data.password, expected)) {
      await new Promise((r) => setTimeout(r, 400));
      return { ok: false as const };
    }
    const session = await useSession<{ unlocked?: boolean; loggedInAt?: number }>(adminSessionConfig);
    await session.update({ unlocked: true, loggedInAt: Date.now() });
    return { ok: true as const };
  });

export const lockAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { useSession } = await import("@tanstack/react-start/server");
  const { adminSessionConfig } = await import("./session.server");
  const session = await useSession<{ unlocked?: boolean }>(adminSessionConfig);
  await session.clear();
  return { ok: true as const };
});