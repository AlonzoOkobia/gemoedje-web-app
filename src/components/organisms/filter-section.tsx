"use client";
import { MultiSelect } from "@/components/organisms/multi-select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSpecialities } from "@/libs/api/specialities.api";
import {
  backgrounds,
  getAgeGroupsData,
  getConsultationTypesData,
  getFocusAreasData,
  getProviderTypesData,
  getSessionFormatsData,
  getTreatmentMethodsData,
  languages,
  RELIGION_DATA,
} from "@/libs/data";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export interface FilterState {
  providerType: string[];
  backgrounds: string[];
  languages: string[];
  specialties: string[];
  consultationType: string[];
  availability: string[];
  treatmentMethods: string[];
  ageGroups: string[];
  sessionFormats: string[];
  focusAreas: string[];
  insuranceProviders: string[];
  ethnicity: string[];
  location?: any;
  radius?: any;
  maxWaitingWeeks?: any;
  gender?: "male" | "female" | "other" | "any";
  religion: string[];
}

interface FilterSectionProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export function FilterSection({
  onFilterChange,
  initialFilters,
}: FilterSectionProps) {
  const t = useTranslations();
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      providerType: [],
      backgrounds: [],
      languages: [],
      specialties: [],
      consultationType: [],
      availability: [],
      treatmentMethods: [],
      ageGroups: [],
      sessionFormats: [],
      focusAreas: [],
      insuranceProviders: [],
      ethnicity: [],
      gender: "any",
      religion: [],
    },
  );

  const locale = useLocale();

  const { data: specialtiesData, isLoading: isLoadingSpecialties } = useQuery({
    queryKey: ["specialties", locale],
    queryFn: async () => {
      const specialties = await getSpecialities(locale);
      return specialties;
    },
    enabled: !!locale,
  });

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const updateFilter = (key: keyof FilterState, value: string[] | string) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const providerTypesData = getProviderTypesData(t);
  const consultationTypesData = getConsultationTypesData(t);
  const treatmentMethodsData = getTreatmentMethodsData(t);
  const focusAreasData = getFocusAreasData(t);
  const sessionFormatsData = getSessionFormatsData(t);
  const ageGroupsData = getAgeGroupsData(t);
  const flatProviderTypes = Object.values(providerTypesData).flat();

  return (
    <Card>
      <CardContent className="p-6">
        <Accordion
          type="multiple"
          defaultValue={["essential", "expertise", "session", "practical"]}
          className="space-y-4"
        >
          <AccordionItem value="essential" className="border-none">
            <AccordionTrigger className="hover:bg-muted/50 -mx-4 rounded-lg px-4 py-4 transition-colors hover:no-underline">
              <div className="flex items-center gap-2">
                <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent">
                  {t("ProviderSearch.filter-section.essential-information")}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-4">
                <MultiSelect
                  labelClassName="gradient-title-filter"
                  label={t("ProviderSearch.filter-section.provider-type")}
                  options={flatProviderTypes}
                  value={filters.providerType}
                  onChange={(value) => updateFilter("providerType", value)}
                />
                <MultiSelect
                  labelClassName="gradient-title-filter"
                  label={t("ProviderSearch.filter-section.cultural-background")}
                  options={backgrounds.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  value={filters.backgrounds}
                  onChange={(value) => updateFilter("backgrounds", value)}
                />
                <MultiSelect
                  labelClassName="gradient-title-filter"
                  label={t("ProviderSearch.filter-section.languages")}
                  options={languages.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  value={filters.languages}
                  onChange={(value) => updateFilter("languages", value)}
                />
                <div className="space-y-2">
                  <Label className="gradient-title-filter">
                    {t("ProviderSearch.filter-section.gender")}
                  </Label>
                  <Select
                    value={filters.gender}
                    onValueChange={(
                      value: "male" | "female" | "other" | "any",
                    ) => updateFilter("gender", value)}
                  >
                    <SelectTrigger className="bg-background hover:bg-accent hover:text-accent-foreground w-full font-medium">
                      <SelectValue
                        placeholder={t(
                          "ProviderSearch.filter-section.gender-preference",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">
                        {t("ProviderSearch.filter-section.no-preference")}
                      </SelectItem>
                      <SelectItem value="male">
                        {t("ProviderSearch.filter-section.male")}
                      </SelectItem>
                      <SelectItem value="female">
                        {t("ProviderSearch.filter-section.female")}
                      </SelectItem>
                      <SelectItem value="other">
                        {t("ProviderSearch.filter-section.other")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <MultiSelect
                    labelClassName="gradient-title-filter"
                    label={t("ProviderSearch.filter-section.religion")}
                    options={RELIGION_DATA.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                    value={filters.religion || []}
                    onChange={(value) => updateFilter("religion", value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="expertise" className="border-none">
            <AccordionTrigger className="hover:bg-muted/50 -mx-4 rounded-lg px-4 py-4 transition-colors hover:no-underline">
              <div className="flex items-center gap-2">
                <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent">
                  {t(
                    "ProviderSearch.filter-section.expertise-and-specialization",
                  )}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-4">
                <MultiSelect
                  labelClassName="gradient-title-filter"
                  label={t("ProviderSearch.filter-section.specialties")}
                  options={specialtiesData || []}
                  value={filters.specialties}
                  onChange={(value) => updateFilter("specialties", value)}
                />
                <MultiSelect
                  labelClassName="gradient-title-filter"
                  label={t("ProviderSearch.filter-section.treatment-methods")}
                  options={treatmentMethodsData}
                  value={filters.treatmentMethods}
                  onChange={(value) => updateFilter("treatmentMethods", value)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="session" className="border-none">
            <AccordionTrigger className="hover:bg-muted/50 -mx-4 rounded-lg px-4 py-4 transition-colors hover:no-underline">
              <div className="flex items-center gap-2">
                <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent">
                  {t("ProviderSearch.filter-section.session-details")}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-4">
                <MultiSelect
                  labelClassName="gradient-title-filter"
                  label={t("ProviderSearch.filter-section.consultation-type")}
                  options={consultationTypesData}
                  value={filters.consultationType}
                  onChange={(value) => updateFilter("consultationType", value)}
                />
                <MultiSelect
                  labelClassName="gradient-title-filter"
                  label={t("ProviderSearch.filter-section.session-formats")}
                  options={sessionFormatsData}
                  value={filters.sessionFormats}
                  onChange={(value) => updateFilter("sessionFormats", value)}
                />
                <MultiSelect
                  labelClassName="gradient-title-filter"
                  label={t("ProviderSearch.filter-section.age-groups")}
                  options={ageGroupsData}
                  value={filters.ageGroups}
                  onChange={(value) => updateFilter("ageGroups", value)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
