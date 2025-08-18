import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useMemo, useState } from "react";
import { getAllFaq } from "../api/get-all-faq";
import { FAQItem, GroupedFAQs, TFAQResponseData } from "../types/faq.type";

export const useFAQ = () => {
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery<TFAQResponseData>({
    queryKey: ["faqs", locale],
    queryFn: () => getAllFaq(locale),
  });

  const filteredFAQs = useMemo(() => {
    if (!data?.data || !searchQuery.trim()) {
      return data?.data || [];
    }

    return data.data.filter(
      (faq: FAQItem) =>
        faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.faq_category.label
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );
  }, [data?.data, searchQuery]);

  const groupedFAQs = useMemo((): GroupedFAQs => {
    const faqs = filteredFAQs;
    return faqs.reduce((acc: GroupedFAQs, faq: FAQItem) => {
      const categoryLabel = faq.faq_category.label;
      if (!acc[categoryLabel]) {
        acc[categoryLabel] = [];
      }
      acc[categoryLabel].push(faq);
      return acc;
    }, {});
  }, [filteredFAQs]);

  const sortedGroupedFAQs = useMemo(() => {
    const sorted: GroupedFAQs = {};
    Object.keys(groupedFAQs).forEach((category) => {
      sorted[category] = groupedFAQs[category].sort(
        (a, b) => a.order - b.order,
      );
    });
    return sorted;
  }, [groupedFAQs]);

  return {
    data: data?.data || [],
    groupedFAQs: sortedGroupedFAQs,
    filteredFAQs,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    totalFAQs: data?.meta?.pagination?.total || 0,
  };
};
