import { CookieConsent } from "@/components/organisms/cookie-consent";
import { Footer } from "@/components/organisms/footer";
import { Navbar } from "@/components/organisms/navbar";
import { Locale } from "@/i18n/routing";
import { constructMetadata } from "@/libs/metadata";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Footer" });

  return constructMetadata({
    page: "TermsOfService",
    title: t("terms-of-service"),
    description: "Terms of Service - Gemoedje.nl",
    locale: locale as Locale,
    path: `/terms-of-service`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <CookieConsent />
      <Footer />
    </>
  );
}
