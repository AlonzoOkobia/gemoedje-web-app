"use client";

import { BlogCard } from "@/components/organisms/blog/blog-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Article } from "@/types/strapi";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface BlogInfiniteScrollProps {
  initialArticles: Article[];
  initialPagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  search?: string;
  tags?: string[];
  onFiltersChange?: () => void;
}

export function BlogInfiniteScroll({
  initialArticles,
  initialPagination,
  search = "",
  tags = [],
  onFiltersChange,
}: BlogInfiniteScrollProps) {
  const t = useTranslations();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialPagination.page < initialPagination.pageCount,
  );

  useEffect(() => {
    setArticles(initialArticles);
    setPagination(initialPagination);
    setHasMore(initialPagination.page < initialPagination.pageCount);
  }, [initialArticles, initialPagination, search, tags]);

  const fetchMoreArticles = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (pagination.page + 1).toString(),
        pageSize: pagination.pageSize.toString(),
      });

      if (search) params.append("search", search);
      if (tags.length > 0) params.append("tags", tags.join(","));

      const response = await fetch(`/api/blog?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch more articles");
      }

      const data = await response.json();
      const newArticles = data.data || [];
      const newPagination = data.meta?.pagination || pagination;

      setArticles((prevArticles) => [...prevArticles, ...newArticles]);
      setPagination(newPagination);
      setHasMore(newPagination.page < newPagination.pageCount);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, pagination, search, tags]);

  const LoadingComponent = () => (
    <div className="py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EndMessage = () => (
    <div className="py-12 text-center">
      <p className="text-muted-foreground text-lg">
        You&apos;ve reached the end of all articles
      </p>
      <p className="text-muted-foreground mt-2 text-sm">
        {t("Common.showing-articles", {
          start: 1,
          end: articles.length,
          total: articles.length,
        })}
      </p>
    </div>
  );

  if (articles.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4 text-lg">
          {t("Blog.no-articles-found-matching-your-criteria")}
        </p>
        <p className="text-muted-foreground">
          {t("Blog.try-adjusting-filters")}
        </p>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={articles.length}
      next={fetchMoreArticles}
      hasMore={hasMore}
      loader={<LoadingComponent />}
      endMessage={<EndMessage />}
      className="!overflow-visible"
      style={{ overflow: "visible" }}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {articles.map((article, index) => (
          <BlogCard key={`${article.id}-${index}`} article={article} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
