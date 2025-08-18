"use client";
import { useRouter } from "@/i18n/routing";
import {
  createArticle,
  updateArticle,
  uploadBannerImage,
} from "@/libs/api/articles.api";
import { getTagsData } from "@/libs/data";
import MDEditor from "@uiw/react-md-editor";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import slugify from "react-slugify";
import { toast } from "sonner";
import { MultiSelect } from "../organisms/multi-select";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ArticleFormData {
  imageId?: string;
  documentId?: string;
  title: string;
  slug: string;
  content: string;
  writtenBy: string;
  bannerImage?: File | null;
  bannerImagePreview?: string | null;
  tags: string[];
}

const CreateEditArticleForm = ({
  articleData,
  isEdit = false,
}: {
  articleData?: ArticleFormData;
  isEdit?: boolean;
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<ArticleFormData>({
    defaultValues: {
      imageId: articleData?.imageId || "",
      documentId: articleData?.documentId || "",
      title: articleData?.title || "",
      slug: articleData?.slug || "",
      content: articleData?.content || "",
      writtenBy: articleData?.writtenBy || "",
      bannerImage: articleData?.bannerImage || null,
      bannerImagePreview: articleData?.bannerImagePreview || null,
      tags: articleData?.tags || [],
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const bannerImagePreview = watch("bannerImagePreview");
  const slug = watch("slug");
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setValue("bannerImage", selectedImage);

      setValue("bannerImagePreview", URL.createObjectURL(selectedImage));
    }
  };

  const onSubmit = async (data: ArticleFormData) => {
    setIsLoading(true);
    try {
      const postSlug = slugify(data.title);
      const submitArticleData = {
        title: data.title,
        slug: postSlug,
        content: data.content,
        writtenBy: data.writtenBy,
        banner: data?.bannerImage || data?.bannerImagePreview,
        tags: data.tags,
      };

      const articleResponse = isEdit
        ? await updateArticle(articleData?.documentId || "", {
            ...submitArticleData,
            banner: data?.bannerImage ? null : articleData?.imageId,
          })
        : await createArticle(submitArticleData);

      const articleDocumentId = articleResponse.data.id;

      if (data.bannerImage) {
        const bannerImageResponse = await uploadBannerImage(
          data.bannerImage,
          articleDocumentId.toString(),
        );
        setValue("bannerImage", null);
      }

      if (isEdit) {
        toast.success(t("Article.article-updated-successfully"), {
          description: t("Article.you-can-now-edit-the-article"),
        });
      } else {
        toast.success(t("Article.article-updated-successfully"), {
          description: t("Article.you-can-now-edit-the-article"),
        });
        router.push(`/admin/dashboard/content-management`);
      }
    } catch (error) {
      if (isEdit) {
        toast.error(t("Article.error-updating-article"));
      } else {
        toast.error(t("Article.error-creating-article"));
      }
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  const t = useTranslations();

  const TAGS_DATA = getTagsData(t);

  return (
    <Card>
      <form key={`article-1`} onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="col-span-2 flex flex-col space-y-1.5 lg:col-span-1">
              <Label htmlFor="title">{t("Common.title")}</Label>
              <Controller
                control={control}
                name="title"
                rules={{
                  validate: (value) => {
                    if (value.length === 0) {
                      return t("Validation.title-is-required");
                    }
                  },
                }}
                render={({ field }) => (
                  <Input
                    id="title"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      setValue("slug", slugify(e.target.value));
                    }}
                  />
                )}
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="col-span-2 flex flex-col space-y-1.5 lg:col-span-1">
              <Label htmlFor="slug">{t("Common.slug")}</Label>
              <Input id="slug" disabled value={slug} />
            </div>
            <div className="col-span-2 flex flex-col space-y-1.5 lg:col-span-1">
              <Label htmlFor="writtenBy">{t("Common.written-by")}</Label>
              <Controller
                control={control}
                name="writtenBy"
                rules={{
                  validate: (value) => {
                    if (value.length === 0) {
                      return t("Validation.written-by-is-required");
                    }
                  },
                }}
                render={({ field }) => (
                  <Input
                    id="writtenBy"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("Common.enter-author-name")}
                  />
                )}
              />
              {errors.writtenBy && (
                <p className="text-red-500">{errors.writtenBy.message}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="bannerImage">{t("Common.banner-image")}</Label>
              <Controller
                control={control}
                name="bannerImage"
                render={({ field: { onChange, ...field } }) => (
                  <Input
                    id="bannerImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                )}
              />
              {errors.bannerImage && (
                <p className="text-red-500">{errors.bannerImage.message}</p>
              )}
            </div>
            {bannerImagePreview && (
              <div className="col-span-2 flex flex-col space-y-1.5 lg:col-span-1">
                <Label htmlFor="bannerImagePreview">
                  {t("Common.preview")}
                </Label>
                <Image
                  src={bannerImagePreview}
                  alt={t("Common.banner-image")}
                  width={250}
                  height={250}
                  className="aspect-video h-auto w-full rounded-md object-cover"
                />
              </div>
            )}

            <div className="col-span-2" data-color-mode="light">
              <Label htmlFor="content" className="mb-4">
                {t("Common.content")}
              </Label>
              <Controller
                control={control}
                name="content"
                rules={{
                  validate: (value) => {
                    if (value.length === 0) {
                      return t("Validation.content-is-required");
                    }
                  },
                }}
                render={({ field }) => (
                  <MDEditor
                    id="content"
                    value={field.value}
                    onChange={field.onChange}
                    preview="edit"
                    height={500}
                  />
                )}
              />
              {errors.content && (
                <p className="text-red-500">{errors.content.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-1.5">
              <Controller
                control={control}
                name="tags"
                rules={{
                  validate: (value) => {
                    if (value.length === 0) {
                      return t("Validation.tags-are-required");
                    }
                  },
                }}
                render={({ field }) => (
                  <MultiSelect
                    options={TAGS_DATA}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={t("Common.tags")}
                  />
                )}
              />
              {errors.tags && (
                <p className="text-red-500">{errors.tags.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-6 flex justify-end gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Creating..."
              : isEdit
                ? t("Article.update-article")
                : t("Article.create-article")}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {t("Common.cancel")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateEditArticleForm;
