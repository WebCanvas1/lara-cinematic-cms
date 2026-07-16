import {
  json,
  requireAdmin,
  type Ctx,
  type Env,
} from "../../_lib/env";
import { readCollection } from "../../_lib/kv";
import type {
  Enquiry,
  HomepageSection,
  PortfolioSubcategory,
  PackageSubcategory,
  TeamMember,
} from "../../../src/lib/site-types";

type Map = Record<string, unknown>;

export const onRequestGet: PagesFunction<
  Env,
  string,
  { isAdmin?: boolean }
> = async (ctx) => {
  const guard = requireAdmin(ctx as unknown as Ctx);

  if (guard) {
    return guard;
  }

  const [
    content,
    settings,
    services,
    portfolio,
    portfolioCategories,
    gallery,
    testimonials,
    enquiries,
    packages,
    packageCategories,
    addons,
    layout,
    team,
  ] = await Promise.all([
    readCollection<Map>(ctx.env, "site-content"),
    readCollection<Map>(ctx.env, "settings"),

    readCollection<{ sort_order?: number }[]>(
      ctx.env,
      "services",
    ),

    readCollection<{ sort_order?: number }[]>(
      ctx.env,
      "portfolio",
    ),

    readCollection<PortfolioSubcategory[]>(
      ctx.env,
      "portfolio-categories",
    ),

    readCollection<{ sort_order?: number }[]>(
      ctx.env,
      "gallery",
    ),

    readCollection<{ sort_order?: number }[]>(
      ctx.env,
      "testimonials",
    ),

    readCollection<Enquiry[]>(
      ctx.env,
      "enquiries",
    ),

    readCollection<{ sort_order?: number }[]>(
      ctx.env,
      "packages",
    ),

    readCollection<PackageSubcategory[]>(
      ctx.env,
      "package-categories",
    ),

    readCollection<{ sort_order?: number }[]>(
      ctx.env,
      "addons",
    ),

    readCollection<HomepageSection[]>(
      ctx.env,
      "homepage-layout",
    ),

    readCollection<TeamMember[]>(
      ctx.env,
      "team",
    ),
  ]);

  const asRows = (map: Map) =>
    Object.entries(map).map(([key, value]) => ({
      key,
      value,
    }));

  const bySort = <T extends { sort_order?: number }>(
    rows: T[],
  ): T[] =>
    [...rows].sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0),
    );

  return json({
    content: asRows(content),
    settings: asRows(settings),

    services: bySort(services),

    portfolio: bySort(portfolio),

    portfolio_categories: bySort(
      portfolioCategories,
    ),

    gallery: bySort(gallery),

    testimonials: bySort(testimonials),

    enquiries: [...enquiries]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime(),
      )
      .slice(0, 200),

    packages: bySort(packages),

    package_categories: bySort(
      packageCategories,
    ),

    addons: bySort(addons),

    layout: bySort(
      layout as HomepageSection[] as unknown as {
        sort_order?: number;
      }[],
    ) as unknown as HomepageSection[],

    team: bySort(
      team as unknown as {
        sort_order?: number;
      }[],
    ) as unknown as TeamMember[],
  });
};
