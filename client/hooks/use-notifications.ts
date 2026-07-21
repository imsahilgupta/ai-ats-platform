import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/api/notifications";
import { qk } from "@/lib/query/keys";

export function useNotificationsQuery() {
  return useQuery({
    queryKey: qk.notifications(),
    queryFn: getNotifications,
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: (notifications) => queryClient.setQueryData(qk.notifications(), notifications),
  });
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: (notifications) => queryClient.setQueryData(qk.notifications(), notifications),
  });
}
