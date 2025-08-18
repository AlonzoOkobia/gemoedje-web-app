import { RegistrationFormData } from "@/types/strapi";

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  details?: any;
  step?: string;
  userCreated?: boolean;
  userId?: number;
}

export interface UserRegistrationResponse {
  user: {
    id: number;
    username: string;
    email: string;
    confirmed: boolean;
  };
  jwt: string;
}

export interface ProviderProfileResponse {
  data: {
    id: number;
    attributes: {
      firstName: string;
      lastName: string;
      businessName: string;
      businessAddress: string;
      phoneNo: string;
      kvkNo: string;
      email: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  };
}

export interface CompleteRegistrationResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    confirmed: boolean;
  };
  profile: ProviderProfileResponse["data"];
  jwt: string;
}

export class ApiError extends Error {
  public status: number;
  public details?: any;
  public step?: string;
  public userCreated?: boolean;
  public userId?: number;

  constructor(
    message: string,
    status: number,
    details?: any,
    step?: string,
    userCreated?: boolean,
    userId?: number,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.step = step;
    this.userCreated = userCreated;
    this.userId = userId;
  }
}

export async function completeProviderRegistration(
  formData: RegistrationFormData,
): Promise<CompleteRegistrationResponse> {
  try {
    const response = await fetch("/api/register/provider", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || "Provider registration failed",
        response.status,
        data.details,
        data.step,
        data.userCreated,
        data.userId,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error during provider registration", 500);
  }
}

/**
 * Utility function to check if error is related to email/username conflicts
 */
export function isEmailConflictError(error: ApiError): boolean {
  return (
    error.message.toLowerCase().includes("email") ||
    error.message.toLowerCase().includes("username") ||
    error.status === 400 ||
    (error.details &&
      error.details.some(
        (detail: any) =>
          detail.message.toLowerCase().includes("email") ||
          detail.message.toLowerCase().includes("username"),
      ))
  );
}

/**
 * Extract user-friendly error message from API error
 */
export function extractErrorMessage(error: ApiError): string {
  if (
    error.details &&
    Array.isArray(error.details) &&
    error.details.length > 0
  ) {
    return error.details[0].message || error.details[0];
  }
  return error.message;
}
