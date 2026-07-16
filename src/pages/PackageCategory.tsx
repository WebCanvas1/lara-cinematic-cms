import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { siteBundleQuery } from "@/lib/queries";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PackagesSection } from "@/components/site/sections/PackagesSection";

export default function PackageCategory() {
  const { categorySlug } = useParams<{
    categorySlug: string;
  }>();

  const { data } = useSuspenseQuery(siteBundleQuery);

  const selectedCategory = (data.package_categories ?? []).find(
    (category) =>
      category.slug === categorySlug &&
      category.active !== false,
  );

  const packages = selectedCategory
    ? data.packages
        .filter(
          (item) =>
            item.active !== false &&
            item.category_id === selectedCategory.id,
        )
        .sort(
          (a, b) =>
            (a.sort_order ?? 0) - (b.sort_order ?? 0),
        )
    : [];

  useEffect(() => {
    document.title = selectedCategory
      ? `${selectedCategory.name} — Lara Cinematography`
      : "Packages — Lara Cinematography";
  }, [selectedCategory]);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream py-24 md:py-32">
        <div className="container-editorial text-center">
          <div className="eyebrow mb-4">
            Packages
          </div>

          <h1 className="mx-auto max-w-3xl font-serif text-5xl leading-tight md:text-6xl">
            {selectedCategory?.name ??
              "Package category not found"}
          </h1>

          {selectedCategory?.description && (
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-foreground/70 md:text-base">
              {selectedCategory.description}
            </p>
          )}
        </div>
      </section>

      {!selectedCategory ? (
        <section className="bg-background py-20">
          <div className="container-editorial text-center">
            <h2 className="font-serif text-3xl text-ink">
              Category not found
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              This package category may have been removed or hidden.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex rounded-full border border-ink px-6 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              Return home
            </Link>
          </div>
        </section>
      ) : packages.length === 0 ? (
        <section className="bg-background py-20">
          <div className="container-editorial text-center">
            <h2 className="font-serif text-3xl text-ink">
              No packages yet
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              Packages assigned to this category will appear here.
            </p>
          </div>
        </section>
      ) : (
        <PackagesSection
  packages={packages}
  heading={{
    showHeading: false,
    showSubtitle: false,
  }}
/>
      )}
    </SiteLayout>
  );
}
