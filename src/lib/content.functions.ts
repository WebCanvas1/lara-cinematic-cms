import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SiteBundle } from "./site-types";

async function getPublicClient() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

async function requireAdmin() {
  const { useSession } = await import("@tanstack/react-start/server");
  const { adminSessionConfig } = await import("./session.server");
  const session = await useSession<{ unlocked?: boolean }>(adminSessionConfig);
  if (!session.data.unlocked) throw new Error("Unauthorized");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

// ========================= PUBLIC READS =========================

export const getSiteBundle = createServerFn({ method: "GET" }).handler(async (): Promise<SiteBundle> => {
  const supabase = await getPublicClient();
  const [content, settings, services, featuredPortfolio, featuredGallery, testimonials] = await Promise.all([
    supabase.from("site_content").select("key,value"),
    supabase.from("settings").select("key,value"),
    supabase.from("services").select("*").eq("active", true).order("sort_order"),
    supabase.from("portfolio").select("*").eq("featured", true).order("sort_order").limit(9),
    supabase.from("gallery").select("*").eq("featured", true).order("sort_order").limit(12),
    supabase.from("testimonials").select("*").order("sort_order"),
  ]);
  const bySection = <T,>(rows: { key: string; value: unknown }[] | null, key: string, fallback: T): T =>
    (rows?.find((r) => r.key === key)?.value as T | undefined) ?? fallback;

  return {
    hero: bySection(content.data, "hero", {
      heading: "", subheading: "", background_url: "", background_type: "image",
      cta_primary_label: "View Portfolio", cta_primary_href: "/portfolio",
      cta_secondary_label: "Enquire Now", cta_secondary_href: "/contact",
    }),
    about: bySection(content.data, "about", {
      name: "", tagline: "", portrait_url: "", story: "", mission: "", approach: "", experience: "",
    }),
    why_choose: bySection(content.data, "why_choose", { items: [] }),
    footer: bySection(content.data, "footer", { tagline: "", copyright: "" }),
    contact: bySection(settings.data, "contact", { email: "", phone: "", whatsapp: "", address: "", hours: "" }),
    social: bySection(settings.data, "social", { instagram: "", facebook: "", youtube: "", tiktok: "", vimeo: "" }),
    instagram_feed: bySection(settings.data, "instagram_feed", { images: [] }),
    services: (services.data ?? []) as SiteBundle["services"],
    featured_portfolio: (featuredPortfolio.data ?? []) as SiteBundle["featured_portfolio"],
    featured_gallery: (featuredGallery.data ?? []) as SiteBundle["featured_gallery"],
    testimonials: (testimonials.data ?? []) as SiteBundle["testimonials"],
  };
});

export const listPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await getPublicClient();
  const { data, error } = await supabase.from("portfolio").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
});

export const listGallery = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await getPublicClient();
  const { data, error } = await supabase.from("gallery").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
});

// ========================= ENQUIRY (public write) =========================

const enquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  event_date: z.string().trim().max(20).optional().or(z.literal("")),
  venue: z.string().trim().max(200).optional().or(z.literal("")),
  service: z.string().trim().max(100).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(4000),
});

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data) => enquirySchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = await getPublicClient();
    const { error } = await supabase.from("enquiries").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      event_date: data.event_date || null,
      venue: data.venue || null,
      service: data.service || null,
      budget: data.budget || null,
      message: data.message,
    });
    if (error) throw error;
    return { ok: true as const };
  });

// ========================= ADMIN WRITES =========================

export const adminGetAll = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await requireAdmin();
  const [content, settings, services, portfolio, gallery, testimonials, enquiries] = await Promise.all([
    supabase.from("site_content").select("key,value"),
    supabase.from("settings").select("key,value"),
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("portfolio").select("*").order("sort_order"),
    supabase.from("gallery").select("*").order("sort_order"),
    supabase.from("testimonials").select("*").order("sort_order"),
    supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(200),
  ]);
  return {
    content: content.data ?? [],
    settings: settings.data ?? [],
    services: services.data ?? [],
    portfolio: portfolio.data ?? [],
    gallery: gallery.data ?? [],
    testimonials: testimonials.data ?? [],
    enquiries: enquiries.data ?? [],
  };
});

export const upsertContent = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ key: z.string().min(1).max(50), value: z.any() }).parse(data))
  .handler(async ({ data }) => {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("site_content").upsert({ key: data.key, value: data.value });
    if (error) throw error;
    return { ok: true as const };
  });

export const upsertSettings = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ key: z.string().min(1).max(50), value: z.any() }).parse(data))
  .handler(async ({ data }) => {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("settings").upsert({ key: data.key, value: data.value });
    if (error) throw error;
    return { ok: true as const };
  });

// ---------- services CRUD ----------
const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(120),
  description: z.string().max(600),
  icon: z.string().max(40),
  sort_order: z.number().int(),
  active: z.boolean(),
});
export const upsertService = createServerFn({ method: "POST" })
  .inputValidator((data) => serviceSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("services").upsert(data);
    if (error) throw error;
    return { ok: true as const };
  });
export const deleteService = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("services").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });

// ---------- portfolio CRUD ----------
const portfolioSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  category: z.string().min(1).max(60),
  description: z.string().max(2000),
  youtube_url: z.string().max(500).nullable(),
  vimeo_url: z.string().max(500).nullable(),
  thumbnail_url: z.string().nullable(),
  cover_url: z.string().nullable(),
  featured: z.boolean(),
  sort_order: z.number().int(),
});
export const upsertPortfolio = createServerFn({ method: "POST" })
  .inputValidator((data) => portfolioSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("portfolio").upsert(data);
    if (error) throw error;
    return { ok: true as const };
  });
export const deletePortfolio = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("portfolio").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });

// ---------- gallery CRUD ----------
const gallerySchema = z.object({
  id: z.string().uuid().optional(),
  image_url: z.string().min(1),
  alt: z.string().max(200),
  category: z.string().min(1).max(60),
  featured: z.boolean(),
  sort_order: z.number().int(),
});
export const upsertGalleryItem = createServerFn({ method: "POST" })
  .inputValidator((data) => gallerySchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("gallery").upsert(data);
    if (error) throw error;
    return { ok: true as const };
  });
export const deleteGalleryItem = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("gallery").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });

// ---------- testimonials CRUD ----------
const testimonialSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(120),
  role: z.string().max(120),
  quote: z.string().min(1).max(2000),
  avatar_url: z.string().nullable(),
  sort_order: z.number().int(),
});
export const upsertTestimonial = createServerFn({ method: "POST" })
  .inputValidator((data) => testimonialSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("testimonials").upsert(data);
    if (error) throw error;
    return { ok: true as const };
  });
export const deleteTestimonial = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("testimonials").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });

// ---------- reorder helper for any table with sort_order ----------
const reorderSchema = z.object({
  table: z.enum(["services", "portfolio", "gallery", "testimonials"]),
  ids: z.array(z.string().uuid()).max(500),
});
export const reorderItems = createServerFn({ method: "POST" })
  .inputValidator((d) => reorderSchema.parse(d))
  .handler(async ({ data }) => {
    const supabase = await requireAdmin();
    await Promise.all(
      data.ids.map((id, index) =>
        supabase.from(data.table).update({ sort_order: index }).eq("id", id),
      ),
    );
    return { ok: true as const };
  });

// ---------- enquiry delete ----------
export const deleteEnquiry = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("enquiries").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });