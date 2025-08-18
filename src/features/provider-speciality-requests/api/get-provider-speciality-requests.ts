import {
  GetProviderSpecialityRequestsParams,
  TProviderSpecialityRequestsResponseData,
} from "../types/provider-speciality-request.type";

export const getProviderSpecialityRequests = async (
  params: GetProviderSpecialityRequestsParams = {},
): Promise<TProviderSpecialityRequestsResponseData> => {
  const { page = 1, pageSize = 10, approved } = params;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (approved !== undefined) {
    searchParams.append("approved", approved.toString());
  }

  const response = await fetch(
    `/api/admin/provider-request-specialities?${searchParams}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch provider speciality requests");
  }

  const data = await response.json();
  return data;
};
