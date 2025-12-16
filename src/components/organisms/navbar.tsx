"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Link as I18nLink,
  Locale,
  LOCALE_NAMES,
  routing,
  usePathname,
  useRouter,
} from "@/i18n/routing";
import { AuthService } from "@/libs/auth";
import { useUser } from "@/libs/userContext";
import { cn } from "@/libs/utils";
import { useLocaleStore } from "@/stores/localeStore";
import { Globe, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import LocaleSwitcher from "../moleculs/locale-switcher";

const MobileLocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  const { dismissLanguageAlert } = useLocaleStore();
  const [, startTransition] = useTransition();
  const [currentLocale, setCurrentLocale] = useState("locale");

  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale, setCurrentLocale]);

  function onSelectChange(nextLocale: Locale) {
    setCurrentLocale(nextLocale);
    dismissLanguageAlert();

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        { pathname, params: params || {} },
        { locale: nextLocale },
      );
    });
  }

  return (
    <Select
      defaultValue={locale}
      value={currentLocale}
      onValueChange={onSelectChange}
    >
      <SelectTrigger className="h-10 w-fit bg-transparent px-2 hover:cursor-pointer">
        <Globe className="h-5 w-5" />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((cur) => (
          <SelectItem key={cur} value={cur}>
            {LOCALE_NAMES[cur]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const Navbar = () => {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { href: "/", label: t("home"), isActive: pathname === "/" },
    {
      href: "/about-us",
      label: t("about-us"),
      isActive: pathname === "/about-us",
    },
    {
      href: "/contact",
      label: t("contact"),
      isActive: pathname === "/contact",
    },
    { href: "/blog", label: t("blog"), isActive: pathname.startsWith("/blog") },
    { href: "/faq", label: t("faq"), isActive: pathname === "/faq" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await AuthService.logout();
    router.push("/");
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-all duration-300 ease-in-out",
          isScrolled
            ? "bg-white/95 shadow-lg backdrop-blur-md dark:bg-gray-900/95"
            : "bg-white/80 backdrop-blur-sm dark:bg-gray-900/80",
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <I18nLink
                href="/"
                prefetch={false}
                className="group focus:ring-primary/50 -m-1 flex items-center gap-2 rounded-lg p-1 focus:ring-2 focus:outline-none"
              >
                <Image
                  src="/logo.svg"
                  width={6}
                  height={6}
                  alt="SVG"
                  className="text-primary h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-focus:rotate-12"
                />
                <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
                  Gemoedje.nl
                </span>
              </I18nLink>

              <nav className="hidden items-center space-x-1 xl:flex">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    asChild
                    className={cn(
                      "relative rounded-full px-4 py-2",

                      item.isActive &&
                        "bg-primary text-primary-foreground scale-105 shadow-md",
                    )}
                  >
                    <I18nLink href={item.href} prefetch={false}>
                      {item.label}
                      {item.isActive && (
                        <span className="bg-primary-foreground absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full" />
                      )}
                    </I18nLink>
                  </Button>
                ))}
              </nav>
            </div>
            <div className="hidden items-center space-x-2 xl:flex">
              <div className="hidden items-center space-x-4 xl:flex">
                {user?.role?.type === "provider" ? (
                  <>
                    <LocaleSwitcher />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex cursor-pointer items-center gap-2">
                          <span className="text-sm font-medium">
                            {user?.provider_profile?.firstName +
                              " " +
                              user?.provider_profile?.lastName}
                          </span>
                          {user.provider_profile?.profilePhoto?.url && (
                            <img
                              src={user.provider_profile?.profilePhoto?.url}
                              alt={user.provider_profile.firstName}
                              className="h-9 w-9 rounded-full object-cover shadow"
                            />
                          )}
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <I18nLink
                            href="/provider/dashboard/profile"
                            prefetch={false}
                          >
                            Dashboard
                          </I18nLink>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="text-red-600 focus:text-red-700"
                        >
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : user?.role?.type === "admin" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex cursor-pointer items-center gap-2">
                        <span className="text-sm font-medium">Admin</span>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <I18nLink href="/admin/dashboard" prefetch={false}>
                          Dashboard
                        </I18nLink>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600 focus:text-red-700"
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <LocaleSwitcher />
                    {pathname !== "/provider/login" && (
                      <Button
                        variant="ghost"
                        asChild
                        className="focus:ring-primary/50 rounded-full px-4 py-2 hover:scale-105 focus:ring-2 focus:outline-none active:scale-95"
                      >
                        <I18nLink href="/provider/login" prefetch={false}>
                          {t("provider-login")}
                        </I18nLink>
                      </Button>
                    )}
                    {pathname !== "/provider/register" && (
                      <Button
                        variant="default"
                        asChild
                        className="focus:ring-primary/50 rounded-full px-4 py-2 shadow-lg hover:scale-105 focus:ring-2 focus:outline-none active:scale-95"
                      >
                        <I18nLink href="/provider/register" prefetch={false}>
                          {t("provider-register")}
                        </I18nLink>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 xl:hidden">
              <MobileLocaleSwitcher />

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="relative rounded-full transition-all duration-300 xl:hidden"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <div className="relative h-6 w-6">
                  <Menu
                    className={cn(
                      "absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out",
                      isMobileMenuOpen
                        ? "scale-0 rotate-90 opacity-0"
                        : "scale-100 rotate-0 opacity-100",
                    )}
                  />
                  <X
                    className={cn(
                      "absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out",
                      isMobileMenuOpen
                        ? "scale-100 rotate-0 opacity-100"
                        : "scale-0 rotate-90 opacity-0",
                    )}
                  />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 transition-all duration-300 ease-in-out xl:hidden",
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={cn(
            "relative max-h-full overflow-x-hidden overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-gray-900",
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-4",
          )}
        >
          <nav className="space-y-1 px-4 py-6">
            {navItems.map((item, index) => (
              <div
                key={item.href}
                className={cn(
                  "transition-all duration-300 ease-out",
                  isMobileMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-8 opacity-0",
                )}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                }}
              >
                <Button
                  variant={item.isActive ? "default" : "ghost"}
                  asChild
                  className={cn(
                    "h-12 w-full justify-start rounded-xl text-lg transition-all duration-300",
                    "focus:ring-primary/50 hover:scale-105 focus:ring-2 focus:outline-none active:scale-95",
                    item.isActive && "shadow-lg",
                  )}
                >
                  <I18nLink href={item.href} prefetch={false}>
                    {item.label}
                  </I18nLink>
                </Button>
              </div>
            ))}

            <div className="mt-4 space-y-3 border-t pt-4">
              {pathname !== "/provider/login" && (
                <div
                  className={cn(
                    "transition-all duration-300 ease-out",
                    isMobileMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-8 opacity-0",
                  )}
                  style={{
                    transitionDelay: isMobileMenuOpen
                      ? `${navItems.length * 50}ms`
                      : "0ms",
                  }}
                >
                  <Button
                    variant="ghost"
                    asChild
                    className="focus:ring-primary/50 h-12 w-full justify-start rounded-xl text-lg transition-all duration-300 hover:scale-105 focus:ring-2 focus:outline-none active:scale-95"
                  >
                    <I18nLink href="/provider/login" prefetch={false}>
                      {t("provider-login")}
                    </I18nLink>
                  </Button>
                </div>
              )}

              {pathname !== "/provider/register" && (
                <div
                  className={cn(
                    "transition-all duration-300 ease-out",
                    isMobileMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-8 opacity-0",
                  )}
                  style={{
                    transitionDelay: isMobileMenuOpen
                      ? `${(navItems.length + 1) * 50}ms`
                      : "0ms",
                  }}
                >
                  <Button
                    variant="default"
                    asChild
                    className="focus:ring-primary/50 h-12 w-full justify-start rounded-xl text-lg shadow-lg transition-all duration-300 hover:scale-105 focus:ring-2 focus:outline-none active:scale-95"
                  >
                    <I18nLink href="/provider/register" prefetch={false}>
                      {t("provider-register")}
                    </I18nLink>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      <div className="h-16" />
    </>
  );
};

export { Navbar };
