import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProfileDetails, updateProfileDetails } from "@/lib/api/profileDetails";
import { qk } from "@/lib/query/keys";

export function useProfileDetailsQuery() {
  return useQuery({
    queryKey: qk.profileDetails(),
    queryFn: getProfileDetails,
  });
}

export function useUpdateProfileDetailsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfileDetails,
    onSuccess: (data) => {
      queryClient.setQueryData(qk.profileDetails(), data);
      toast.success("Profile updated");
    },
    onError: () => toast.error("Failed to save changes. Please try again."),
  });
}
