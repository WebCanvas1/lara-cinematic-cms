import { queryOptions } from "@tanstack/react-query";
import { api } from "./api";
import type {
  Service,
  PortfolioItem,
  PortfolioSubcategory,
  GalleryItem,
  Testimonial,
  Enquiry,
  PackageItem,
  PackageSubcategory,
  AddOnItem,
  HomepageSection,
  TeamMember,
} from "./site-types";

export type AdminBundle = {
  content: { key: string; value: unknown }[];
  settings: { key: string; value: unknown }[];

  services: Service[];

  portfolio: PortfolioItem[];
  portfolio_categories: PortfolioSubcategory[];

  gallery: GalleryItem[];

  testimonials: Testimonial[];

  enquiries: Enquiry[];

  packages: PackageItem[];

  package_categories: PackageSubcategory[];

  addons: AddOnItem[];

  layout: HomepageSection[];

  team: TeamMember[];
};

export const adminAllQuery = queryOptions({
  queryKey: ["admin-all"],
  queryFn: () => api.get<AdminBundle>("/api/admin/all"),
  staleTime: 5_000,
});
