"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { getTagsData } from "@/libs/data";
import { Article } from "@/types/strapi";
import { Calendar, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface BlogCardProps {
  article: Article;
}

function getBannerUrl(article: Article) {
  return article.banner?.url || "";
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

function truncateContent(content: string, maxLength: number = 150): string {
  const plainText = content.replace(/<[^>]*>/g, "");
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + "..."
    : plainText;
}

export function BlogCard({ article }: BlogCardProps) {
  const bannerUrl = getBannerUrl(article);
  const readingTime = getReadingTime(article.content);
  const formattedDate = formatDate(article.createdAt);
  const excerpt = truncateContent(article.content);
  const t = useTranslations();
  const tagsData = getTagsData(t);

  return (
    <Card className="group overflow-hidden pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/blog/${article.slug}`} className="block">
        {bannerUrl && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={bannerUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <CardHeader className="mt-4 pb-3">
          <div className="text-muted-foreground mb-2 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readingTime} min read
            </div>
          </div>

          <h3 className="group-hover:text-primary line-clamp-2 text-lg font-semibold transition-colors">
            {article.title}
          </h3>

          {article.writtenBy && (
            <p className="text-muted-foreground text-sm">
              By {article.writtenBy}
            </p>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-muted-foreground mb-4 line-clamp-3">{excerpt}</p>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag) => {
                const selectedTag = tagsData.find((t) => t.value === tag);
                return (
                  <Badge key={tag} variant="blog" className="text-xs">
                    {selectedTag?.label}
                  </Badge>
                );
              })}
              {article.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{article.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
