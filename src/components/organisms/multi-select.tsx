"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TDropdownData } from "@/libs/types";
import { cn } from "@/libs/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

interface MultiSelectProps {
  options: TDropdownData[];
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  labelClassName?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  label,
  labelClassName,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [options, searchQuery]);

  const handleSelect = React.useCallback(
    (option: TDropdownData) => {
      const newValue = value.includes(option.value)
        ? value.filter((item) => item !== option.value)
        : [...value, option.value];
      onChange(newValue);
    },
    [value, onChange],
  );

  return (
    <div className="space-y-2">
      <Label className={cn("text-sm font-medium", labelClassName)}>
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background w-full justify-between"
          >
            <span className="truncate">
              {value.length === 0
                ? `Select ${label.toLowerCase()}...`
                : `${value.length} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="border-b p-2">
            <Input
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8"
            />
          </div>
          <ScrollArea className="h-[200px]">
            <div className="p-2">
              {filteredOptions.length === 0 ? (
                <div className="text-muted-foreground p-2 text-sm">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={`${label.trim()}-${option}-${index}`}
                    className="hover:bg-accent flex cursor-pointer items-center space-x-2 rounded-sm p-2"
                    onClick={() => handleSelect(option)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelect(option);
                      }
                    }}
                  >
                    <div className="flex h-4 w-4 items-center justify-center rounded-sm border">
                      {value.includes(option.value) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    <span className="flex-1 text-sm">{option.label}</span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {value.map((item, index) => {
            const option = options.find((option) => option.value === item);
            return (
              <Badge
                key={`${label.trim()}-${item}-${index}`}
                variant="blog"
                className="cursor-pointer"
                onClick={() => handleSelect(option || { label: "", value: "" })}
              >
                {option?.label}
                <span className="hover:text-destructive ml-1">×</span>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
