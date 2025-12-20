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
import { getAgeGroups } from "@/libs/api/age-group.api";
import { getConsultationTypes } from "@/libs/api/consultation-types.api";
import { getCulturalBackgrounds } from "@/libs/api/cultural-backgrounds.api";
import { getGenders } from "@/libs/api/gender.api";
import { getLanguages } from "@/libs/api/languages.api";
import { getProviderTypes } from "@/libs/api/provider-type.api";
import { getReligions } from "@/libs/api/religion.api";
import { getSessionFormats } from "@/libs/api/session-formats.api";
import { getSpecialities } from "@/libs/api/specialities.api";
import { getTreatmentMethods } from "@/libs/api/treatment-method.api";
import { getFocusAreasData } from "@/libs/data";
import { useGlobalLoader } from "@/providers/global-loader-provider";
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

  const { showLoader, hideLoader } = useGlobalLoader();

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

  // const providerTypesData = getProviderTypesData(t);
  // const consultationTypesData = getConsultationTypesData(t);
  // const treatmentMethodsData = getTreatmentMethodsData(t);
  const focusAreasData = getFocusAreasData(t);
  // const sessionFormatsData = getSessionFormatsData(t);
  // const ageGroupsData = getAgeGroupsData(t);
  // const flatProviderTypes = Object.values(providerTypesData).flat();

  const { data: sessionFormatsData, isLoading: isSessionFormatsLoading } =
    useQuery({
      queryKey: ["sessionFormats", locale],
      queryFn: () => getSessionFormats(locale),
      enabled: !!locale,
    });

  const { data: ageGroupsOptions, isLoading: isAgeGroupsLoading } = useQuery({
    queryKey: ["ageGroups", locale],
    queryFn: () => getAgeGroups(locale),
    enabled: !!locale,
  });

  const { data: treatmentMethodsData, isLoading: isTreatmentMethodsLoading } =
    useQuery({
      queryKey: ["treatmentMethods", locale],
      queryFn: () => getTreatmentMethods(locale),
      enabled: !!locale,
    });

  const { data: consultationTypesData, isLoading: isConsultationTypesLoading } =
    useQuery({
      queryKey: ["consultationTypes", locale],
      queryFn: () => getConsultationTypes(locale),
      enabled: !!locale,
    });

  const {
    data: culturalBackgroundsData,
    isLoading: isCulturalBackgroundsLoading,
  } = useQuery({
    queryKey: ["culturalBackgrounds", locale],
    queryFn: () => getCulturalBackgrounds(locale),
    enabled: !!locale,
  });

  const { data: genderOptionsData, isLoading: isGenderOptionsLoading } =
    useQuery({
      queryKey: ["genderOptions", locale],
      queryFn: () => getGenders(locale),
      enabled: !!locale,
    });

  const { data: providerTypesData, isLoading: isProviderTypesLoading } =
    useQuery({
      queryKey: ["providerTypes", locale],
      queryFn: () => getProviderTypes(locale),
      enabled: !!locale,
    });

  const { data: languageOptionData, isLoading: isLanguageOptionsLoading } =
    useQuery({
      queryKey: ["languageOptions", locale],
      queryFn: () => getLanguages(locale),
      enabled: !!locale,
    });

  const { data: religionOptionData, isLoading: isReligionOptionsLoading } =
    useQuery({
      queryKey: ["religionOptions", locale],
      queryFn: () => getReligions(locale),
      enabled: !!locale,
    });

  useEffect(() => {
    showLoader();
    if (
      !isLoadingSpecialties &&
      !isSessionFormatsLoading &&
      !isAgeGroupsLoading &&
      !isTreatmentMethodsLoading &&
      !isConsultationTypesLoading &&
      !isCulturalBackgroundsLoading &&
      !isGenderOptionsLoading &&
      !isProviderTypesLoading &&
      !isLanguageOptionsLoading &&
      !isReligionOptionsLoading
    ) {
      hideLoader();
    }
  }, [
    isLoadingSpecialties,
    isSessionFormatsLoading,
    isAgeGroupsLoading,
    isTreatmentMethodsLoading,
    isConsultationTypesLoading,
    isCulturalBackgroundsLoading,
    isGenderOptionsLoading,
    isProviderTypesLoading,
    isLanguageOptionsLoading,
    isReligionOptionsLoading,
  ]);

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
                  label={`Select ${t("ProviderSearch.filter-section.provider-type")}`}
                  options={providerTypesData}
                  value={filters.providerType}
                  onChange={(value) => updateFilter("providerType", value)}
                />
                <MultiSelect
                  labelClassName="gradient-title-filter"
                  label={`Select ${t("ProviderSearch.filter-section.cultural-background")}`}
                  options={culturalBackgroundsData}
                  value={filters.backgrounds}
                  onChange={(value) => updateFilter("backgrounds", value)}
                />
                <MultiSelect
                  labelClassName="gradient-title-filter"
                  label={`Select ${t("ProviderSearch.filter-section.languages")}`}
                  options={languageOptionData}
                  value={filters.languages}
                  onChange={(value) => updateFilter("languages", value)}
                />
                <div className="space-y-2">
                  <Label className="gradient-title-filter">
                    {t("ProviderSearch.filter-section.gender")}
                  </Label>
                  <Select
                    value={filters.gender}
                    onValueChange={(value: any) =>
                      updateFilter("gender", value)
                    }
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
                        {t("ProviderSearch.filter-section.gender-preference")}
                      </SelectItem>
                      {genderOptionsData?.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <MultiSelect
                    labelClassName="gradient-title-filter"
                    label={`Select ${t("ProviderSearch.filter-section.religion")}`}
                    options={religionOptionData}
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
                  label={`Select ${t("ProviderSearch.filter-section.specialties")}`}
                  options={specialtiesData || []}
                  value={filters.specialties}
                  onChange={(value) => updateFilter("specialties", value)}
                />
                <MultiSelect
                  labelClassName="gradient-title-filter"
                  label={`${t("ProviderSearch.filter-section.treatment-methods")}`}
                  options={treatmentMethodsData || []}
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
                  label={`Select ${t("ProviderSearch.filter-section.consultation-type")}`}
                  options={consultationTypesData}
                  value={filters.consultationType}
                  onChange={(value) => updateFilter("consultationType", value)}
                />
                <MultiSelect
                  labelClassName="gradient-title-filter"
                  label={`Select ${t("ProviderSearch.filter-section.session-formats")}`}
                  options={sessionFormatsData}
                  value={filters.sessionFormats}
                  onChange={(value) => updateFilter("sessionFormats", value)}
                />
                <MultiSelect
                  labelClassName="gradient-title-filter"
                  label={`Select ${t("ProviderSearch.filter-section.age-groups")}`}
                  options={ageGroupsOptions}
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
