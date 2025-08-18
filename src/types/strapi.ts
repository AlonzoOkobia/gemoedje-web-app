import { Profile } from "@/libs/data";

export interface StrapiUser {
  username: string;
  email: string;
  password: string;
}

export interface StrapiUserResponse {
  user: {
    id: number;
    username: string;
    email: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
  jwt: string;
}

export interface ProviderProfileData {
  firstName: string;
  lastName: string;
  businessName: string;
  businessAddress: string;
  phoneNo: string;
  kvkNo: string;
  email: string;
}

export interface ProviderProfile {
  data: ProviderProfileData;
}

export interface ProviderProfileResponse {
  data: {
    id: number;
    attributes: ProviderProfileData & {
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  };
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
    };
  };
}

export interface StrapiErrorDetail {
  path: string[];
  message: string;
  name?: string;
}

export interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: {
      errors: StrapiErrorDetail[];
    };
  };
}

export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  businessName: string;
  businessAddress: string;
  phoneNo: string;
  kvkNo: string;
  email: string;
  password: string;
}

export interface ApiSuccessResponse<T = any> {
  data: T;
  meta?: any;
}

export interface ApiErrorResponse {
  error: {
    status: number;
    message: string;
    details?: any;
  };
}
export interface StrapiImage {
  id: number;
  attributes: {
    url: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    mime?: string;
  };
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  writtenBy?: string;
  tags?: string[];
  banner?: {
    id: number;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StrapiResponse<T> {
  data: T[];
  meta: any;
}

export interface ProviderUser {
  id: number;
  email: string;
  blocked: boolean;
  confirmed: boolean;
  createdAt: string;
  documentId: string;
  provider_profile: Profile;
}
