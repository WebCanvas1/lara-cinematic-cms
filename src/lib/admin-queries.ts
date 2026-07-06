import { queryOptions } from "@tanstack/react-query";
import { adminGetAll } from "./content.functions";

export const adminAllQuery = queryOptions({
  queryKey: ["admin-all"],
  queryFn: () => adminGetAll(),
  staleTime: 5_000,
});