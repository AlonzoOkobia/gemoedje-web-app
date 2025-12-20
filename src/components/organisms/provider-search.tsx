"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProviderPagination } from "@/components/ui/provider-pagination";
import { ProviderSkeleton } from "@/components/ui/provider-skeleton";
import { Slider } from "@/components/ui/slider";
import { useDebouncedSearch } from "@/hooks/use-debounce";
import { useProviders } from "@/hooks/use-providers";
import { AlertCircle, ChevronsUpDown, MapPin, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FilterSection } from "./filter-section";
import { FilterSummary } from "./filter-summary";

import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FilterState } from "./filter-section";
import { ProviderList } from "./provider-list";

interface SearchState
  extends Omit<FilterState, "location" | "maxWaitingWeeks"> {
  radius: number;
  onlyAvailableNow: boolean;
  page: number;
  pageSize: number;
  isApproved: boolean;
  location: string;
  maxWaitingWeeks: number;
  locationLat: number | null;
  locationLng: number | null;
}

const DEFAULT_LOCATION_TEXT = "Amsterdam, Netherlands";
const DEFAULT_LATITUDE = 52.3676;
const DEFAULT_LONGITUDE = 4.9041;

const DEFAULT_RADIUS_METERS = 10000;
const DEFAULT_RADIUS_KM = DEFAULT_RADIUS_METERS / 1000;

const defaultSearchState: SearchState = {
  providerType: [],
  backgrounds: [],
  ethnicity: [],
  languages: [],
  specialties: [],
  consultationType: [],
  availability: [],
  treatmentMethods: [],
  ageGroups: [],
  sessionFormats: [],
  focusAreas: [],
  insuranceProviders: [],
  location: DEFAULT_LOCATION_TEXT,
  maxWaitingWeeks: 0,
  radius: DEFAULT_RADIUS_METERS,
  onlyAvailableNow: false,
  gender: "any",
  page: 1,
  pageSize: 20,
  isApproved: true,
  locationLat: DEFAULT_LATITUDE,
  locationLng: DEFAULT_LONGITUDE,
  religion: [],
};

interface MapboxSuggestion {
  place_name: string;
  geometry: {
    coordinates: [number, number];
  };
}

function ProviderSearch() {
  const t = useTranslations("ProviderSearch");

  const [searchState, setSearchState] =
    useState<SearchState>(defaultSearchState);
  const [locationError, setLocationError] = useState<string>("");
  const [showFilters, setShowFilters] = useState(true);
  const [expandedSummary, setExpandedSummary] = useState(true);

  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocationText, setSelectedLocationText] = useState<string>(
    defaultSearchState.location,
  );

  const [hasInteractedWithLocationInput, setHasInteractedWithLocationInput] =
    useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [shouldFetchOnOpen, setShouldFetchOnOpen] = useState(false);

  const [displayedRadiusKm, setDisplayedRadiusKm] =
    useState<number>(DEFAULT_RADIUS_KM);

  const {
    immediateValue: searchQuery,
    debouncedValue: debouncedSearchQuery,
    updateSearchTerm: updateSearchQuery,
    isSearching: isSearchingSearchQuery,
  } = useDebouncedSearch("", 500);

  const {
    immediateValue: locationSearchInput,
    debouncedValue: debouncedLocationSearchInput,
    updateSearchTerm: updateLocationSearchInput,
    isSearching: isSearchingLocationInput,
  } = useDebouncedSearch("", 500);

  const {
    immediateValue: waitingTimeInput,
    debouncedValue: debouncedWaitingTime,
    updateSearchTerm: updateWaitingTimeInput,
    isSearching: isSearchingWaitingTime,
  } = useDebouncedSearch("4", 500);

  const geocodeAddress = useCallback(
    async (address: string, isSuggestionFetch: boolean = false) => {
      if (!address) {
        if (!isSuggestionFetch) setLocationError("");
        return { lat: null, lng: null, placeName: "", suggestions: [] };
      }

      setLocationError("");
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            address,
          )}.json?access_token=${
            process.env.NEXT_PUBLIC_MAPBOX_TOKEN
          }&country=nl&limit=${isSuggestionFetch ? 5 : 1}`,
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          if (isSuggestionFetch) {
            return {
              lat: null,
              lng: null,
              placeName: "",
              suggestions: data.features,
            };
          } else {
            const [lng, lat] = data.features[0].geometry.coordinates;
            const placeName = data.features[0].place_name;
            return { lat, lng, placeName, suggestions: [] };
          }
        } else {
          if (!isSuggestionFetch)
            setLocationError(
              "Location not found. Please try a different address.",
            );
          return { lat: null, lng: null, placeName: "", suggestions: [] };
        }
      } catch (error) {
        if (!isSuggestionFetch)
          setLocationError("Failed to resolve location. Please try again.");
        return { lat: null, lng: null, placeName: [], suggestions: [] };
      }
    },
    [],
  );

  useEffect(() => {
    const initializeDefaultLocation = async () => {
      if (
        defaultSearchState.locationLat === null ||
        defaultSearchState.locationLng === null
      ) {
        const { lat, lng, placeName } = await geocodeAddress(
          DEFAULT_LOCATION_TEXT,
          false,
        );
        setSearchState((prev) => ({
          ...prev,
          locationLat: lat,
          locationLng: lng,
          location: placeName || DEFAULT_LOCATION_TEXT,
        }));
        setSelectedLocationText(placeName || DEFAULT_LOCATION_TEXT);
      } else {
        setSelectedLocationText(defaultSearchState.location);
      }
    };
    initializeDefaultLocation();

    setDisplayedRadiusKm(defaultSearchState.radius / 1000);
  }, [geocodeAddress]);

  useEffect(() => {
    const fetchLocationData = async () => {
      if (hasInteractedWithLocationInput && showSuggestions) {
        let searchTerm = debouncedLocationSearchInput.trim();

        if (shouldFetchOnOpen || (!searchTerm && !isUserTyping)) {
          searchTerm = selectedLocationText;
          setShouldFetchOnOpen(false);
        }

        if (searchTerm) {
          const { suggestions: fetchedSuggestions } = await geocodeAddress(
            searchTerm,
            true,
          );

          setSuggestions(fetchedSuggestions);
        } else if (isUserTyping) {
          setSuggestions([]);
        }
      }
    };
    fetchLocationData();
  }, [
    debouncedLocationSearchInput,
    geocodeAddress,
    hasInteractedWithLocationInput,
    isUserTyping,
    shouldFetchOnOpen,
    selectedLocationText,
    showSuggestions,
  ]);

  const apiSearchState = {
    ...searchState,
    page: searchState.page,
    pageSize: searchState.pageSize,
    isApproved: searchState.isApproved,
    searchQuery: debouncedSearchQuery,
    latitude: searchState.locationLat,
    longitude: searchState.locationLng,
    radius: searchState.radius,
    gender: searchState.gender,
    maxWaitingWeeks: Number(debouncedWaitingTime),
    onlyAvailableNow: searchState.onlyAvailableNow,
    providerType: searchState.providerType,
    culturalBackground: searchState.backgrounds,
    languages: searchState.languages,
    specialities: searchState.specialties,
    consultationTypes: searchState.consultationType,
    availability: searchState.availability,
    treatmentMethods: searchState.treatmentMethods,
    ageGroups: searchState.ageGroups,
    sessionFormats: searchState.sessionFormats,
    ethnicity: searchState.ethnicity,
    focusAreas: searchState.focusAreas,
    insuranceProviders: searchState.insuranceProviders,
    location: searchState.location,
    religion: searchState.religion,
  };

  const {
    data: providersResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useProviders(apiSearchState);

  const providers = providersResponse?.data || [];
  const pagination = providersResponse?.meta?.pagination;

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateSearchQuery(e.target.value);
      setSearchState((prev) => ({ ...prev, page: 1 }));
    },
    [updateSearchQuery],
  );

  const handleSuggestionClick = useCallback(
    (suggestion: MapboxSuggestion) => {
      const [lng, lat] = suggestion.geometry.coordinates;
      const placeName = suggestion.place_name;

      setSearchState((prev) => ({
        ...prev,
        locationLat: lat,
        locationLng: lng,
        location: placeName,
        page: 1,
      }));
      setSelectedLocationText(placeName);
      updateLocationSearchInput("");
      setSuggestions([]);
      setShowSuggestions(false);
      setLocationError("");
      setIsUserTyping(false);
      setShouldFetchOnOpen(false);
    },
    [updateLocationSearchInput],
  );

  const handlePopoverOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        // When opening, initialize search input with current selected location
        updateLocationSearchInput(selectedLocationText);
        setIsUserTyping(false);
        setHasInteractedWithLocationInput(true);
        setShouldFetchOnOpen(true);
      } else {
        updateLocationSearchInput("");
        setSuggestions([]);
        setHasInteractedWithLocationInput(false);
        setIsUserTyping(false);
        setShouldFetchOnOpen(false);
      }
      setShowSuggestions(open);
    },
    [selectedLocationText, updateLocationSearchInput],
  );

  const handleWaitingTimeChange = useCallback(
    (value: number) => {
      updateWaitingTimeInput(String(value));
      setSearchState((prev) => ({ ...prev, maxWaitingWeeks: value, page: 1 }));
    },
    [updateWaitingTimeInput],
  );

  const handleRadiusChange = useCallback((valueInMeters: number) => {
    setSearchState((prev) => ({ ...prev, radius: valueInMeters, page: 1 }));
    setDisplayedRadiusKm(valueInMeters / 1000);
  }, []);

  const handleFilterChange = (filters: FilterState) => {
    const newState: SearchState = {
      ...searchState,
      ...filters,
      page: 1,
    };
    setSearchState(newState);
  };

  const handleRemoveFilter = (key: keyof SearchState, value?: string) => {
    const newState: SearchState = { ...searchState, page: 1 };
    if (
      key === "providerType" ||
      key === "backgrounds" ||
      key === "languages" ||
      key === "specialties" ||
      key === "consultationType" ||
      key === "availability" ||
      key === "treatmentMethods" ||
      key === "ageGroups" ||
      key === "sessionFormats" ||
      key === "focusAreas" ||
      key === "insuranceProviders" ||
      key === "ethnicity" ||
      key === "religion"
    ) {
      (newState[key] as string[]) = (newState[key] as string[]).filter(
        (v) => v !== value,
      );
    } else if (key === "gender") {
      newState.gender = "any";
    } else if (key === "location") {
      newState.location = DEFAULT_LOCATION_TEXT;
      newState.locationLat = DEFAULT_LATITUDE;
      newState.locationLng = DEFAULT_LONGITUDE;
      setSelectedLocationText(DEFAULT_LOCATION_TEXT);
      updateLocationSearchInput("");
      setLocationError("");
      setSuggestions([]);
      setShowSuggestions(false);
      setHasInteractedWithLocationInput(false);
      setIsUserTyping(false);
      setShouldFetchOnOpen(false);
    } else if (key === "maxWaitingWeeks") {
      newState.maxWaitingWeeks = 4;
      updateWaitingTimeInput("4");
    } else if (key === "radius") {
      newState.radius = DEFAULT_RADIUS_METERS;
      setDisplayedRadiusKm(DEFAULT_RADIUS_KM);
    } else if (key === "onlyAvailableNow") {
      newState.onlyAvailableNow = false;
    }
    setSearchState(newState);
  };

  const handleClearAllFilters = () => {
    setSearchState(defaultSearchState);
    updateSearchQuery("");
    setSelectedLocationText(DEFAULT_LOCATION_TEXT);
    updateLocationSearchInput("");
    updateWaitingTimeInput("4");
    setLocationError("");
    setSuggestions([]);
    setShowSuggestions(false);
    setHasInteractedWithLocationInput(false);
    setIsUserTyping(false);
    setShouldFetchOnOpen(false);
    setDisplayedRadiusKm(DEFAULT_RADIUS_KM);
  };

  const handlePageChange = (page: number) => {
    setSearchState((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setSearchState((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  const showLoading =
    isLoading ||
    isSearchingSearchQuery ||
    isSearchingLocationInput ||
    isSearchingWaitingTime;

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {`${t("failed-to-load-providers")}: ${error?.message || "Unknown error"}`}
            <button
              onClick={() => refetch()}
              className="ml-2 underline hover:no-underline"
            >
              {t("try-again")}
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const displayedProviderCount =
    !showLoading && pagination?.total !== undefined
      ? pagination.total
      : providers.length;

  return (
    <section id="find-your-therapist" className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                placeholder={t("search-placeholder")}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label>{t("maximum-waiting-time")}</Label>
                <div className="flex items-center space-x-1">
                  <Slider
                    value={[Number(waitingTimeInput)]}
                    onValueChange={([value]) => {
                      handleWaitingTimeChange(value);
                    }}
                    max={24}
                    step={1}
                  />
                  <span className="w-12 text-right">{waitingTimeInput}w</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location-input">{t("location")}</Label>
                  <Popover
                    open={showSuggestions}
                    onOpenChange={handlePopoverOpenChange}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="bg-background group relative w-full justify-between"
                        aria-expanded={showSuggestions}
                      >
                        <MapPin className="text-muted-foreground absolute top-[10px] left-3 h-4 w-4 group-hover:text-white" />
                        <span className="truncate pl-6 text-left">
                          {selectedLocationText || t("location-placeholder")}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] p-0"
                      align="start"
                    >
                      <Command>
                        <CommandInput
                          placeholder={t("location-placeholder")}
                          value={locationSearchInput}
                          onValueChange={(value) => {
                            updateLocationSearchInput(value);
                            setLocationError("");
                            setHasInteractedWithLocationInput(true);
                            setIsUserTyping(true);
                          }}
                          onFocus={() => {
                            setHasInteractedWithLocationInput(true);
                          }}
                        />
                        <CommandList>
                          {isSearchingLocationInput && (
                            <div className="text-muted-foreground py-6 text-center text-sm">
                              {t("searching")}...
                            </div>
                          )}
                          {!isSearchingLocationInput &&
                            suggestions.length === 0 &&
                            locationSearchInput && (
                              <div className="text-muted-foreground py-6 text-center text-sm">
                                No locations found
                              </div>
                            )}
                          {!isSearchingLocationInput &&
                            suggestions.map((s, index) => (
                              <CommandItem
                                key={`suggestion-${s.place_name}-${index}`}
                                value={s.place_name}
                                onSelect={() => {
                                  handleSuggestionClick(s);
                                  setShowSuggestions(false);
                                }}
                                className="group cursor-pointer"
                              >
                                <MapPin className="text-muted-foreground mr-2 h-4 w-4 group-hover:text-white" />
                                <span className="truncate">{s.place_name}</span>
                              </CommandItem>
                            ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {locationError && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{locationError}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="space-y-3">
                  <Label>
                    {t("search-radius")} ({displayedRadiusKm} km)
                  </Label>
                  <Slider
                    value={[searchState.radius]}
                    onValueChange={([value]) => handleRadiusChange(value)}
                    max={100000}
                    step={1000}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(300px,_1fr)]">
          <div className={`lg:block ${showFilters ? "block" : "hidden"}`}>
            <FilterSection
              onFilterChange={handleFilterChange}
              initialFilters={searchState}
            />
          </div>

          <div className="space-y-4">
            <FilterSummary
              filters={searchState}
              onFilterRemove={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
              expanded={expandedSummary}
              onToggleExpand={() => setExpandedSummary(!expandedSummary)}
            />

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {showLoading ? (
                  t("loading")
                ) : (
                  <>
                    {/* UPDATED: Use displayedProviderCount */}
                    {t("provider-found", {
                      count: displayedProviderCount,
                    })}
                    {(isSearchingSearchQuery ||
                      isSearchingLocationInput ||
                      isSearchingWaitingTime) && (
                      <span className="text-muted-foreground ml-2 text-sm">
                        {t("searching")}
                      </span>
                    )}
                  </>
                )}
              </h2>
              {searchState.location && !showLoading && (
                <p className="text-muted-foreground">
                  {`${t("showing-results-near")} ${searchState.location}`}
                </p>
              )}
            </div>

            {showLoading && <ProviderSkeleton count={searchState.pageSize} />}

            {!showLoading && providers?.length > 0 && (
              <>
                <ProviderList providers={providers || []} />

                {pagination && (
                  <ProviderPagination
                    currentPage={pagination.page}
                    totalPages={pagination.pageCount}
                    pageSize={pagination.pageSize}
                    totalCount={pagination.total}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    className="mt-6"
                  />
                )}
              </>
            )}

            {!showLoading && providers.length === 0 && (
              <div className="py-12 text-center">
                <Search className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-medium">
                  {t("no-providers-found")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("try-adjusting-search-filters")}
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="text-primary hover:underline"
                >
                  {t("clear-all-filters")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export { ProviderSearch };
