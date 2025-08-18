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
  const t = await getTranslations({ locale, namespace: "Common" });

  return constructMetadata({
    page: "FAQ",
    title: "FAQ - Frequently Asked Questions",
    description:
      "Find answers to common questions about our mental healthcare platform and services. Get help with account setup, therapy sessions, payments, and more.",
    locale: locale as Locale,
    path: `/faq`,
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
