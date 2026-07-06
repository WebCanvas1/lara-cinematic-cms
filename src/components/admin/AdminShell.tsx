import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  LayoutDashboard, Image as ImageIcon, Video, Star, Sparkles, Users,
  MessageSquare, Contact, Info, Home, LogOut, ExternalLink,
} from "lucide-react";
import { lockAdmin } from "@/lib/admin.functions";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/hero", label: "Hero", icon: Home },
  { to: "/admin/about", label: "About", icon: Info },
  { to: "/admin/services", label: "Services", icon: Sparkles },
  { to: "/admin/portfolio", label: "Portfolio", icon: Video },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/testimonials", label: "Testimonials", icon: Star },
  { to: "/admin/why-choose", label: "Why Choose", icon: Sparkles },
  { to: "/admin/contact", label: "Contact & Social", icon: Contact },
  { to: "/admin/footer", label: "Footer", icon: Users },
  { to: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
] as const;

export function AdminShell() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const lock = useServerFn(lockAdmin);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function handleLogout() {
    await lock();
    qc.clear();
    toast.success("Signed out");
    navigate({ to: "/admin/unlock" });
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background md:flex">
        <div className="border-b border-border p-6">
          <div className="font-serif text-xl text-ink">Lara</div>
          <div className="text-[0.65rem] uppercase tracking-[0.28em] text-gold">Admin</div>
        </div>
        <nav className="flex-1 p-3">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-mist text-ink" : "text-foreground/70 hover:bg-mist/60 hover:text-ink"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-foreground/70 hover:bg-mist hover:text-ink">
            <ExternalLink className="h-4 w-4" /> View site
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-foreground/70 hover:bg-mist hover:text-ink"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-border bg-background p-4 md:hidden">
        <div className="font-serif text-lg">Lara Admin</div>
        <div className="flex gap-2">
          <a href="/" target="_blank" rel="noreferrer" className="text-xs uppercase tracking-widest text-foreground/60">View</a>
          <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-foreground/60">Sign out</button>
        </div>
      </div>

      <main className="flex-1 overflow-x-hidden pt-16 md:pt-0">
        <div className="mx-auto max-w-5xl p-6 md:p-10">
          <Outlet />
        </div>
        {/* Mobile nav pills */}
        <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur md:hidden">
          <div className="flex gap-2 overflow-x-auto p-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="whitespace-nowrap rounded-full border border-border px-3 py-1 text-xs text-foreground/70" activeProps={{ className: "border-ink text-ink" }}>
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}