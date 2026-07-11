import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Menu, X, ChevronDown } from "lucide-react";
import laraLogo from "@/assets/lara-logo.png";
import { siteBundleQuery } from "@/lib/queries";
import { DEFAULT_NAV, type NavItem } from "@/lib/site-types";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const { data } = useSuspenseQuery(siteBundleQuery);
  const nav = (data.nav ?? DEFAULT_NAV).items.filter((i) => i.enabled !== false);
  const contactItem = nav.find((n) => n.id === "contact");
  const primary = nav.filter((n) => n.id !== "contact");

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-editorial flex items-center justify-between py-4">
        <Link
          to="/"
          className="group flex items-center"
          onClick={() => setOpen(false)}
          aria-label="Lara Cinematography — Home"
        >
          <img
            src={laraLogo}
            alt="Lara Cinematography"
            className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 md:h-20"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {primary.map((item) => (
            <DesktopItem key={item.id} item={item} />
          ))}
          {contactItem && (
            <Link
              to={contactItem.href || "/contact"}
              className="rounded-full border border-ink px-6 py-2 text-[0.72rem] uppercase tracking-[0.24em] text-ink transition-all hover:bg-ink hover:text-cream"
            >
              {contactItem.label}
            </Link>
          )}
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-editorial flex flex-col py-6">
            {nav.map((item) => {
              const children = (item.children || []).filter((c) => c.enabled !== false);
              if (children.length === 0) {
                return (
                  <Link
                    key={item.id}
                    to={item.href || "/"}
                    onClick={() => setOpen(false)}
                    className="py-3 text-sm uppercase tracking-[0.22em] text-foreground/80 transition-colors hover:text-ink"
                    activeProps={{ className: "text-ink" }}
                  >
                    {item.label}
                  </Link>
                );
              }
              const isOpen = mobileOpen === item.id;
              return (
                <div key={item.id} className="border-b border-border/40 last:border-0">
                  <button
                    onClick={() => setMobileOpen(isOpen ? null : item.id)}
                    className="flex w-full items-center justify-between py-3 text-sm uppercase tracking-[0.22em] text-foreground/80"
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="ml-4 flex flex-col pb-3">
                      {children.map((c) => (
                        <Link
                          key={c.href}
                          to={c.href}
                          onClick={() => { setOpen(false); setMobileOpen(null); }}
                          className="py-2 text-xs uppercase tracking-[0.22em] text-foreground/70 hover:text-ink"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

function DesktopItem({ item }: { item: NavItem }) {
  const children = (item.children || []).filter((c) => c.enabled !== false);
  if (children.length === 0) {
    return (
      <Link
        to={item.href || "/"}
        className="text-[0.78rem] uppercase tracking-[0.22em] text-foreground/70 transition-colors hover:text-ink"
        activeProps={{ className: "text-ink" }}
        activeOptions={{ exact: (item.href || "/") === "/" }}
      >
        {item.label}
      </Link>
    );
  }
  return (
    <div className="group relative">
      <button className="inline-flex items-center gap-1 text-[0.78rem] uppercase tracking-[0.22em] text-foreground/70 transition-colors hover:text-ink">
        {item.label}
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
      </button>
      <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 rounded-2xl border border-border bg-background/95 p-2 opacity-0 shadow-xl backdrop-blur-md transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
        {children.map((c) => (
          <Link
            key={c.href}
            to={c.href}
            className="block rounded-xl px-4 py-2.5 text-[0.72rem] uppercase tracking-[0.22em] text-foreground/70 transition-colors hover:bg-cream hover:text-ink"
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
