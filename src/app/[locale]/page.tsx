"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { CookieConsent } from "@/components/organisms/cookie-consent";
import { Footer } from "@/components/organisms/footer";
import { Navbar } from "@/components/organisms/navbar";
import { ProviderSearch } from "@/components/organisms/provider-search";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (redirect && isSafeRedirect(redirect)) {
      router.replace(redirect);
    }
  }, [redirect, router]);

  const isSafeRedirect = (url: string) =>
    url.startsWith("/") && !url.startsWith("//") && !url.includes("://");

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen">
        <section className="container mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="from-primary to-primary/70 mb-6 bg-gradient-to-r bg-clip-text text-5xl font-bold tracking-tight text-transparent">
            {t("hero-section.title")}
          </h1>
          <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-xl leading-relaxed">
            {t("hero-section.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="h-12 px-8 transition-transform hover:scale-105"
            >
              <Link href="/#find-your-therapist">
                {t("hero-section.button")}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 transition-transform hover:scale-105"
            >
              <Link href="/how-it-works">{t("hero-section.button-2")}</Link>
            </Button>
          </div>
        </section>

        <ProviderSearch />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
