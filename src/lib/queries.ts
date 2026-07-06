import { queryOptions } from "@tanstack/react-query";
import { getSiteBundle, listPortfolio, listGallery } from "./content.functions";
import { checkAdminStatus } from "./admin.functions";

export const siteBundleQuery = queryOptions({
  queryKey: ["site-bundle"],
  queryFn: () => getSiteBundle(),
  staleTime: 30_000,
});

export const portfolioQuery = queryOptions({
  queryKey: ["portfolio-all"],
  queryFn: () => listPortfolio(),
  staleTime: 30_000,
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery-all"],
  queryFn: () => listGallery(),
  staleTime: 30_000,
});

export const adminStatusQuery = queryOptions({
  queryKey: ["admin-status"],
  queryFn: () => checkAdminStatus(),
  staleTime: 5_000,
});