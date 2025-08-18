import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { approveSpecialityRequest } from "../api/approve-speciality-request";
import { getProviderSpecialityRequests } from "../api/get-provider-speciality-requests";
import { rejectSpecialityRequest } from "../api/reject-speciality-request";
import {
  ApproveSpecialityRequestPayload,
  GetProviderSpecialityRequestsParams,
  RejectSpecialityRequestPayload,
} from "../types/provider-speciality-request.type";

export const useProviderSpecialityRequests = (
  params: GetProviderSpecialityRequestsParams = {},
) => {
  return useQuery({
    queryKey: ["provider-speciality-requests", params],
    queryFn: () => getProviderSpecialityRequests(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useApproveSpecialityRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApproveSpecialityRequestPayload) =>
      approveSpecialityRequest(payload),
    onSuccess: () => {
      toast.success("Speciality request approved successfully!");
      queryClient.invalidateQueries({
        queryKey: ["provider-speciality-requests"],
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to approve speciality request: " + error.message);
    },
  });
};

export const useRejectSpecialityRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RejectSpecialityRequestPayload) =>
      rejectSpecialityRequest(payload),
    onSuccess: () => {
      toast.success("Speciality request rejected successfully!");
      queryClient.invalidateQueries({
        queryKey: ["provider-speciality-requests"],
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to reject speciality request: " + error.message);
    },
  });
};
