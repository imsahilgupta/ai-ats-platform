import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteInterviewReport,
  getAllInterviewReports,
  getInterviewReport,
} from "@/lib/api/interview";
import { qk } from "@/lib/query/keys";

export function useInterviewReportsQuery() {
  return useQuery({
    queryKey: qk.interviewReports(),
    queryFn: getAllInterviewReports,
  });
}

export function useInterviewReportQuery(id: string) {
  return useQuery({
    queryKey: qk.interviewReport(id),
    queryFn: () => getInterviewReport(id),
    enabled: !!id,
  });
}

export function useDeleteInterviewReportMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInterviewReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.interviewReports() });
    },
  });
}
