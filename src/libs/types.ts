export interface ProviderRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  providerType: string;
  bigNumber?: string;
  kvkNumber: string;
  practiceAddress: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
  subscription?: "basic" | "premium";
  subscriptionStatus?: "active" | "inactive";
}

export type TDropdownData = {
  label: string;
  value: string;
};

export interface SubscriptionPlan {
  id: "basic" | "premium";
  name: string;
  price: number;
  billingPeriod: "monthly" | "annual";
  features: string[];
}

export interface SpecialtyRequest {
  id: string;
  providerId: string;
  providerName: string;
  specialty: string;
  justification: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface ProviderSetupState {
  registrationStatus: "pending" | "approved" | "rejected";
  setupStep: "welcome" | "subscription" | "payment" | "complete";
  subscription?: {
    plan: "basic" | "premium";
    status: "active" | "pending";
  };
}

export type TSessionFormatItem = {
  label: string;
  value: string;
};
