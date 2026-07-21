import { apiFetch } from "@/lib/api/client";
import type {
  AdminDatabaseResponse,
  AdminGrowthResponse,
  AdminReportEntry,
  AdminSubscriptionEntry,
  AdminSystemResponse,
  AdminUser,
} from "@/types/admin";

export function getAdminUsers() {
  return apiFetch<{ users: AdminUser[] }>("/admin/users");
}

export function getAdminSubscriptions() {
  return apiFetch<{ subscriptions: AdminSubscriptionEntry[] }>("/admin/subscriptions");
}

export function getAdminReports() {
  return apiFetch<{ reports: AdminReportEntry[] }>("/admin/reports");
}

export function getAdminGrowth() {
  return apiFetch<AdminGrowthResponse>("/admin/growth");
}

export function getAdminDatabase() {
  return apiFetch<AdminDatabaseResponse>("/admin/database");
}

export function getAdminSystem() {
  return apiFetch<AdminSystemResponse>("/admin/system");
}
