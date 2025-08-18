import { ProviderUser } from "@/types/strapi";
import { clsx, type ClassValue } from "clsx";
import { unparse } from "papaparse";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PostalCodeCoordinates {
  latitude: number;
  longitude: number;
}

interface CityInfo {
  name: string;
  postalCode: string;
  coordinates: PostalCodeCoordinates;
}

export const dutchCities: Record<string, CityInfo> = {
  amsterdam: {
    name: "Amsterdam",
    postalCode: "1012 JS",
    coordinates: { latitude: 52.3731, longitude: 4.8924 },
  },
  rotterdam: {
    name: "Rotterdam",
    postalCode: "3011 BR",
    coordinates: { latitude: 51.9225, longitude: 4.4792 },
  },
  utrecht: {
    name: "Utrecht",
    postalCode: "3511 JC",
    coordinates: { latitude: 52.0894, longitude: 5.1246 },
  },
  "the hague": {
    name: "The Hague",
    postalCode: "2511 CK",
    coordinates: { latitude: 52.0705, longitude: 4.3007 },
  },
  "den haag": {
    name: "The Hague",
    postalCode: "2511 CK",
    coordinates: { latitude: 52.0705, longitude: 4.3007 },
  },
  eindhoven: {
    name: "Eindhoven",
    postalCode: "5611 AZ",
    coordinates: { latitude: 51.4381, longitude: 5.4752 },
  },
};

const postalCodeMap: Record<string, PostalCodeCoordinates> = {
  "1012 JS": { latitude: 52.3731, longitude: 4.8924 },
  "1017 CT": { latitude: 52.3602, longitude: 4.8935 },
  "1018 WB": { latitude: 52.3579, longitude: 4.9147 },
  // Rotterdam
  "3011 BR": { latitude: 51.9225, longitude: 4.4792 },
  "3012 KD": { latitude: 51.9201, longitude: 4.4779 },
  // Utrecht
  "3511 JC": { latitude: 52.0894, longitude: 5.1246 },
  "3512 JE": { latitude: 52.0907, longitude: 5.1199 },
  // The Hague
  "2511 CK": { latitude: 52.0705, longitude: 4.3007 },
  "2513 AM": { latitude: 52.0829, longitude: 4.3012 },
  // Eindhoven
  "5611 AZ": { latitude: 51.4381, longitude: 5.4752 },
};

export function getLocationInfo(
  input: string,
): { postalCode: string; coordinates: PostalCodeCoordinates } | null {
  const cleanInput = input.trim().toLowerCase();

  if (isValidDutchPostalCode(cleanInput)) {
    const coords = postalCodeMap[cleanInput];
    if (coords) {
      return { postalCode: cleanInput, coordinates: coords };
    }
  }

  const cityInfo = dutchCities[cleanInput];
  if (cityInfo) {
    return {
      postalCode: cityInfo.postalCode,
      coordinates: cityInfo.coordinates,
    };
  }

  return null;
}

export function calculateDistance(
  postalCode1: string,
  postalCode2: string,
): number | null {
  const location1 = postalCodeMap[postalCode1];
  const location2 = postalCodeMap[postalCode2];

  if (!location1 || !location2) return null;

  const R = 6371;
  const dLat = ((location2.latitude - location1.latitude) * Math.PI) / 180;
  const dLon = ((location2.longitude - location1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((location1.latitude * Math.PI) / 180) *
      Math.cos((location2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function isValidDutchPostalCode(postalCode: string): boolean {
  const regex = /^[1-9][0-9]{3}\s?[A-Z]{2}$/i;
  return regex.test(postalCode.trim());
}

export function formatDistance(distance: number | null): string {
  if (distance === null) return "Distance unknown";
  return `${distance} km away`;
}

export function downloadProvidersAsCSV(providers: ProviderUser[]) {
  const rows = providers.map((p) => ({
    Email: p.email,
    "Full Name": `${p.provider_profile?.firstName || ""} ${p.provider_profile?.lastName || ""}`,
    Business: p.provider_profile?.businessName || "",
    Phone: p.provider_profile?.phoneNo || "",
    "KVK No": p.provider_profile?.kvkNo || "",
    Gender: p.provider_profile?.gender || "",
    Religion: p.provider_profile?.religion || "",
    Status: p.blocked ? "Pending" : "Approved",
    "Subscription Status": p.provider_profile?.isPremium ? "Premium" : "Free",
    "Stripe Subscription ID": p.provider_profile?.stripeSubscriptionId || "",
    "Stripe Price ID": p.provider_profile?.priceId || "",
    "Stripe Subscription Expires At":
      p.provider_profile?.premiumsExpiresAt || "",
    "Stripe Subscription Cancel At Period End":
      p.provider_profile?.cancelAtPeriodEnd || "",
    "Premium Expires At": p.provider_profile?.premiumsExpiresAt || "",
    "Cultural Background":
      p.provider_profile?.culturalBackground?.join(", ") || "",
    Specialities: p.provider_profile?.specialities?.join(", ") || "",
    Languages: p.provider_profile?.languages?.join(", ") || "",
    "Treatment Methods": p.provider_profile?.treatmentMethods?.join(", ") || "",
    "Consultation Types":
      p.provider_profile?.consultationTypes?.join(", ") || "",
    "Session Formats": p.provider_profile?.sessionFormats?.join(", ") || "",
    "Age Groups": p.provider_profile?.ageGroups?.join(", ") || "",
    "Provider Type": p.provider_profile?.providerType?.join(", ") || "",
    "Waiting Time": p.provider_profile?.waitingTime || "",
    Latitude: p.provider_profile?.latitude || "",
    Longitude: p.provider_profile?.longitude || "",
    "Business Address": p.provider_profile?.businessAddress || "",
    "Business Coordinates": p.provider_profile?.businessCoordinates || "",
    "Booking URL": p.provider_profile?.bookingUrl || "",
    Description: p.provider_profile?.description || "",
    "Profile Photo": p.provider_profile?.profilePhoto?.url || "",
    "Billing Cycle": p.provider_profile?.billingCycle || "",
    "Price ID": p.provider_profile?.priceId || "",
    "Cancel At Period End": p.provider_profile?.cancelAtPeriodEnd || "",
    "Is Wishlisted": p.provider_profile?.isWishlisted || "",
  }));

  const csv = unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "providers.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
