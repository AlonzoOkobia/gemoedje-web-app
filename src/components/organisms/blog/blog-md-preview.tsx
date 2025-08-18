"use client";
import MDEditor from "@uiw/react-md-editor";

const BlogMdPreview = ({ source }: { source: string }) => {
  return (
    <div className="prose prose-lg mb-12 max-w-none" data-color-mode="light">
      <MDEditor.Markdown source={source} style={{ whiteSpace: "pre-wrap" }} />
    </div>
  );
};

export default BlogMdPreview;
