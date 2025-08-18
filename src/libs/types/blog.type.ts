// lib/types.ts
// export Interface for Image Data

export interface ArticlePost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string; // rich markdown text
  writtenBy: string; // Author name field
  createdAt: string; // ISO date string
  banner: any; // Assuming this is the structure of your featured image
  tags: string[]; // An array of categories associated with the post
}

// Example response structure when fetching posts
export interface ArticlePostResponse {
  data: ArticlePost[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Example response structure when fetching a single post
export interface SingleArticlePostResponse {
  data: ArticlePost; // The single blog post object
}
