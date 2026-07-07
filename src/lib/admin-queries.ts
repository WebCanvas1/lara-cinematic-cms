import { queryOptions } from "@tanstack/react-query";
import { api } from "./api";
import type {
  Service,
  PortfolioItem,
  GalleryItem,
  Testimonial,
  Enquiry,
} from "./site-types";

export type AdminBundle = {
  content: { key: string; value: unknown }[];
  settings: { key: string; value: unknown }[];
  services: Service[];
  portfolio: PortfolioItem[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  enquiries: Enquiry[];
};

export const adminAllQuery = queryOptions({
  queryKey: ["admin-all"],
  queryFn: () => api.get<AdminBundle>("/api/admin/all"),
  staleTime: 5_000,
});