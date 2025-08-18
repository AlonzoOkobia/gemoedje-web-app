import { FilterState } from "@/components/organisms/filter-section";
import { getAllProviders } from "@/libs/api/strapi";

import { useQuery } from "@tanstack/react-query";

interface UseProvidersFilters extends FilterState {
  searchQuery?: string;
  maxWaitingWeeks?: number;
  location?: string;
  radius?: number;
  latitude: number | null;
  longitude: number | null;
  onlyAvailableNow?: boolean;
  page?: number;
  pageSize?: number;
  isApproved: boolean;
}

export function useProviders(filters: UseProvidersFilters) {
  return useQuery({
    queryKey: ["providers", filters],
    queryFn: () =>
      getAllProviders({
        searchQuery: filters.searchQuery,
        page: filters.page || 1,
        pageSize: filters.pageSize || 10,
        gender: filters.gender,
        maxWaitingWeeks: filters.maxWaitingWeeks,
        onlyAvailableNow: filters.onlyAvailableNow,
        providerType: filters.providerType,
        culturalBackground: filters.backgrounds,
        languages: filters.languages,
        specialities: filters.specialties,
        consultationTypes: filters.consultationType,
        treatmentMethods: filters.treatmentMethods,
        ageGroups: filters.ageGroups,
        sessionFormats: filters.sessionFormats,
        isApproved: true,
        latitude: filters.latitude,
        longitude: filters.longitude,
        radius: filters.radius,
        religion: filters.religion,
      }),

    enabled: true,
    staleTime: 1000 * 60 * 2,
  });
}

export function useProvidersSearch(
  searchFilters: UseProvidersFilters,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["providers-search", searchFilters],
    queryFn: () => getAllProviders(searchFilters),
    enabled: enabled,
    staleTime: 1000 * 30,
  });
}
