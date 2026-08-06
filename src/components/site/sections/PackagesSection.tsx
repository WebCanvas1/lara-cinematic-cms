import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { Reveal } from "../Reveal";
import type {
  PackageItem,
  PackageSubcategory,
  HeadingConfig,
} from "@/lib/site-types";
import { mergeHeading } from "./section-heading";

function packageDetailHref(
  packageItem: PackageItem,
  categories: PackageSubcategory[],
): string {
  const category = categories.find(
    (item) => item.id === packageItem.category_id,
  );

  if (category) {
    return `/packages/${category.slug}#pkg-${packageItem.id}`;
  }

  // Legacy fallback for packages not yet assigned to a dynamic category.
  const legacySlug =
    packageItem.category === "Events" ? "events" : "wedding-packages";

  return `/packages/${legacySlug}#pkg-${packageItem.id}`;
}

export function PackagesSection({
  packages,
  categories = [],
  heading,
  variant = "full",
  categoryFilter,
}: {
  packages: PackageItem[];
  categories?: PackageSubcategory[];
  heading?: HeadingConfig;
  variant?: "full" | "preview";
  categoryFilter?: "Wedding" | "Events";
}) {
  if (!packages.length) return null;

  const h = mergeHeading(heading, {
    eyebrow: "Investment",
    title: "Curated packages, crafted for every love story.",
    subtitle:
      "Considered collections designed to preserve your day with intention, elegance, and cinematic craft.",
  });

  if (variant === "preview") {
    return (
      <PackagesPreview
        packages={packages}
        categories={categories}
        h={h}
      />
    );
  }

  const list = categoryFilter
    ? packages.filter(
        (p) =>
          (p.category === "Events" ? "Events" : "Wedding") ===
          categoryFilter,
      )
    : packages;

  if (!list.length) return null;

  return (
    <section id="packages" className="bg-cream py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="mb-16">
          <div
            className={`mx-auto max-w-2xl ${h.wrapperCls}`}
            style={h.wrapperStyle}
          >
            {h.showEyebrow && (
              <div className="eyebrow mb-4" style={h.eyebrowStyle}>
                {h.eyebrow}
              </div>
            )}

            {h.showTitle && (
              <h2
                className="font-serif text-4xl md:text-5xl"
                style={h.titleStyle}
              >
                {h.title}
              </h2>
            )}

            {h.showSubtitle && (
              <p
                className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-foreground/70"
                style={h.subtitleStyle}
              >
                {h.subtitle}
              </p>
            )}
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {list.map((p, i) => {
            const isFeatured = p.featured === true;

            return (
              <Reveal key={p.id} delay={(i % 4) * 0.06}>
                <article
                  id={`pkg-${p.id}`}
                  className={`relative flex h-full flex-col overflow-hidden rounded-3xl border shadow-[0_20px_60px_-30px_rgba(31,23,19,0.22)] transition-all duration-500 hover:-translate-y-1 ${
                    isFeatured
                      ? "border-gold bg-ink text-cream shadow-[0_28px_80px_-28px_rgba(31,23,19,0.55)] xl:-translate-y-3 xl:hover:-translate-y-4"
                      : "border-border bg-card text-ink"
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute right-4 top-6 z-10 rounded-full bg-gold px-4 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-ink shadow-md">
                      {p.badge || "Most Popular"}
                    </div>
                  )}

                  {!isFeatured && p.badge && (
                    <div className="absolute right-4 top-6 z-10 rounded-full bg-ink px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.28em] text-cream shadow-md">
                      {p.badge}
                    </div>
                  )}

                  {p.image ? (
                    <div className="aspect-[4/3] w-full overflow-hidden bg-mist">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div
                      className={`aspect-[4/3] w-full ${
                        isFeatured
                          ? "bg-gradient-to-br from-ink via-ink/95 to-gold/20"
                          : "bg-gradient-to-br from-mist via-cream to-background"
                      }`}
                    />
                  )}

                  <div className="flex flex-1 flex-col p-8">
                    {p.subtitle && (
                      <div className="text-[0.65rem] uppercase tracking-[0.28em] text-gold">
                        {p.subtitle}
                      </div>
                    )}

                    <h3
                      className={`mt-3 font-serif text-2xl ${
                        isFeatured ? "text-gold" : "text-ink"
                      }`}
                    >
                      {p.name}
                    </h3>

                    {p.description && (
                      <p
                        className={`mt-3 text-sm leading-relaxed ${
                          isFeatured ? "text-cream/80" : "text-foreground/70"
                        }`}
                      >
                        {p.description}
                      </p>
                    )}

                    {p.long_description && (
                      <p
                        className={`mt-2 text-sm leading-relaxed ${
                          isFeatured ? "text-cream/65" : "text-foreground/60"
                        }`}
                      >
                        {p.long_description}
                      </p>
                    )}

                    {p.show_price !== false && p.price && (
                      <div
                        className={`my-6 flex items-baseline gap-1 border-y py-4 ${
                          isFeatured ? "border-cream/20" : "border-border"
                        }`}
                      >
                        <span
                          className={`font-serif text-4xl ${
                            isFeatured ? "text-gold" : "text-ink"
                          }`}
                        >
                          {p.price}
                        </span>
                      </div>
                    )}

                    {p.features?.length > 0 && (
                      <ul className="mb-8 space-y-2.5">
                        {p.features.map((feature, index) => (
                          <li
                            key={index}
                            className={`flex items-start gap-2.5 text-sm ${
                              isFeatured
                                ? "text-cream/80"
                                : "text-foreground/80"
                            }`}
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {p.addons && p.addons.length > 0 && (
                      <div
                        className={`mb-6 rounded-2xl border p-4 ${
                          isFeatured
                            ? "border-cream/15 bg-cream/5"
                            : "border-border bg-cream/50"
                        }`}
                      >
                        <div className="mb-2 text-[0.6rem] uppercase tracking-[0.28em] text-gold">
                          Add-ons
                        </div>

                        <ul
                          className={`space-y-1 text-sm ${
                            isFeatured
                              ? "text-cream/80"
                              : "text-foreground/80"
                          }`}
                        >
                          {p.addons.map((addon, index) => (
                            <li
                              key={index}
                              className="flex justify-between gap-3"
                            >
                              <span>{addon.title}</span>
                              {addon.price && (
                                <span
                                  className={
                                    isFeatured
                                      ? "text-cream/60"
                                      : "text-foreground/60"
                                  }
                                >
                                  {addon.price}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-auto">
                      <PkgButton
                        href={p.buttonLink || "/contact"}
                        featured={isFeatured}
                      >
                        {p.buttonText || "Enquire Now"}
                      </PkgButton>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PackagesPreview({
  packages,
  categories,
  h,
}: {
  packages: PackageItem[];
  categories: PackageSubcategory[];
  h: ReturnType<typeof mergeHeading>;
}) {
  const activeCategories = [...categories]
    .filter((category) => category.active !== false)
    .sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0),
    );

  const [categoryId, setCategoryId] = useState(
    activeCategories[0]?.id ?? "",
  );

  const selectedCategoryId = activeCategories.some(
    (category) => category.id === categoryId,
  )
    ? categoryId
    : activeCategories[0]?.id ?? "";

  const list = selectedCategoryId
    ? packages.filter(
        (packageItem) =>
          packageItem.active !== false &&
          packageItem.category_id === selectedCategoryId,
      )
    : packages.filter(
        (packageItem) => packageItem.active !== false,
      );

  return (
    <section id="packages" className="bg-cream py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="mb-10">
          <div
            className={`mx-auto max-w-2xl ${h.wrapperCls}`}
            style={h.wrapperStyle}
          >
            {h.showEyebrow && (
              <div
                className="eyebrow mb-4"
                style={h.eyebrowStyle}
              >
                {h.eyebrow}
              </div>
            )}

            {h.showTitle && (
              <h2
                className="font-serif text-4xl md:text-5xl"
                style={h.titleStyle}
              >
                {h.title}
              </h2>
            )}

            {h.showSubtitle && (
              <p
                className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-foreground/70"
                style={h.subtitleStyle}
              >
                {h.subtitle}
              </p>
            )}
          </div>
        </Reveal>

        {activeCategories.length > 0 && (
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {activeCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setCategoryId(category.id)}
                className={`rounded-full border px-7 py-2.5 text-[0.7rem] uppercase tracking-[0.24em] transition-all ${
                  selectedCategoryId === category.id
                    ? "border-ink bg-ink text-cream"
                    : "border-border text-foreground/70 hover:border-ink"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {list.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No packages in this category yet.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {list.slice(0, 6).map((packageItem, index) => {
              const isFeatured = packageItem.featured === true;

              return (
                <Reveal
                  key={packageItem.id}
                  delay={(index % 3) * 0.06}
                >
                  <article
                    className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border shadow-[0_20px_60px_-30px_rgba(31,23,19,0.22)] transition-all duration-500 hover:-translate-y-1 ${
                      isFeatured
                        ? "border-gold bg-ink text-cream shadow-[0_28px_80px_-28px_rgba(31,23,19,0.55)] xl:-translate-y-3 xl:hover:-translate-y-4"
                        : "border-border bg-card text-ink"
                    }`}
                  >
                    {isFeatured && (
                      <div className="absolute right-4 top-6 z-10 rounded-full bg-gold px-4 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-ink shadow-md">
                        {packageItem.badge || "Most Popular"}
                      </div>
                    )}

                    {packageItem.image ? (
                      <div className="aspect-[4/3] w-full overflow-hidden bg-mist">
                        <img
                          src={packageItem.image}
                          alt={packageItem.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div
                        className={`aspect-[4/3] w-full ${
                          isFeatured
                            ? "bg-gradient-to-br from-ink via-ink/95 to-gold/20"
                            : "bg-gradient-to-br from-mist via-cream to-background"
                        }`}
                      />
                    )}

                    <div className="flex flex-1 flex-col p-7">
                      <h3
                        className={`font-serif text-2xl ${
                          isFeatured ? "text-gold" : "text-ink"
                        }`}
                      >
                        {packageItem.name}
                      </h3>

                      {packageItem.description && (
                        <p
                          className={`mt-3 line-clamp-3 text-sm leading-relaxed ${
                            isFeatured
                              ? "text-cream/80"
                              : "text-foreground/70"
                          }`}
                        >
                          {packageItem.description}
                        </p>
                      )}

                      <div className="mt-6">
                        <PkgButton
                          href={packageDetailHref(
                            packageItem,
                            activeCategories,
                          )}
                          featured={isFeatured}
                        >
                          View Package Details
                        </PkgButton>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function PkgButton({
  href,
  featured,
  children,
}: {
  href: string;
  featured: boolean;
  children: React.ReactNode;
}) {
  const base =
    "block w-full rounded-full py-3.5 text-center text-[0.7rem] font-semibold uppercase tracking-[0.28em] transition-colors";

  const cls = featured
    ? `${base} bg-gold text-ink hover:bg-cream`
    : `${base} border border-ink text-ink hover:bg-ink hover:text-cream`;

  const isExternal = /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={cls}>
      {children}
    </Link>
  );
}
