import {
  json,
  error,
  readJson,
  requireAdmin,
  type Ctx,
  type Env,
} from "../_lib/env";
import { readCollection, writeCollection } from "../_lib/kv";
import type {
  HomepageSection,
  TeamMember,
  PortfolioSubcategory,
} from "../../src/lib/site-types";
import { DEFAULT_NAV } from "../../src/lib/site-types";

type ContentMap = Record<string, unknown>;

type OrderedItem = Record<string, unknown> & {
  featured?: boolean;
  active?: boolean;
  sort_order?: number;
};

const sortFeaturedFirst = (
  items: OrderedItem[],
  limit: number,
): OrderedItem[] => {
  return [...items]
    .sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    })
    .slice(0, limit);
};

const LEGACY_PORTFOLIO_TO_VIDEO = new Set([
  "Weddings",
  "Engagements",
  "Events",
  "Commercial",
  "Reels",
  "Videography",
  "Video",
  "",
]);

function normalisePortfolio(items: OrderedItem[]): OrderedItem[] {
  return items.map((item) => {
    const currentCategory = String(
      (item.category as string) || "",
    );

    const category =
      currentCategory === "Photography"
        ? "Photography"
        : LEGACY_PORTFOLIO_TO_VIDEO.has(currentCategory)
          ? "Videography"
          : currentCategory;

    return {
      ...item,
      category,
    };
  });
}

function normalisePackages(items: OrderedItem[]): OrderedItem[] {
  return items.map((item) => {
    const currentCategory = String(
      (item.category as string) || "",
    );

    return {
      ...item,
      category:
        currentCategory === "Events" ? "Events" : "Wedding",
    };
  });
}

export const onRequestGet: PagesFunction<
  Env,
  string,
  { isAdmin?: boolean }
> = async (ctx) => {
  const content = await readCollection<ContentMap>(
    ctx.env,
    "site-content",
  );

  const settings = await readCollection<ContentMap>(
    ctx.env,
    "settings",
  );

  const services = await readCollection<OrderedItem[]>(
    ctx.env,
    "services",
  );

  const portfolioRaw = await readCollection<OrderedItem[]>(
    ctx.env,
    "portfolio",
  );

  const portfolio = normalisePortfolio(portfolioRaw);

  const portfolioCategories =
    await readCollection<PortfolioSubcategory[]>(
      ctx.env,
      "portfolio-categories",
    );

  const gallery = await readCollection<OrderedItem[]>(
    ctx.env,
    "gallery",
  );

  const testimonials = await readCollection<OrderedItem[]>(
    ctx.env,
    "testimonials",
  );

  const packagesRaw = await readCollection<OrderedItem[]>(
    ctx.env,
    "packages",
  );

  const packages = normalisePackages(packagesRaw);

  const addons = await readCollection<OrderedItem[]>(
    ctx.env,
    "addons",
  );

  const layout = await readCollection<HomepageSection[]>(
    ctx.env,
    "homepage-layout",
  );

  const team = await readCollection<TeamMember[]>(
    ctx.env,
    "team",
  );

  return json({
    hero: content.hero ?? {},
    about: content.about ?? {},
    about_main: content.about_main ?? {},
    nav: content.navigation ?? DEFAULT_NAV,

    team: [...team]
      .filter((member) => member.active !== false)
      .sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0),
      ),

    why_choose: content.why_choose ?? { items: [] },

    footer: content.footer ?? {
      tagline: "",
      copyright: "",
    },

    contact: settings.contact ?? {},
    social: settings.social ?? {},

    instagram_feed:
      settings.instagram_feed ?? { images: [] },

    services: services
      .filter((service) => service.active !== false)
      .sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0),
      ),

    portfolio_categories: [...portfolioCategories]
      .filter((category) => category.active !== false)
      .sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0),
      ),

    featured_portfolio: sortFeaturedFirst(
      portfolio,
      9,
    ),

    featured_gallery: sortFeaturedFirst(
      gallery,
      12,
    ),

    testimonials: [...testimonials].sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0),
    ),

    packages: packages
      .filter((item) => item.active !== false)
      .sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0),
      ),

    addons: addons
      .filter((item) => item.active !== false)
      .sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0),
      ),

    layout: [...layout].sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0),
    ),
  });
};

export const onRequestPost = async (ctx: Ctx) => {
  const guard = requireAdmin(ctx);

  if (guard) {
    return guard;
  }

  const body = await readJson<{
    key?: string;
    value?: unknown;
  }>(ctx.request);

  if (!body?.key) {
    return error(400, "Missing key");
  }

  const map = await readCollection<ContentMap>(
    ctx.env,
    "site-content",
  );

  map[body.key] = body.value;

  await writeCollection(
    ctx.env,
    "site-content",
    map,
  );

  return json({ ok: true });
};
