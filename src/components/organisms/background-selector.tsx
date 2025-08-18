"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { backgrounds } from "@/libs/data";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useCallback, useState } from "react";

interface BackgroundSelectorProps {
  selectedBackgrounds: string[];
  onBackgroundsChange: (backgrounds: string[]) => void;
}

export function BackgroundSelector({
  selectedBackgrounds = [],
  onBackgroundsChange,
}: BackgroundSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredBackgrounds = backgrounds.filter((background) =>
    background.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const toggleBackground = useCallback(
    (background: string) => {
      onBackgroundsChange(
        selectedBackgrounds.includes(background)
          ? selectedBackgrounds.filter((b) => b !== background)
          : [...selectedBackgrounds, background],
      );
    },
    [selectedBackgrounds, onBackgroundsChange],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[300px] justify-between"
              type="button"
            >
              <span className="truncate">
                {selectedBackgrounds.length === 0
                  ? "Select backgrounds..."
                  : `${selectedBackgrounds.length} selected`}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search backgrounds..."
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList>
                <CommandEmpty>No background found.</CommandEmpty>
                <CommandGroup>
                  {filteredBackgrounds.map((background) => (
                    <CommandItem
                      key={background}
                      value={background}
                      onSelect={() => toggleBackground(background)}
                    >
                      <div className="flex flex-1 items-center">
                        <div className="mr-2 flex h-5 w-5 items-center justify-center rounded border">
                          {selectedBackgrounds.includes(background) && (
                            <Check className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <span>{background}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedBackgrounds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedBackgrounds.map((background) => (
            <Badge
              key={background}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1 text-sm"
            >
              {background}
              <button
                type="button"
                onClick={() => toggleBackground(background)}
                className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
              >
                <X className="text-muted-foreground hover:text-foreground h-3 w-3 transition-colors" />
                <span className="sr-only">Remove {background}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
