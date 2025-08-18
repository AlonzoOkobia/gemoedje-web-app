import {
  SingleSupportResponse,
  Support,
  SupportResponse,
} from "@/libs/types/support.type";
import { apiClient } from "../auth";

export const getAllSupportMessages = async (): Promise<SupportResponse> => {
  const response = await apiClient.get("/supports");
  return response.data;
};

export const getSupportMessageById = async (
  id: string,
): Promise<SingleSupportResponse> => {
  const response = await apiClient.get(`/supports/${id}`);
  return response.data;
};

export const createSupportMessage = async (message: Partial<Support>) => {
  const reqData = {
    data: {
      ...message,
    },
  };
  const response = await apiClient.post<SingleSupportResponse>(
    "/supports",
    reqData,
  );
  return response.data;
};

export const updateSupportMessage = async (
  id: string,
  message: Partial<Support>,
) => {
  const reqData = {
    data: {
      ...message,
    },
  };
  const response = await apiClient.put(`/supports/${id}`, reqData);
  return response.data;
};
