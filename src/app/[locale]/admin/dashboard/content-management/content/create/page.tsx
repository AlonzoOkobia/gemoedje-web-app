"use client";

import CreateEditArticleForm from "@/components/forms/create-edit-article.form";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations();

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">{t("Article.create-article")}</h1>

      <CreateEditArticleForm
        isEdit={false}
        articleData={{
          title: "",
          slug: "",
          content: "",
          writtenBy: "",
          bannerImagePreview: "",
          tags: [],
        }}
      />
    </section>
  );
}
