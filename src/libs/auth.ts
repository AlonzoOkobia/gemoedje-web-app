import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { STRAPI_API_URL } from "./constant/url";
import { Profile } from "./data";

export interface User {
  id: number;
  username: string;
  email: string;
  role?: {
    id: number;
    name: string;
    description: string;
    type: string;
  };
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: string;
}

const apiClient = axios.create({
  baseURL: STRAPI_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (
      typeof window !== "undefined" &&
      config.url &&
      !config.url.startsWith("/api/")
    ) {
      let token = localStorage.getItem("auth-token");
      if (!token) {
        const cookies = document.cookie.split(";");
        const authCookie = cookies.find((cookie) =>
          cookie.startsWith("auth-token="),
        );
        if (authCookie) {
          token = authCookie.split("=")[1];
        }
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user-data");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      const { jwt, user } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("auth-token", jwt);
        localStorage.setItem("user-data", JSON.stringify(user));
      }

      return { jwt, user };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message || "Login failed";
      throw new Error(errorMessage);
    }
  }

  static async validateToken(token: string): Promise<User | null> {
    try {
      const response = await axios.get(
        `${STRAPI_API_URL}/users/me?populate=role`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return null;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get(
        "/users/me?populate[role]=*&populate[provider_profile][populate][0]=profilePhoto&populate[provider_profile][populate][1]=gender&populate[provider_profile][populate][2]=providerType&populate[provider_profile][populate][3]=ageGroups&populate[provider_profile][populate][4]=consultationTypes&populate[provider_profile][populate][5]=culturalBackground&populate[provider_profile][populate][6]=languages&populate[provider_profile][populate][7]=treatmentMethods&populate[provider_profile][populate][8]=specialities&populate[provider_profile][populate][9]=sessionFormats",
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return null;
    }
  }

  static async updateProviderProfile(
    providerId: string,
    providerProfileData: Partial<Profile>,
  ): Promise<User | null> {
    try {
      const response = await apiClient.put(
        `/provider-profiles/${providerId}`,
        {
          data: providerProfileData,
        },
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return null;
    }
  }

  static async getCompleteUserProfile(): Promise<any | null> {
    try {
      const response = await axios.get("/api/user/profile");
      return response.data.user;
    } catch (error: any) {
      return null;
    }
  }

  static async logout(): Promise<any> {
    try {
      const response = await axios.post("/api/auth/logout");
      return response;
    } catch (error) {
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user-data");
      }
    }
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("auth-token");
      if (localToken) return localToken;

      return this.getTokenFromClientCookies() || null;
    }
    return null;
  }

  private static getTokenFromClientCookies(): string | null {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "auth-token") {
          return value;
        }
      }
    }
    return null;
  }

  static getUser(): User | null {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user-data");
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static hasRole(requiredRole: string): boolean {
    const user = this.getUser();
    if (!user || !user.role) return false;

    return (
      user.role.type === requiredRole ||
      user.role.name.toLowerCase() === requiredRole.toLowerCase()
    );
  }

  static isProvider(): boolean {
    return this.hasRole("provider");
  }

  static isAdmin(): boolean {
    return this.hasRole("admin") || this.hasRole("administrator");
  }

  static async refreshToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      const user = await this.validateToken(token);
      if (user) {
        localStorage.setItem("user-data", JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  static async updateUserProfile(
    profileData: Partial<User>,
  ): Promise<User | null> {
    try {
      const response = await apiClient.put("/users/me", profileData);
      const updatedUser = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("user-data", JSON.stringify(updatedUser));
      }

      return updatedUser;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error?.message || "Failed to update profile",
      );
    }
  }
}

export function getTokenFromCookies(cookies: string): string | null {
  const cookieArray = cookies.split(";").map((cookie) => cookie.trim());
  const authCookie = cookieArray.find((cookie) =>
    cookie.startsWith("auth-token="),
  );
  return authCookie ? authCookie.split("=")[1] : null;
}

export async function validateServerSideAuth(
  token: string,
): Promise<{ user: User | null; isValid: boolean }> {
  try {
    const response = await fetch(`${STRAPI_API_URL}/users/me?populate=role`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { user: null, isValid: false };
    }

    const user = await response.json();
    return { user, isValid: true };
  } catch (error) {
    return { user: null, isValid: false };
  }
}

export async function fetchUserProfileSSR(
  token: string,
): Promise<{ user: any | null; isValid: boolean }> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/users/me?populate[role]=*&populate[provider_profile][populate][0]=profilePhoto&populate[provider_profile][populate][1]=gender&populate[provider_profile][populate][2]=providerType&populate[provider_profile][populate][3]=ageGroups&populate[provider_profile][populate][4]=consultationTypes&populate[provider_profile][populate][5]=culturalBackground&populate[provider_profile][populate][6]=languages&populate[provider_profile][populate][7]=treatmentMethods&populate[provider_profile][populate][8]=specialities&populate[provider_profile][populate][9]=sessionFormats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return { user: null, isValid: false };
    }

    const user = await response.json();
    return { user, isValid: true };
  } catch (error) {
    return { user: null, isValid: false };
  }
}

export function canAccessProvider(user: User | null): boolean {
  if (!user) return false;
  return (
    user.role?.type === "provider" ||
    user.role?.name.toLowerCase() === "provider"
  );
}

export function canAccessAdmin(user: User | null): boolean {
  if (!user) return false;
  return (
    user.role?.type === "admin" ||
    user.role?.name.toLowerCase() === "admin" ||
    user.role?.name.toLowerCase() === "administrator"
  );
}

export { apiClient };
