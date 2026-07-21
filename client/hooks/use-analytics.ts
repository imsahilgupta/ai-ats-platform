import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/lib/api/analytics";
import { qk } from "@/lib/query/keys";

export function useAnalyticsQuery() {
  return useQuery({
    queryKey: qk.analytics(),
    queryFn: getAnalytics,
  });
}
