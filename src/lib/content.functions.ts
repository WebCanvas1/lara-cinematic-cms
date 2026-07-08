// Client wrappers matching the previous server-fn shapes: `fn({ data })`.
import { api } from "./api";
import type {
  Service,
  PortfolioItem,
  GalleryItem,
  Testimonial,
  PackageItem,
  AddOnItem,
} from "./site-types";

type Result = { ok: true };

export const submitEnquiry = ({ data }: { data: Record<string, string> }) =>
  api.post<Result>("/api/enquiry", data);

export const upsertContent = ({ data }: { data: { key: string; value: unknown } }) =>
  api.post<Result>("/api/content", data);

export const upsertSettings = ({ data }: { data: { key: string; value: unknown } }) =>
  api.post<Result>("/api/settings", data);

export const upsertService = ({ data }: { data: Partial<Service> }) =>
  api.post<Result>("/api/services", { action: "upsert", item: data });

export const deleteService = ({ data }: { data: { id: string } }) =>
  api.post<Result>("/api/services", { action: "delete", id: data.id });

export const upsertPortfolio = ({ data }: { data: Partial<PortfolioItem> }) =>
  api.post<Result>("/api/portfolio", { action: "upsert", item: data });

export const deletePortfolio = ({ data }: { data: { id: string } }) =>
  api.post<Result>("/api/portfolio", { action: "delete", id: data.id });

export const upsertGalleryItem = ({ data }: { data: Partial<GalleryItem> }) =>
  api.post<Result>("/api/gallery", { action: "upsert", item: data });

export const deleteGalleryItem = ({ data }: { data: { id: string } }) =>
  api.post<Result>("/api/gallery", { action: "delete", id: data.id });

export const upsertTestimonial = ({ data }: { data: Partial<Testimonial> }) =>
  api.post<Result>("/api/testimonials", { action: "upsert", item: data });

export const deleteTestimonial = ({ data }: { data: { id: string } }) =>
  api.post<Result>("/api/testimonials", { action: "delete", id: data.id });

export const upsertPackage = ({ data }: { data: Partial<PackageItem> }) =>
  api.post<Result>("/api/packages", { action: "upsert", item: data });

export const deletePackage = ({ data }: { data: { id: string } }) =>
  api.post<Result>("/api/packages", { action: "delete", id: data.id });

export const upsertAddon = ({ data }: { data: Partial<AddOnItem> }) =>
  api.post<Result>("/api/addons", { action: "upsert", item: data });

export const deleteAddon = ({ data }: { data: { id: string } }) =>
  api.post<Result>("/api/addons", { action: "delete", id: data.id });

export const reorderItems = ({
  data,
}: {
  data: { table: "services" | "portfolio" | "gallery" | "testimonials" | "packages" | "addons"; ids: string[] };
}) => api.post<Result>(`/api/${data.table}`, { action: "reorder", ids: data.ids });

export const deleteEnquiry = ({ data }: { data: { id: string } }) =>
  api.post<Result>("/api/enquiry", { action: "delete", id: data.id });