"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTagsData } from "@/libs/data";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface BlogFiltersProps {
  onSearchChange: (search: string) => void;
  setSearchInput: (search: string) => void;
  searchInput: string;
  onTagsChange: (tags: string[]) => void;
  searchValue: string;
  selectedTags: string[];
  hideSearchBar?: boolean;
}

export function BlogFilters({
  onSearchChange,
  setSearchInput,
  searchInput,
  onTagsChange,
  searchValue,
  selectedTags,
  hideSearchBar = false,
}: BlogFiltersProps) {
  const t = useTranslations();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchInput);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newTags);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    onSearchChange("");
    onTagsChange([]);
  };

  const hasActiveFilters = searchValue || selectedTags.length > 0;

  const tagsData = getTagsData(t);

  return (
    <div className="space-y-6">
      {!hideSearchBar && (
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Input
            type="text"
            placeholder={t("Blog.search-articles-with-dot")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pr-10 pl-10"
          />
          {searchInput && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1 h-8 w-8 p-0"
              onClick={() => {
                setSearchInput("");
                onSearchChange("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>
      )}

      {hasActiveFilters && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              {t("Common.active-filters")}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="h-7 text-xs"
            >
              {t("Common.clear-all")}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {searchValue && (
              <Badge variant="default" className="flex items-center gap-1">
                {t("Common.search")}: &ldquo;{searchValue}&rdquo;
                <div
                  className="cursor-pointer"
                  onClick={() => onSearchChange("")}
                >
                  <X className="h-3 w-3" />
                </div>
              </Badge>
            )}
            {selectedTags.map((tag, index) => {
              const selectedTag = tagsData.find((t) => t.value === tag);
              return (
                <Badge
                  key={`${tag}-${index}`}
                  variant="blog"
                  className="flex items-center gap-1"
                >
                  {selectedTag?.label}
                  <div
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-medium">{t("Common.filter-by-tags")}</h3>
        <ScrollArea className="h-64">
          <div className="grid grid-cols-1 gap-2">
            {tagsData.map((tag, index) => {
              const isSelected = selectedTags.includes(tag.value);
              return (
                <Button
                  key={`tag-${tag}-${index}`}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="h-8 justify-start text-xs"
                  onClick={() => handleTagToggle(tag.value)}
                >
                  {tag.label}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {[
            {
              label: t("Tags.mental-health"),
              value: "mental-health",
            },
            {
              label: t("Tags.wellness"),
              value: "wellness",
            },
            {
              label: t("Tags.anxiety"),
              value: "anxiety",
            },
            {
              label: t("Tags.self-care"),
              value: "self-care",
            },
            {
              label: t("Tags.therapy-tips"),
              value: "therapy-tips",
            },
            {
              label: t("Tags.cultural-identity"),
              value: "cultural-identity",
            },
          ].map((tag, index) => {
            const isSelected = selectedTags.includes(tag.value);
            return (
              <Badge
                key={`tag-${tag}-${index}`}
                variant={isSelected ? "default" : "blog"}
                className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                onClick={() => handleTagToggle(tag.value)}
              >
                {tag.label}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
