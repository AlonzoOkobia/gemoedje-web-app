import { BlogContent } from "@/components/organisms/blog/blog-content";
import { CookieConsent } from "@/components/organisms/cookie-consent";
import { Footer } from "@/components/organisms/footer";
import { Navbar } from "@/components/organisms/navbar";
import { Article } from "@/types/strapi";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  keywords:
    "mental health blog, therapy insights, wellness articles, anxiety help, depression support, self-care tips, mental health resources",
};

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    tags?: string;
  }>;
}

async function fetchBlogPosts(
  page: number = 1,
  search?: string,
  tags?: string,
  pageSize: number = 10,
) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Blog" });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (search) params.append("search", search);
  if (tags) params.append("tags", tags);

  try {
    const response = await fetch(`${baseUrl}/api/blog?${params.toString()}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(t("failed-to-fetch-blog-posts"));
    }

    return await response.json();
  } catch (error) {
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } },
    };
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const locale = await getLocale();
  const t = await getTranslations({ locale });
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const pageSize = parseInt(params.pageSize || "10");
  const search = params.search || "";
  const tags = params.tags || "";

  const blogData = await fetchBlogPosts(page, search, tags, pageSize);
  const articles: Article[] = blogData.data || [];
  const pagination = blogData.meta?.pagination || {
    page: 1,
    pageSize: 10,
    pageCount: 0,
    total: 0,
  };

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen">
        <section className="from-primary/10 via-background to-secondary/10 bg-gradient-to-br px-4 py-16">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-foreground mb-6 text-4xl font-bold break-words md:text-5xl">
              {t("Blog.mental-health-blog")}
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              {t("Blog.hero-desc")}{" "}
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <BlogContent
            initialArticles={articles}
            initialPagination={pagination}
            initialSearch={search}
            initialTags={tags ? tags.split(",") : []}
          />
        </section>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
