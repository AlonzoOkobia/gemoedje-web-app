"use client";

import { BlogFilters } from "@/components/organisms/blog/blog-filters";
import { BlogInfiniteScroll } from "@/components/organisms/blog/blog-infinite-scroll";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/routing";
import { Article } from "@/types/strapi";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface BlogContentProps {
  initialArticles: Article[];
  initialPagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  initialSearch: string;
  initialTags: string[];
}

export function BlogContent({
  initialArticles,
  initialPagination,
  initialSearch,
  initialTags,
}: BlogContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const [searchInput, setSearchInput] = useState(initialSearch);
  const params = new URLSearchParams(searchParams);

  const handleSearchChange = (search: string) => {
    params.delete("page");

    if (search.trim() && search.length > 0) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    router.push(`/blog?${params.toString()}`);
  };

  const handleTagsChange = (tags: string[]) => {
    params.delete("page");

    if (tags.length > 0) {
      params.set("tags", tags.join(","));
    } else {
      params.delete("tags");
    }

    router.push(`/blog?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchChange(searchInput);
  };

  return (
    <div className="space-y-6">
      <div className="w-full rounded-lg border bg-white p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Input
            type="text"
            placeholder={t("Blog.search-articles-with-dot")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pr-10 pl-10"
          />
          {searchInput && (
            <button
              type="button"
              className="absolute top-1 right-1 flex h-8 w-8 items-center justify-center rounded-md p-0 hover:bg-gray-100"
              onClick={() => {
                setSearchInput("");
                handleSearchChange("");
              }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-8">
        <aside className="mb-6 w-full lg:mb-0 lg:w-80 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <BlogFilters
              onSearchChange={handleSearchChange}
              setSearchInput={setSearchInput}
              searchInput={searchInput}
              onTagsChange={handleTagsChange}
              searchValue={initialSearch}
              selectedTags={initialTags}
              hideSearchBar={true}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-semibold">
              {initialSearch || initialTags.length > 0
                ? t("Common.search-results")
                : t("Common.latest-articles")}
            </h2>
            <p className="text-muted-foreground">
              {initialPagination.total > 0
                ? t("Common.showing-articles", {
                    start: 1,
                    end: Math.min(
                      initialPagination.pageSize,
                      initialPagination.total,
                    ),
                    total: initialPagination.total,
                  })
                : t("Common.no-articles-found")}
            </p>
          </div>

          <BlogInfiniteScroll
            initialArticles={initialArticles}
            initialPagination={initialPagination}
            search={initialSearch}
            tags={initialTags}
          />
        </div>
      </div>
    </div>
  );
}
