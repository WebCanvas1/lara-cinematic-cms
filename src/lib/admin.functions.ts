import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";
import { adminSessionConfig, passwordMatches, type AdminSession } from "./session.server";

export async function requireAdminAndClient() {
  const session = await useSession<AdminSession>(adminSessionConfig);
  if (!session.data.unlocked) throw new Error("Unauthorized");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return { supabase: supabaseAdmin, session };
}

export const checkAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(adminSessionConfig);
  return { unlocked: Boolean(session.data.unlocked) };
});

export const unlockAdmin = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ password: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("Admin password not configured");
    if (!passwordMatches(data.password, expected)) {
      await new Promise((r) => setTimeout(r, 400));
      return { ok: false as const };
    }
    const session = await useSession<AdminSession>(adminSessionConfig);
    await session.update({ unlocked: true, loggedInAt: Date.now() });
    return { ok: true as const };
  });

export const lockAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(adminSessionConfig);
  await session.clear();
  return { ok: true as const };
});