import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { checkAdminStatus } from "@/lib/admin.functions";

// Layout route: /admin. Gates children by checking the encrypted session cookie
// server-side. /admin/unlock skips this via its own beforeLoad.
export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/unlock") return;
    const { unlocked } = await checkAdminStatus();
    if (!unlocked) throw redirect({ to: "/admin/unlock" });
  },
  component: () => <Outlet />,
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
});