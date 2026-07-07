import { queryOptions } from "@tanstack/react-query";
import { api } from "./api";
import type { SiteBundle, PortfolioItem, GalleryItem } from "./site-types";

export const siteBundleQuery = queryOptions({
  queryKey: ["site-bundle"],
  queryFn: () => api.get<SiteBundle>("/api/content"),
  staleTime: 30_000,
});

export const portfolioQuery = queryOptions({
  queryKey: ["portfolio-all"],
  queryFn: () => api.get<PortfolioItem[]>("/api/portfolio"),
  staleTime: 30_000,
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery-all"],
  queryFn: () => api.get<GalleryItem[]>("/api/gallery"),
  staleTime: 30_000,
});

export const adminStatusQuery = queryOptions({
  queryKey: ["admin-status"],
  queryFn: () => api.get<{ unlocked: boolean }>("/api/session"),
  staleTime: 5_000,
});