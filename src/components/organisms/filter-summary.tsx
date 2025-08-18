import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSpecialities } from "@/libs/api/specialities.api";
import { getAgeGroupsData, getProviderTypesData } from "@/libs/data";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { FilterState } from "./filter-section";

interface FilterSummaryProps {
  filters: FilterState;
  onFilterRemove: (key: keyof FilterState, value?: string) => void;
  onClearAll: () => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

export function FilterSummary({
  filters,
  onFilterRemove,
  onClearAll,
  expanded,
  onToggleExpand,
}: FilterSummaryProps) {
  const locale = useLocale();
  const t = useTranslations();

  const activeFilterCount = Object.entries(filters).reduce(
    (count, [key, value]) => {
      if (Array.isArray(value)) {
        return count + value.length;
      }
      if (key === "gender" && value !== "any") {
        return count + 1;
      }
      if (key === "maxWaitingWeeks" && value) {
        return count + 1;
      }
      return count;
    },
    0,
  );

  const { data: specialtiesData, isLoading: isLoadingSpecialties } = useQuery({
    queryKey: ["specialties", locale],
    queryFn: async () => {
      const specialties = await getSpecialities(locale);
      return specialties;
    },
    enabled: !!locale,
  });

  const providerTypesData = Object.values(getProviderTypesData(t)).flat();
  const ageGroupsData = getAgeGroupsData(t);
  if (activeFilterCount === 0) return null;

  const radiusInKm = filters.radius / 1000;

  return (
    <Card className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-4 z-[7] py-0 shadow-lg backdrop-blur">
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{t("Common.active-filters")}</h3>
            <Badge variant="secondary">{activeFilterCount}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              {t("Common.clear-all")}
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggleExpand}>
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="space-y-3">
            {filters.location && (
              <div>
                <span className="text-muted-foreground text-sm">
                  {t("Common.location")}:
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {filters.location}
                    <button
                      className="hover:text-destructive ml-1 cursor-pointer"
                      onClick={() =>
                        onFilterRemove("location", filters.location)
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </div>
              </div>
            )}
            {filters.radius && filters.radius > 0 && (
              <div>
                <span className="text-muted-foreground text-sm">
                  {t("Common.radius")}:
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {radiusInKm < 50 && (
                    <Badge variant="secondary">
                      {t("Common.within", {
                        count: radiusInKm.toFixed(0),
                      })}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {filters.providerType.length > 0 && (
              <div>
                <span className="text-muted-foreground text-sm">
                  {t("Common.provider-type")}:
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {filters.providerType.map((type: any) => {
                    const selectedProviderType = providerTypesData?.find(
                      (item: any) => item.value === type,
                    );
                    return (
                      <Badge
                        key={`provider-type-${type}`}
                        variant="secondary"
                        className="gap-1"
                      >
                        {selectedProviderType?.label || type}
                        <button
                          onClick={() => onFilterRemove("providerType", type)}
                          className="hover:text-destructive ml-1 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {filters.specialties.length > 0 && (
              <div>
                <span className="text-muted-foreground text-sm">
                  {t("Common.specialties")}:
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {filters.specialties.map((specialty: any, index: number) => {
                    const specialtyData = specialtiesData?.find(
                      (item: any) => item.value === specialty,
                    );
                    return (
                      <Badge
                        key={`specialty-${specialty}-${index}`}
                        variant="secondary"
                        className="gap-1"
                      >
                        {specialtyData?.label || specialty}
                        <button
                          onClick={() =>
                            onFilterRemove("specialties", specialty)
                          }
                          className="hover:text-destructive ml-1 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {filters.languages.length > 0 && (
              <div>
                <span className="text-muted-foreground text-sm">
                  {t("Common.languages")}:
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {filters.languages.map((language: any, index: number) => (
                    <Badge
                      key={`language-${language}-${index}`}
                      variant="secondary"
                      className="gap-1"
                    >
                      {language}
                      <button
                        onClick={() => onFilterRemove("languages", language)}
                        className="hover:text-destructive ml-1 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {filters.backgrounds.length > 0 && (
              <div>
                <span className="text-muted-foreground text-sm">
                  {t("Common.cultural-background")}:
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {filters.backgrounds.map((background: any, index: number) => (
                    <Badge
                      key={`background-${background}-${index}`}
                      variant="secondary"
                      className="gap-1"
                    >
                      {background}
                      <button
                        onClick={() =>
                          onFilterRemove("backgrounds", background)
                        }
                        className="hover:text-destructive ml-1 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {filters.gender && filters.gender !== "any" && (
              <div>
                <span className="text-muted-foreground text-sm">
                  {t("Common.gender")}:
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1">
                    {t(`ProviderSearch.filter-section.${filters.gender}`)}
                    <button
                      onClick={() => onFilterRemove("gender", filters.gender)}
                      className="hover:text-destructive ml-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </div>
              </div>
            )}

            {filters.maxWaitingWeeks > 0 && (
              <div>
                <span className="text-muted-foreground text-sm">
                  {t("Common.maximum-waiting-time")}:
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {t("Common.weeks-or-less", {
                      count: filters.maxWaitingWeeks,
                    })}
                  </Badge>
                </div>
              </div>
            )}

            {filters.ageGroups.length > 0 && (
              <div>
                <span className="text-muted-foreground text-sm">
                  {t("Common.age-groups")}:
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {filters.ageGroups.map((ageGroup: any, index: number) => {
                    const selectedAgeGroup = ageGroupsData?.find(
                      (item: any) => item.value === ageGroup,
                    );
                    return (
                      <Badge
                        key={`age-group-${ageGroup}-${index}`}
                        variant="secondary"
                        className="gap-1"
                      >
                        {selectedAgeGroup?.label || ageGroup}
                        <button
                          onClick={() => onFilterRemove("ageGroups", ageGroup)}
                          className="hover:text-destructive ml-1 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {filters.religion.length > 0 && (
              <div>
                <span className="text-muted-foreground text-sm">
                  {t("Common.religion")}:
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {filters.religion.map((religion: any, index: number) => (
                    <Badge
                      key={`religion-${religion}-${index}`}
                      variant="secondary"
                      className="gap-1"
                    >
                      {religion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
