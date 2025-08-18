"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface FAQSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalResults: number;
  placeholder?: string;
}

export const FAQSearch = ({
  searchQuery,
  onSearchChange,
  totalResults,
  placeholder = "Search FAQs...",
}: FAQSearchProps) => {
  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <Card className="mx-auto mb-8 w-full transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="focus:border-primary/50 h-12 border-2 pr-11 pl-11 text-base transition-colors"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="hover:bg-muted absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 transform rounded-full p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {searchQuery && (
          <p className="text-muted-foreground mt-3 text-center text-sm">
            {totalResults} result{totalResults !== 1 ? "s" : ""} found for
            &quot;{searchQuery}&quot;
          </p>
        )}
      </CardContent>
    </Card>
  );
};
