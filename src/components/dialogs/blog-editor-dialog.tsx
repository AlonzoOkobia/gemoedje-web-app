"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import { toast } from "sonner";

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  banner: string;
}

interface BlogEditorDialogProps {
  post?: any;
  onClose: () => void;
  onSave: (post: BlogPost) => Promise<void>;
}

const categories = [
  "Cultural Perspectives",
  "Mental Health Awareness",
  "Language & Therapy",
  "Professional Development",
  "Research & Studies",
  "Community Stories",
];

export function BlogEditorDialog({
  post,
  onClose,
  onSave,
}: BlogEditorDialogProps) {
  const [formData, setFormData] = useState<BlogPost>(
    post || {
      title: "",
      slug: "",
      content: "",
      banner: "",
    },
  );

  const [content, setContent] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData, content: content };
    onSave(data);
    toast.success(post ? "Post Updated" : "Post Created", {
      description: `The article has been ${post ? "updated" : "created"} successfully.`,
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {post ? "Edit Article" : "Create New Article"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="Artice url"
                required
              />
            </div>

            <div className="space-y-2" data-color-mode="light">
              <Label htmlFor="content">Content</Label>
              {/* <MDEditor
                value={content}
                onChange={setContent}
              /> */}
              <MDEditor
                value={content}
                onChange={(value) => setContent(value || "")}
              />
              <MDEditor.Markdown
                source={content}
                style={{ whiteSpace: "pre-wrap" }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {post ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
