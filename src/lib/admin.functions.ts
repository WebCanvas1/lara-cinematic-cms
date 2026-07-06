import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

// Verifies the admin cookie and returns an admin-scoped Supabase client (service role).
async function requireAdminAndClient() {
  const { adminSessionConfig, type AdminSession } = await import("./session.server").then((m) => ({
    adminSessionConfig: m.adminSessionConfig,
    type: null as unknown as typeof m.AdminSession,
  })) as unknown as { adminSessionConfig: import("./session.server").ReturnType<any> } as any;
  // ^ TS trick above is awkward; use a simpler dynamic import:
  const sessionModule = await import("./session.server");
  const session = await useSession<import("./session.server").AdminSession>(sessionModule.adminSessionConfig);
  if (!session.data.unlocked) throw new Error("Unauthorized");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return { supabase: supabaseAdmin, session };
}

export const checkAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { useSession } = await import("@tanstack/react-start/server");
  const { adminSessionConfig } = await import("./session.server");
  const session = await useSession<import("./session.server").AdminSession>(adminSessionConfig);
  return { unlocked: Boolean(session.data.unlocked) };
});

export const unlockAdmin = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ password: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("Admin password not configured");
    const { passwordMatches, adminSessionConfig } = await import("./session.server");
    if (!passwordMatches(data.password, expected)) {
      // small delay to slow brute force
      await new Promise((r) => setTimeout(r, 400));
      return { ok: false as const };
    }
    const { useSession } = await import("@tanstack/react-start/server");
    const session = await useSession<import("./session.server").AdminSession>(adminSessionConfig);
    await session.update({ unlocked: true, loggedInAt: Date.now() });
    return { ok: true as const };
  });

export const lockAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { useSession } = await import("@tanstack/react-start/server");
  const { adminSessionConfig } = await import("./session.server");
  const session = await useSession<import("./session.server").AdminSession>(adminSessionConfig);
  await session.clear();
  return { ok: true as const };
});

// Re-export for other server-fn modules
export { requireAdminAndClient };