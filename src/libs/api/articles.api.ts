import {
  ArticlePost,
  ArticlePostResponse,
  SingleArticlePostResponse,
} from "@/libs/types/blog.type";
import { apiClient } from "../auth";

export const getAllArticles = async (): Promise<ArticlePostResponse> => {
  const response = await apiClient.get("/articles");
  return response.data;
};

export const getArticleById = async (
  id: string,
): Promise<SingleArticlePostResponse> => {
  const response = await apiClient.get(`/articles/${id}`);

  return response.data;
};

export const createArticle = async (article: Partial<ArticlePost>) => {
  const reqData = {
    data: {
      ...article,
    },
  };
  const response = await apiClient.post<SingleArticlePostResponse>(
    "/articles",
    reqData,
  );
  return response.data;
};

export const updateArticle = async (
  id: string,
  article: Partial<ArticlePost>,
) => {
  const reqData = {
    data: {
      ...article,
    },
  };
  const response = await apiClient.put(`/articles/${id}`, reqData);
  return response.data;
};

export const uploadBannerImage = async (
  file: File,
  articleDocumentId: string,
) => {
  try {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("ref", "api::article.article");
    formData.append("refId", articleDocumentId.toString());
    formData.append("field", "banner");
    const response = await apiClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const uploadedImage = response.data[0];
    return uploadedImage;
  } catch (error) {
    throw new Error("Failed to upload banner image");
  }
};
