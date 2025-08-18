import { CookieConsent } from "@/components/organisms/cookie-consent";
import { Footer } from "@/components/organisms/footer";
import { Navbar } from "@/components/organisms/navbar";
import { Locale } from "@/i18n/routing";
import { constructMetadata } from "@/libs/metadata";
import type { Metadata } from "next";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "CookiePolicy",
    title: "🍪 Cookieverklaring – Gemoedje.nl",
    description: "Cookie policy voor Gemoedje.nl",
    locale: locale as Locale,
    path: `/cookie-policy`,
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
