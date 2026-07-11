import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { siteBundleQuery } from "@/lib/queries";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PackagesSection } from "@/components/site/sections/PackagesSection";

export default function PackagesCategory({ kind }: { kind: "Wedding" | "Events" }) {
  useEffect(() => {
    document.title = `${kind === "Wedding" ? "Wedding Packages" : "Event Packages"} — Lara Cinematography`;
  }, [kind]);
  const { data } = useSuspenseQuery(siteBundleQuery);
  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream py-24 md:py-32">
        <div className="container-editorial text-center">
          <div className="eyebrow mb-4">{kind === "Wedding" ? "Wedding Packages" : "Event Packages"}</div>
          <h1 className="mx-auto max-w-3xl font-serif text-5xl leading-tight md:text-6xl">
            {kind === "Wedding"
              ? "Curated collections for your wedding day."
              : "Bespoke coverage for private and cultural events."}
          </h1>
        </div>
      </section>
      <PackagesSection
        packages={data.packages}
        categoryFilter={kind}
        heading={{ eyebrow: "Investment", title: kind === "Wedding" ? "Wedding Collections" : "Event Collections", subtitle: "Every collection is fully bespoke — reach out to tailor a package to your day." }}
      />
    </SiteLayout>
  );
}