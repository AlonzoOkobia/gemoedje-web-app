"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/libs/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { FAQItem } from "../types/faq.type";
import { FAQItemComponent } from "./faq-item";

interface FAQCategoryProps {
  categoryLabel: string;
  faqs: FAQItem[];
  defaultExpanded?: boolean;
}

export const FAQCategory = ({
  categoryLabel,
  faqs,
  defaultExpanded = true,
}: FAQCategoryProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [expandedFAQs, setExpandedFAQs] = useState<Set<number>>(new Set());

  const handleCategoryToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFAQToggle = (faqId: number) => {
    const newExpandedFAQs = new Set(expandedFAQs);
    if (newExpandedFAQs.has(faqId)) {
      newExpandedFAQs.delete(faqId);
    } else {
      newExpandedFAQs.add(faqId);
    }
    setExpandedFAQs(newExpandedFAQs);
  };

  return (
    <Card className="mb-8 transition-shadow hover:shadow-lg">
      <CardHeader className="pb-4">
        <Button
          variant="ghost"
          onClick={handleCategoryToggle}
          className="group h-auto w-full justify-between p-0 hover:bg-transparent"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-foreground group-hover:text-primary text-2xl font-bold transition-colors">
              {categoryLabel}
            </h2>
            <Badge variant="secondary" className="text-sm">
              {faqs.length} {faqs.length === 1 ? "question" : "questions"}
            </Badge>
          </div>
          <div className="ml-4 flex-shrink-0">
            {isExpanded ? (
              <ChevronUp className="text-muted-foreground group-hover:text-primary h-6 w-6 transition-all duration-200" />
            ) : (
              <ChevronDown className="text-muted-foreground group-hover:text-primary h-6 w-6 transition-all duration-200" />
            )}
          </div>
        </Button>
      </CardHeader>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <CardContent className="space-y-3 pt-0">
          {faqs.map((faq) => (
            <FAQItemComponent
              key={faq.id}
              faq={faq}
              isExpanded={expandedFAQs.has(faq.id)}
              onToggle={() => handleFAQToggle(faq.id)}
            />
          ))}
        </CardContent>
      </div>
    </Card>
  );
};
