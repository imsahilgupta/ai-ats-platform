import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "@/lib/api/analytics";
import {
  getAdminDatabase,
  getAdminGrowth,
  getAdminReports,
  getAdminSubscriptions,
  getAdminSystem,
  getAdminUsers,
} from "@/lib/api/admin";
import { qk } from "@/lib/query/keys";

export function useAdminStatsQuery() {
  return useQuery({
    queryKey: qk.adminStats(),
    queryFn: getAdminStats,
  });
}

export function useAdminUsersQuery() {
  return useQuery({
    queryKey: qk.adminUsers(),
    queryFn: getAdminUsers,
  });
}

export function useAdminSubscriptionsQuery() {
  return useQuery({
    queryKey: qk.adminSubscriptions(),
    queryFn: getAdminSubscriptions,
  });
}

export function useAdminReportsQuery() {
  return useQuery({
    queryKey: qk.adminReports(),
    queryFn: getAdminReports,
  });
}

export function useAdminGrowthQuery() {
  return useQuery({
    queryKey: qk.adminGrowth(),
    queryFn: getAdminGrowth,
  });
}

export function useAdminDatabaseQuery() {
  return useQuery({
    queryKey: qk.adminDatabase(),
    queryFn: getAdminDatabase,
  });
}

export function useAdminSystemQuery() {
  return useQuery({
    queryKey: qk.adminSystem(),
    queryFn: getAdminSystem,
    refetchInterval: 15_000,
  });
}
