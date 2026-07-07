// Client-side wrappers that mirror the previous server-fn signatures so
// existing components (Contact, AdminDashboard, AdminUnlock) don't change.
import { api } from "./api";

export async function checkAdminStatus() {
  return api.get<{ unlocked: boolean }>("/api/session");
}

export async function unlockAdmin({ data }: { data: { password: string } }) {
  return api.post<{ ok: boolean }>("/api/login", data);
}

export async function lockAdmin() {
  return api.post<{ ok: true }>("/api/logout");
}