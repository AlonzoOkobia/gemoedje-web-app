export type ProviderSpecialityRequest = {
  id: number;
  documentId: string;
  name: string;
  justification: string;
  approved: boolean;
  isRejected: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  email: string;
};

export type TProviderSpecialityRequestsResponseData = {
  data: ProviderSpecialityRequest[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type ApproveSpecialityRequestPayload = {
  id: string;
  name: string;
  justification: string;
};

export type RejectSpecialityRequestPayload = {
  id: string;
  name: string;
  justification: string;
};

export type GetProviderSpecialityRequestsParams = {
  page?: number;
  pageSize?: number;
  approved?: boolean;
};
