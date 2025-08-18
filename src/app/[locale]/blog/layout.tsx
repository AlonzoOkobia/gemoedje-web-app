import { Locale } from "@/i18n/routing";
import { constructMetadata } from "@/libs/metadata";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

// export const metadata: Metadata = {
//   title: {
//     template: "%s | Gemodje.nl Blog",
//     default: "Blog | Gemodje.nl - Mental Health Insights & Resources",
//   },
//   description:
//     "Discover expert insights, tips, and resources on mental health, therapy, and wellness.",
// };

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });

  return constructMetadata({
    page: "Blog",
    title: t("title"),
    description: t("description"),
    locale: locale as Locale,
    path: `/blog`,
  });
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
