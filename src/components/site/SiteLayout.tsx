import type { ReactNode } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { siteBundleQuery } from "@/lib/queries";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { data } = useSuspenseQuery(siteBundleQuery);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter footer={data.footer} contact={data.contact} social={data.social} />
    </div>
  );
}