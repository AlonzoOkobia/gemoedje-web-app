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
  const t = await getTranslations({ locale, namespace: "HowItWorks" });

  return constructMetadata({
    page: "HowItWorks",
    title: t("title"),
    description: t("description"),
    locale: locale as Locale,
    path: `/how-it-works`,
    // canonicalUrl: `/blogs/${slug}`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
