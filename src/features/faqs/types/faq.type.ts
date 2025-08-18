export type FAQCategory = {
  id: number;
  documentId: string;
  label: string;
  value: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
};

export type FAQItem = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  faq_category: FAQCategory;
};

export type TFAQResponseData = {
  data: FAQItem[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type GroupedFAQs = {
  [categoryLabel: string]: FAQItem[];
};
