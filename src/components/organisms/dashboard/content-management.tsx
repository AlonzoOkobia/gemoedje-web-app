"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProviderPagination } from "@/components/ui/provider-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useArticlesManagement } from "@/hooks/use-articles";
import { useDebouncedSearch } from "@/hooks/use-debounce";
import { Link } from "@/i18n/routing";
import { Article } from "@/types/strapi";
import { Plus, Search, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

function getBannerUrl(article: Article) {
  return article.banner?.url || "";
}

export function ContentManagement() {
  const t = useTranslations();
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | undefined>();
  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(
    null,
  );
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const {
    immediateValue: searchQuery,
    debouncedValue: debouncedSearchQuery,
    updateSearchTerm,
    isSearching,
  } = useDebouncedSearch("", 500);

  const apiFilters = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    ...(debouncedSearchQuery.trim() && {
      searchQuery: debouncedSearchQuery.trim(),
    }),
  };

  const {
    data: articlesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useArticlesManagement(apiFilters);

  const articles = articlesResponse?.data || [];
  const paginationMeta = articlesResponse?.meta?.pagination || {
    page: 1,
    pageSize: 10,
    pageCount: 0,
    total: 0,
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination({ page: 1, pageSize });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateSearchTerm(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const showLoading = isLoading || isSearching;

  const handleDeleteArticle = async (articleId: string) => {
    setDeletingArticleId(articleId);

    try {
      let token: string | null = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("auth-token");
        if (!token) {
          const cookies = document.cookie.split(";");
          const authCookie = cookies.find((cookie) =>
            cookie.trim().startsWith("auth-token="),
          );
          if (authCookie) {
            token = authCookie.split("=")[1];
          }
        }
      }

      const response = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete article");
      }

      toast.success(t("Common.article-deleted-successfully"));
      refetch();
    } catch (error) {
      toast.error(t("Common.failed-to-delete-article"));
    } finally {
      setDeletingArticleId(null);
    }
  };

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="py-8 text-center">
            <div className="text-destructive mb-4">
              {t("Article.failed-to-load-articles")}
              {error?.message || "Unknown error"}
            </div>
            <Button onClick={() => refetch()} variant="outline">
              {t("Common.try-again")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {t("Article.article-management")}
          {paginationMeta.total > 0 && (
            <span className="text-muted-foreground ml-2 text-sm font-normal">
              ({paginationMeta.total} total)
            </span>
          )}
        </CardTitle>
        <Button asChild>
          <Link href="/admin/dashboard/content-management/content/create">
            <Plus className="mr-2 h-4 w-4" />
            {t("Common.new-article")}
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center space-x-2">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder={t("Common.search-by-title-or-slug")}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
          {isSearching && (
            <div className="text-muted-foreground text-sm">Searching...</div>
          )}
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Common.title")}</TableHead>
                <TableHead>{t("Common.slug")}</TableHead>
                <TableHead>{t("Common.written-by")}</TableHead>
                <TableHead>{t("Common.banner")}</TableHead>
                <TableHead className="text-right">
                  {t("Common.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showLoading ? (
                Array.from({ length: pagination.pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="bg-muted h-4 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="bg-muted h-4 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="bg-muted h-4 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="bg-muted h-12 w-16 animate-pulse rounded" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="bg-muted ml-auto h-8 w-16 animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : articles.length > 0 ? (
                articles.map((article) => (
                  <TableRow key={article?.id}>
                    <TableCell>{article?.title}</TableCell>
                    <TableCell>{article?.slug}</TableCell>
                    <TableCell>
                      {article?.writtenBy || "Not specified"}
                    </TableCell>
                    <TableCell>
                      {getBannerUrl(article) ? (
                        <img
                          src={getBannerUrl(article)}
                          alt={article.title}
                          className="max-h-12"
                        />
                      ) : (
                        t("Common.no-banner")
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/admin/dashboard/content-management/content/${article.documentId}`}
                          >
                            {t("Common.edit")}
                          </Link>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              disabled={
                                deletingArticleId === article.documentId
                              }
                            >
                              {deletingArticleId === article.documentId ? (
                                <>
                                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  {t("Common.deleting-article")}
                                </>
                              ) : (
                                <>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {t("Common.delete")}
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t("Common.delete-article")}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t(
                                  "Common.are-you-sure-you-want-to-delete-this-article",
                                )}
                                <br />
                                <strong>&quot;{article.title}&quot;</strong>
                                <br />
                                <br />
                                {t(
                                  "Common.this-action-cannot-be-undone-the-article-will-be-permanently-deleted",
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("Common.cancel")}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteArticle(article.documentId)
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {t("Common.delete-permanently")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground py-8 text-center"
                  >
                    {debouncedSearchQuery
                      ? t("Common.no-articles-found-matching-your-search")
                      : t("Common.no-articles-found")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!showLoading && (
          <ProviderPagination
            currentPage={paginationMeta.page}
            totalPages={paginationMeta.pageCount}
            pageSize={paginationMeta.pageSize}
            totalCount={paginationMeta.total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            className="mt-6"
          />
        )}
      </CardContent>
    </Card>
  );
}
