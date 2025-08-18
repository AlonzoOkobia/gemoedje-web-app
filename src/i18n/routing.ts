import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { NextRequest } from "next/server";

export const LOCALES = ["en", "nl"];
export const DEFAULT_LOCALE = "nl";
export const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  nl: "Nederlands",
};

export const routing = defineRouting({
  locales: LOCALES,

  defaultLocale: DEFAULT_LOCALE,

  localeDetection: process.env.NEXT_PUBLIC_LOCALE_DETECTION === "true",

  localePrefix: "as-needed",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export type Locale = (typeof routing.locales)[number];

export function extractLocaleFromRewrite(rewriteUrl: string) {
  if (!rewriteUrl) return null;
  const url = new URL(rewriteUrl);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const locales = LOCALES;

  return locales.find((locale) => pathSegments[0] === locale) || null;
}

export function getLocaleFromCookies(request: NextRequest) {
  return request.cookies.get("NEXT_LOCALE")?.value || DEFAULT_LOCALE;
}
