import { BlogCard } from "@/components/organisms/blog/blog-card";
import BlogMdPreview from "@/components/organisms/blog/blog-md-preview";
import BlogShareButton from "@/components/organisms/blog/blog-share-button";
import { CookieConsent } from "@/components/organisms/cookie-consent";
import { Footer } from "@/components/organisms/footer";
import { Navbar } from "@/components/organisms/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, Locale } from "@/i18n/routing";
import { getTagsData } from "@/libs/data";
import { constructMetadata } from "@/libs/metadata";
import { Article } from "@/types/strapi";
import "@uiw/react-md-editor/markdown-editor.css";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

interface BlogDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

async function fetchArticleBySlug(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/blog/${slug}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch article");
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

async function fetchRelatedArticles(currentSlug: string, tags?: string[]) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    let url = `${baseUrl}/api/blog?pageSize=3`;
    if (tags && tags.length > 0) {
      url += `&tags=${tags.slice(0, 3).join(",")}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return (
      data.data?.filter((article: Article) => article.slug !== currentSlug) ||
      []
    );
  } catch (error) {
    return [];
  }
}

function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getBannerUrl(article: Article) {
  return article.banner?.url || "";
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const articleData = await fetchArticleBySlug(slug);

  if (!articleData) {
    return {
      title: "Article Not Found | Gemoedje.nl",
      description: "The requested article could not be found.",
    };
  }

  const article: Article = articleData.data;
  const bannerUrl = getBannerUrl(article);
  const excerpt =
    article.content.replace(/<[^>]*>/g, "").substring(0, 160) + "...";

  const metadata = constructMetadata({
    page: "Blog",
    title: article.title,
    description: excerpt,
    locale: locale as Locale,
    path: `/blog/${article.slug}`,
    images: [bannerUrl],
  });

  return {
    ...metadata,
    title: `${article.title} | Gemoedje.nl Blog`,
    description: excerpt,
    keywords: article.tags?.join(", ") || "mental health, therapy, wellness",
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale });
  const articleData = await fetchArticleBySlug(slug);

  if (!articleData) {
    notFound();
  }

  const article: Article = articleData.data;
  const relatedArticles = await fetchRelatedArticles(
    article.slug,
    article.tags,
  );
  const bannerUrl = getBannerUrl(article);
  const readingTime = getReadingTime(article.content);
  const formattedDate = formatDate(article.createdAt);

  const tagsData = getTagsData(t);

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen">
        <article className="container mx-auto max-w-4xl px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="pl-0">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("Blog.backToBlog")}
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            {bannerUrl && (
              <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
                <Image
                  src={bannerUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            )}

            <div className="space-y-4">
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => {
                    const selectedTag = tagsData.find((t) => t.value === tag);
                    return (
                      <Badge key={`${tag}-${index}`} variant="secondary">
                        <Link href={`/blog?tags=${encodeURIComponent(tag)}`}>
                          {selectedTag?.label}
                        </Link>
                      </Badge>
                    );
                  })}
                </div>
              )}

              {/* Title */}
              <h1 className="text-foreground text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
                {article.title}
              </h1>

              {/* Meta Information */}
              <div className="text-muted-foreground flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={article.createdAt}>{formattedDate}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {readingTime} {t("Common.min-read")}
                  </span>
                </div>
                <BlogShareButton article={article} />
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div
            className="prose prose-lg mb-12 max-w-none"
            data-color-mode="light"
          >
            <BlogMdPreview source={article.content} />
          </div>

          <Separator className="my-8" />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold">{t("Common.tags")}</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => {
                  const selectedTag = tagsData.find((t) => t.value === tag);
                  return (
                    <Badge key={`${tag}-${index}`} variant="outline" asChild>
                      <Link href={`/blog?tags=${encodeURIComponent(tag)}`}>
                        {selectedTag?.label}
                      </Link>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-muted/50 py-12">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
                {t("Blog.you-might-also-like")}{" "}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.slice(0, 3).map((relatedArticle: Article) => (
                  <BlogCard key={relatedArticle.id} article={relatedArticle} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button asChild variant="outline">
                  <Link href="/blog">{t("Blog.view-all-articles")}</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
