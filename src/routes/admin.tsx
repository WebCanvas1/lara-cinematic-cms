import { createFileRoute, redirect } from "@tanstack/react-router";
import { checkAdminStatus } from "@/lib/admin.functions";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { unlocked } = await checkAdminStatus();
    if (!unlocked) throw redirect({ to: "/admin/unlock" });
  },
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Admin — Lara" }, { name: "robots", content: "noindex, nofollow" }] }),
});