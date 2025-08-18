"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFAQ } from "../hooks/useFaq";
import { FAQCategory } from "./faq-category";
import { FAQSearch } from "./faq-search";

interface FAQListProps {
  searchPlaceholder?: string;
}

export const FAQList = ({
  searchPlaceholder = "Search frequently asked questions...",
}: FAQListProps) => {
  const {
    groupedFAQs,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    filteredFAQs,
  } = useFAQ();

  const t = useTranslations();

  if (isLoading) {
    return (
      <div className="mx-auto w-full">
        <Card className="mb-8">
          <CardContent className="p-6">
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="transition-shadow hover:shadow-lg">
              <CardHeader className="pb-4">
                <Skeleton className="h-8 w-64" />
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {Array.from({ length: 2 }).map((_, faqIndex) => (
                  <Skeleton key={faqIndex} className="h-16 w-full" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("FAQ.failed-to-load-faqs-please-try-again-later")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const hasResults = Object.keys(groupedFAQs).length > 0;

  return (
    <div className="mx-auto w-full">
      <FAQSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalResults={filteredFAQs.length}
        placeholder={searchPlaceholder}
      />

      {!hasResults && searchQuery ? (
        <Card className="py-12 text-center">
          <CardContent className="space-y-4">
            <HelpCircle className="text-muted-foreground mx-auto h-12 w-12" />
            <div>
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                {t("Pagination.no-results-found")}{" "}
              </h3>
              <p className="text-muted-foreground">
                {t(
                  "FAQ.try-adjusting-your-search-terms-or-browse-all-categories",
                )}{" "}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : !hasResults ? (
        <Card className="py-12 text-center">
          <CardContent className="space-y-4">
            <HelpCircle className="text-muted-foreground mx-auto h-12 w-12" />
            <div>
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                {t("FAQ.no-faqs-available")}{" "}
              </h3>
              <p className="text-muted-foreground">
                {t("FAQ.check-back-later-for-frequently-asked-questions")}{" "}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFAQs)
            .sort(([, a], [, b]) => {
              const minOrderA = Math.min(...a.map((faq) => faq.order));
              const minOrderB = Math.min(...b.map((faq) => faq.order));
              return minOrderA - minOrderB;
            })
            .map(([categoryLabel, faqs]) => (
              <FAQCategory
                key={categoryLabel}
                categoryLabel={categoryLabel}
                faqs={faqs}
                defaultExpanded={
                  !searchQuery || Object.keys(groupedFAQs).length <= 2
                }
              />
            ))}
        </div>
      )}
    </div>
  );
};
