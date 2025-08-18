import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

async function validateToken(
  token: string,
): Promise<{ user: any; isValid: boolean }> {
  try {
    const STRAPI_URL =
      process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";
    const response = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
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

function getTokenFromCookies(request: NextRequest): string | null {
  const token = request.cookies.get("auth-token")?.value || null;
  return token;
}

function getCurrentLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;
  const locales = routing.locales;
  const defaultLocale = routing.defaultLocale;

  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }

  const localeCookie = request.cookies.get("NEXT_LOCALE");
  if (localeCookie && locales.includes(localeCookie.value)) {
    return localeCookie.value;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(",")[0]
      .split("-")[0]
      .toLowerCase();

    if (locales.includes(preferredLocale)) {
      return preferredLocale;
    }
  }

  return defaultLocale;
}

function matchesRoute(
  pathname: string,
  routePattern: string,
  locale: string,
): boolean {
  const defaultLocale = routing.defaultLocale;

  if (locale === defaultLocale) {
    return pathname.startsWith(routePattern);
  }

  return pathname.startsWith(`/${locale}${routePattern}`);
}

function getPathnameWithoutLocale(pathname: string, locale: string): string {
  const defaultLocale = routing.defaultLocale;

  if (locale === defaultLocale) {
    return pathname;
  }

  if (pathname.startsWith(`/${locale}/`)) {
    return pathname.slice(`/${locale}`.length);
  }

  return pathname;
}

function canAccessProvider(user: any): boolean {
  if (!user || !user.role) return false;
  return (
    user.role.type === "provider" ||
    user.role.name?.toLowerCase() === "provider"
  );
}

function canAccessAdmin(user: any): boolean {
  if (!user || !user.role) return false;
  return (
    user.role.type === "admin" ||
    user.role.name?.toLowerCase() === "admin" ||
    user.role.name?.toLowerCase() === "administrator"
  );
}

async function redirectAuthenticatedUsers(
  request: NextRequest,
  locale: string,
) {
  const token = getTokenFromCookies(request);

  if (!token) {
    return null;
  }

  const { user } = await validateToken(token);
  const { pathname } = request.nextUrl;
  const cleanPathname = getPathnameWithoutLocale(pathname, locale);

  const isLoginAdminRoute = cleanPathname.startsWith("/admin/login");
  const isLoginProviderRoute = cleanPathname.startsWith("/provider/login");
  const isRegisterProviderRoute =
    cleanPathname.startsWith("/provider/register");

  if (isLoginAdminRoute && user) {
    const redirectUrl =
      locale === routing.defaultLocale
        ? "/admin/dashboard"
        : `/${locale}/admin/dashboard`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (isLoginProviderRoute && user) {
    const redirectUrl =
      locale === routing.defaultLocale
        ? "/provider/dashboard/profile"
        : `/${locale}/provider/dashboard/profile`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (isRegisterProviderRoute && user) {
    const redirectUrl =
      locale === routing.defaultLocale
        ? "/provider/dashboard/profile"
        : `/${locale}/provider/dashboard/profile`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return null;
}

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const locale = getCurrentLocale(request);

  const i18nResponse = await intlMiddleware(request);

  const { pathname } = request.nextUrl;

  const redirectResponse = await redirectAuthenticatedUsers(request, locale);
  if (redirectResponse) {
    return redirectResponse;
  }

  const isProviderRoute = matchesRoute(pathname, "/provider/dashboard", locale);
  const isAdminRoute = matchesRoute(pathname, "/admin/dashboard", locale);

  const isProtectedRoute = isProviderRoute || isAdminRoute;

  if (!isProtectedRoute) {
    return i18nResponse || NextResponse.next();
  }

  const token = getTokenFromCookies(request);

  if (!token) {
    const redirectUrl = locale === routing.defaultLocale ? "/" : `/${locale}/`;
    const finalRedirectUrl = new URL(redirectUrl, request.url);
    finalRedirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(finalRedirectUrl);
  }

  const { user, isValid } = await validateToken(token);

  if (!isValid || !user) {
    const redirectUrl = locale === routing.defaultLocale ? "/" : `/${locale}/`;
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));
    response.cookies.delete("auth-token");
    return response;
  }

  if (isProviderRoute && !canAccessProvider(user)) {
    const unauthorizedUrl =
      locale === routing.defaultLocale
        ? "/unauthorized"
        : `/${locale}/unauthorized`;
    return NextResponse.redirect(new URL(unauthorizedUrl, request.url));
  }

  if (isAdminRoute && !canAccessAdmin(user)) {
    const unauthorizedUrl =
      locale === routing.defaultLocale
        ? "/unauthorized"
        : `/${locale}/unauthorized`;
    return NextResponse.redirect(new URL(unauthorizedUrl, request.url));
  }

  return i18nResponse || NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*).*)",
    "/(en|nl)/:path*",
    "/((?!api|_next|_vercel|.*\\.|favicon.ico).*)",
  ],
};
