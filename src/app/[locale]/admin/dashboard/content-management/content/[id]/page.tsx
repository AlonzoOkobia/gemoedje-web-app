import CreateEditArticleForm from "@/components/forms/create-edit-article.form";
import { SingleArticlePostResponse } from "@/libs/types/blog.type";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  const { id: articleId, locale } = await params;
  const isEdit = true;

  let articleData: SingleArticlePostResponse | null = null;

  const articleResponse = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles/${articleId}?populate=*`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!articleResponse.ok) {
    return notFound();
  }

  const t = await getTranslations({ locale });

  articleData = await articleResponse.json();

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold capitalize">
        {t("Article.edit-article")}
      </h1>

      <CreateEditArticleForm
        isEdit={isEdit}
        articleData={{
          imageId: articleData?.data?.banner?.id || "",
          documentId: articleData?.data.documentId || "",
          title: articleData?.data.title || "",
          slug: articleData?.data.slug || "",
          content: articleData?.data.content || "",
          writtenBy: articleData?.data.writtenBy || "",
          bannerImagePreview: articleData?.data?.banner?.url || "",
          tags: articleData?.data.tags || [],
        }}
      />
    </section>
  );
}
