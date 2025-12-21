import {
  Article,
  ProviderProfile,
  ProviderProfileResponse,
  ProviderUser,
  StrapiError,
  StrapiResponse,
  StrapiUser,
  StrapiUserResponse,
} from "@/types/strapi";
import axios from "axios";
import qs from "qs";
import { Profile } from "../data";

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

class StrapiApiError extends Error {
  public status: number;
  public details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = "StrapiApiError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Register a new user with Strapi authentication
 */
export async function registerUser(
  userData: StrapiUser,
): Promise<StrapiUserResponse> {
  try {
    const response = await fetch(`${STRAPI_BASE_URL}/api/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as StrapiError;
      throw new StrapiApiError(
        error.error.message || "User registration failed",
        response.status,
        error.error.details,
      );
    }

    return data as StrapiUserResponse;
  } catch (error) {
    if (error instanceof StrapiApiError) {
      throw error;
    }
    throw new StrapiApiError("Network error during user registration", 500);
  }
}

/**
 * Create a provider profile after user registration
 */
export async function createProviderProfile(
  profileData: ProviderProfile,
  jwt: string,
): Promise<ProviderProfileResponse> {
  try {
    const response = await fetch(`${STRAPI_BASE_URL}/api/provider-profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as StrapiError;
      throw new StrapiApiError(
        error.error.message || "Provider profile creation failed",
        response.status,
        error.error.details,
      );
    }

    return data as ProviderProfileResponse;
  } catch (error) {
    if (error instanceof StrapiApiError) {
      throw error;
    }
    throw new StrapiApiError(
      "Network error during provider profile creation",
      500,
    );
  }
}

/**
 * Complete provider registration (user + profile creation)
 * This is the main function that handles the two-step registration process
 */
export async function completeProviderRegistration(
  userData: StrapiUser,
  profileData: Omit<ProviderProfile["data"], "email">,
): Promise<{
  user: StrapiUserResponse;
  profile: ProviderProfileResponse;
}> {
  // Step 1: Register the user
  const userResponse = await registerUser(userData);

  // Step 2: Create the provider profile
  const providerProfileData: ProviderProfile = {
    data: {
      ...profileData,
      email: userData.email,
    },
  };

  const profileResponse = await createProviderProfile(
    providerProfileData,
    userResponse.jwt,
  );

  return {
    user: userResponse,
    profile: profileResponse,
  };
}

/**
 * Utility function to check if error is related to email/username conflicts
 */
export function isEmailConflictError(error: StrapiApiError): boolean {
  return (
    error.message.toLowerCase().includes("email") ||
    error.message.toLowerCase().includes("username") ||
    error.status === 400
  );
}

/**
 * Extract user-friendly error message from Strapi error
 */
export function extractErrorMessage(error: StrapiApiError): string {
  if (error.details?.errors?.length > 0) {
    return error.details.errors[0].message;
  }
  return error.message;
}

export interface ArticleFilters {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface ArticleApiResponse {
  data: Article[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function fetchArticles(
  filters?: ArticleFilters,
): Promise<Article[]> {
  const queryParams = new URLSearchParams();
  queryParams.append("populate", "banner");

  if (filters?.page) {
    queryParams.append("pagination[page]", filters.page.toString());
  }
  if (filters?.pageSize) {
    queryParams.append("pagination[pageSize]", filters.pageSize.toString());
  }
  if (filters?.searchQuery) {
    queryParams.append(
      "filters[$or][0][title][$containsi]",
      filters.searchQuery,
    );
    queryParams.append(
      "filters[$or][1][slug][$containsi]",
      filters.searchQuery,
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
      next: { revalidate: 0 },
    },
  );

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(
      `Failed to fetch articles: ${res.status} - ${errorDetails}`,
    );
  }

  const json: StrapiResponse<Article> = await res.json();
  return json.data;
}

export async function fetchArticlesWithPagination(
  filters?: ArticleFilters,
): Promise<ArticleApiResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append("populate", "banner");
  queryParams.append("sort", "createdAt:desc");

  if (filters?.page) {
    queryParams.append("pagination[page]", filters.page.toString());
  }
  if (filters?.pageSize) {
    queryParams.append("pagination[pageSize]", filters.pageSize.toString());
  }
  if (filters?.searchQuery) {
    queryParams.append(
      "filters[$or][0][title][$containsi]",
      filters.searchQuery,
    );
    queryParams.append(
      "filters[$or][1][slug][$containsi]",
      filters.searchQuery,
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
      next: { revalidate: 0 },
    },
  );

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(
      `Failed to fetch articles: ${res.status} - ${errorDetails}`,
    );
  }

  const json: StrapiResponse<Article> = await res.json();
  return {
    data: json.data,
    meta: json.meta,
  };
}
export interface ProviderFilters {
  page?: number;
  pageSize?: number;

  searchQuery?: string;
  location?: string;
  radius?: number;

  latitude: number | null;
  longitude: number | null;

  firstName?: string;
  lastName?: string;
  businessName?: string;
  gender?: string;
  isPremium?: boolean;
  maxWaitingWeeks?: number;
  onlyAvailableNow?: boolean;
  culturalBackground?: string[];
  providerType?: string[];
  consultationTypes?: string[];
  sessionFormats?: string[];
  ageGroups?: string[];
  treatmentMethods?: string[];
  specialities?: string[];
  languages?: string[];
  ethnicity?: string[];
  focusAreas?: string[];
  insuranceProviders?: string[];
  availability?: string[];
  religion?: string[];

  isApproved: boolean;
}

export interface ProviderApiResponse {
  data: Profile[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function getAllProviders(
  filters: ProviderFilters,
): Promise<ProviderApiResponse> {
  try {
    const { latitude, longitude, radius, location, ...restFilters } = filters;

    const queryFilters: any = {}; // Object to hold filters for Strapi's 'filters' param

    // Basic text filters from `restFilters`
    if (restFilters.isApproved) {
      queryFilters.isApproved = { $eq: restFilters.isApproved };
    }
    if (restFilters.firstName) {
      queryFilters.firstName = { $containsi: restFilters.firstName };
    }
    if (restFilters.lastName) {
      queryFilters.lastName = { $containsi: restFilters.lastName };
    }
    if (restFilters.businessName) {
      queryFilters.businessName = { $containsi: restFilters.businessName };
    }
    if (restFilters.gender && restFilters.gender !== "any") {
      queryFilters.gender = { $eq: restFilters.gender };
    }
    if (restFilters.isPremium !== undefined) {
      queryFilters.isPremium = { $eq: restFilters.isPremium };
    }
    if (restFilters.maxWaitingWeeks !== undefined) {
      queryFilters.waitingTime = { $lte: restFilters.maxWaitingWeeks };
    }
    if (restFilters.onlyAvailableNow) {
      queryFilters.waitingTime = { $eq: 0 };
    }
    if (restFilters.culturalBackground?.length) {
      queryFilters.culturalBackground = {
        documentId: { $in: restFilters.culturalBackground },
      };
    }
    if (restFilters.providerType?.length) {
      queryFilters.providerType = {
        documentId: { $in: restFilters.providerType },
      };
    }
    if (restFilters.consultationTypes?.length) {
      queryFilters.consultationTypes = {
        documentId: { $in: restFilters.consultationTypes },
      };
    }
    if (restFilters.sessionFormats?.length) {
      queryFilters.sessionFormats = {
        documentId: { $in: restFilters.sessionFormats },
      };
    }
    if (restFilters.ageGroups?.length) {
      queryFilters.ageGroups = {
        documentId: { $in: restFilters.ageGroups },
      };
    }
    if (restFilters.treatmentMethods?.length) {
      queryFilters.treatmentMethods = {
        documentId: { $in: restFilters.treatmentMethods },
      };
    }

    if (restFilters.specialities?.length) {
      queryFilters.specialities = {
        documentId: { $in: restFilters.specialities },
      };
    }

    if (restFilters.languages?.length) {
      queryFilters.languages = {
        documentId: { $in: restFilters.languages },
      };
    }
    if (restFilters.ethnicity?.length) {
      queryFilters.ethnicity = {
        documentId: { $in: restFilters.ethnicity },
      };
    }
    if (restFilters.focusAreas?.length) {
      queryFilters.focusAreas = {
        documentId: { $in: restFilters.focusAreas },
      };
    }
    if (restFilters.insuranceProviders?.length) {
      queryFilters.insuranceProviders = {
        documentId: { $in: restFilters.insuranceProviders },
      };
    }
    if (restFilters.availability?.length) {
      queryFilters.availability = {
        documentId: { $in: restFilters.availability },
      };
    }
    if (restFilters.religion?.length) {
      queryFilters.religion = {
        documentId: { $in: restFilters.religion },
      };
    }
    if (restFilters.searchQuery) {
      queryFilters.$or = [
        { firstName: { $containsi: restFilters.searchQuery } },
        { lastName: { $containsi: restFilters.searchQuery } },
        { businessName: { $containsi: restFilters.searchQuery } },
        { description: { $containsi: restFilters.searchQuery } },
        { specialities: { name: { $containsi: restFilters.searchQuery } } },
        { treatmentMethods: { name: { $containsi: restFilters.searchQuery } } },
      ];
    }

    const mainQuery: Record<string, any> = {
      filters: queryFilters,
      pagination: {
        page: restFilters.page || 1,
        pageSize: restFilters.pageSize || 20,
      },

      populate: {
        profilePhoto: true,
        gender: true,
        providerType: true,
        ageGroups: true,
        consultationTypes: true,
        culturalBackground: true,
        languages: true,
        treatmentMethods: true,
        specialities: true,
        sessionFormats: true,
        religion: true,
      },
      sort: ["createdAt:desc"],
    };

    if (latitude !== null && longitude !== null && radius !== undefined) {
      mainQuery.latitude = latitude;
      mainQuery.longitude = longitude;
      mainQuery.radius = radius;
    }

    const queryString = qs.stringify(mainQuery, {
      encodeValuesOnly: true,
      arrayFormat: "indices",
      addQueryPrefix: false,
    });

    const response = await axios.get(`/api/provider-profiles?${queryString}`);

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch providers: ${response.status} - ${response.statusText}`,
      );
    }

    const strapiData = response.data;
    const transformedData: Profile[] = strapiData.data.map((item: any) => ({
      id: item.id.toString(),
      documentId: item.documentId,
      ...item,
    }));

    return {
      data: transformedData,
      meta: strapiData.meta,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch providers: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function fetchProviders(): Promise<ProviderUser[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/users?filters[role][name][$eq]=Provider&fields[0]=id&fields[1]=email&fields[2]=blocked&fields[4]=createdAt&populate[provider_profile][fields][0]=firstName&populate[provider_profile][fields][1]=lastName&populate[provider_profile][fields][2]=businessName&populate[provider_profile][fields][3]=phoneNo&populate[provider_profile][fields][4]=kvkNo&populate[provider_profile][fields][5]=isPremium`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
      next: { revalidate: 0 },
    },
  );

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(
      `Failed to fetch providers: ${res.status} - ${errorDetails}`,
    );
  }

  const json: StrapiResponse<ProviderUser> = await res.json();
  return json.data;
}
