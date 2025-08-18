"use client";
import { Button } from "@/components/ui/button";
import { Article } from "@/types/strapi";
import { Share2 } from "lucide-react";

const BlogShareButton = ({ article }: { article: Article }) => {
  const shareUrl = `https://gemoedje.nl/blog/${article.slug}`;
  const shareText = `Check out this article: ${article.title}`;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        if (navigator.share) {
          navigator.share({
            title: article.title,
            text: shareText,
            url: shareUrl,
          });
        } else {
          navigator.clipboard.writeText(shareUrl);
        }
      }}
    >
      <Share2 className="mr-2 h-4 w-4" />
      Share
    </Button>
  );
};

export default BlogShareButton;
