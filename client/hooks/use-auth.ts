import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api/auth";
import { qk } from "@/lib/query/keys";

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: qk.me(),
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60_000,
  });
}
