"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/libs/utils";
import MDEditor from "@uiw/react-md-editor";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { FAQItem } from "../types/faq.type";

interface FAQItemProps {
  faq: FAQItem;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const FAQItemComponent = ({
  faq,
  isExpanded = false,
  onToggle,
}: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(isExpanded);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const expanded = onToggle ? isExpanded : isOpen;

  return (
    <Card className="border-l-primary/20 border-l-4 transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-0">
        <Button
          variant="ghost"
          onClick={handleToggle}
          className="group h-auto w-full justify-between p-0 text-left hover:bg-transparent"
        >
          <div className="flex-1 py-4 pr-4">
            <h3 className="text-foreground group-hover:text-primary text-lg leading-relaxed font-semibold transition-colors">
              {faq.title}
            </h3>
          </div>
          <div className="ml-4 flex-shrink-0">
            {expanded ? (
              <ChevronDown className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-all duration-200" />
            ) : (
              <ChevronRight className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-all duration-200" />
            )}
          </div>
        </Button>
      </CardHeader>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <CardContent className="pt-0 pb-6">
          <div
            className="text-muted-foreground border-muted border-l-2 pl-4 text-base leading-relaxed whitespace-pre-wrap"
            data-color-mode="light"
          >
            <MDEditor.Markdown
              source={faq.description}
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
