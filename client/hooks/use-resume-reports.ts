import { useQuery } from "@tanstack/react-query";
import { getResumeHistory } from "@/lib/api/resume";
import { qk } from "@/lib/query/keys";

export function useResumeHistoryQuery() {
  return useQuery({
    queryKey: qk.resumeHistory(),
    queryFn: getResumeHistory,
  });
}
