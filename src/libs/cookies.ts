export interface CookieCategory {
  id: string;
  required: boolean;
}

export const cookieCategories: CookieCategory[] = [
  {
    id: "essential",
    required: true,
  },
  {
    id: "functional",
    required: false,
  },
  {
    id: "analytics",
    required: false,
  },
  {
    id: "marketing",
    required: false,
  },
];

export interface CookieConsent {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: any;
}

export const defaultConsent: CookieConsent = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: new Date().toISOString(),
};

export function saveCookieConsent(consent: CookieConsent): void {
  localStorage.setItem("cookieConsent", JSON.stringify(consent));
}

export function getCookieConsent(): CookieConsent | null {
  const saved = localStorage.getItem("cookieConsent");
  return saved ? JSON.parse(saved) : null;
}
