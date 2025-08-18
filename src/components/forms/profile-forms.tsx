"use client";
import { MultiSelect } from "@/components/organisms/multi-select";
import { SpecialtySelector } from "@/components/organisms/speciality-selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSpecialities } from "@/libs/api/specialities.api";
import { AuthService } from "@/libs/auth";
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
  type Profile,
} from "@/libs/data";
import { TDropdownData } from "@/libs/types";
import { useUser } from "@/libs/userContext";
import { SearchBoxCore } from "@mapbox/search-js-core";
import { SearchBox } from "@mapbox/search-js-react";
import { InfoIcon } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import { toast } from "sonner";
import { Slider } from "../ui/slider";

export function ProfileForm() {
  const t = useTranslations();
  const { user, refetchUser } = useUser();
  const [specialitiesData, setSpecialitiesData] = useState<TDropdownData[]>([]);

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<Profile>({
    defaultValues: {
      firstName: user?.provider_profile?.firstName,
      lastName: user?.provider_profile?.lastName,
      email: user?.provider_profile?.email,
      gender: user?.provider_profile?.gender,
      religion: user?.provider_profile?.religion || "Other",
      businessAddress: user?.provider_profile?.businessAddress || "",
      description: user?.provider_profile?.description || "",
      businessName: user?.provider_profile?.businessName || "",
      waitingTime: user?.provider_profile?.waitingTime || 0,
      specialities: user?.provider_profile?.specialities || [],
      languages: user?.provider_profile?.languages || [],
      culturalBackground: user?.provider_profile?.culturalBackground || [],
      treatmentMethods: user?.provider_profile?.treatmentMethods || [],
      sessionFormats: user?.provider_profile?.sessionFormats || [],
      ageGroups: user?.provider_profile?.ageGroups || [],
      bookingUrl:
        user?.provider_profile?.bookingUrl?.replace(
          /^https?:\/\/(www\.)?cal\.com\//,
          "",
        ) || "",
      latitude: user?.provider_profile?.latitude ?? 52.3676,
      longitude: user?.provider_profile?.longitude ?? 4.9041,
      consultationTypes: user?.provider_profile?.consultationTypes || [],
      providerType: user?.provider_profile?.providerType || [],
      focusAreas: user?.provider_profile?.focusAreas || [],
    },
  });

  const businessAddress = useWatch({ control, name: "businessAddress" });
  const latitude = useWatch({ control, name: "latitude" });
  const longitude = useWatch({ control, name: "longitude" });

  const locale = useLocale();

  const getSpecialitiesData = async () => {
    const data = await getSpecialities(locale);
    setSpecialitiesData(data);
  };

  useEffect(() => {
    getSpecialitiesData();
  }, [locale]);

  const [searchBox] = useState(
    () =>
      new SearchBoxCore({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
      }),
  );

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const address = data.features[0].place_name;
          setValue("businessAddress", address);
        } else {
          setValue("businessAddress", "");
        }
      } catch (error) {
        toast.error(t("Form.failed-to-get-address-for-location"));
      }
    },
    [setValue],
  );

  const debouncedReverseGeocode = useCallback(
    (lat: number, lng: number) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        reverseGeocode(lat, lng);
      }, 500);
    },
    [reverseGeocode],
  );

  useEffect(() => {}, [businessAddress, searchBox]);

  const onSubmit = async (data: Profile) => {
    // Check if profile photo exists
    if (!user?.provider_profile?.profilePhoto?.url) {
      toast.error("Profile photo is required");
      return;
    }

    setLoading(true);
    const finalBookingUrl = data.bookingUrl
      ? `https://cal.com/${data.bookingUrl.replace(/^https?:\/\/(www\.)?cal\.com\//, "")}`
      : "";

    const payload = {
      ...data,
      bookingUrl: finalBookingUrl,
    };

    const response = await AuthService.updateProviderProfile(
      user?.provider_profile?.documentId?.toString() || "",
      payload,
    );
    if (response) {
      toast.success(t("Form.profile.profile-updated"));
      await refetchUser();
    } else {
      toast.error(t("Form.profile.failed-to-update-profile"));
    }
    setLoading(false);
  };

  const handleChangeProfilePhoto = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLoading(true);
    const file = e.target.files?.[0];
    if (file) {
      const token = AuthService.getToken();
      const formData = new FormData();
      formData.append("files", file);
      formData.append("ref", "api::provider-profile.provider-profile");
      formData.append("refId", user?.provider_profile?.id.toString() || "");
      formData.append("field", "profilePhoto");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/upload`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "POST",
          body: formData,
        },
      );
      if (response.ok) {
        toast.success(t("Form.profile.profile-photo-updated"));
        await refetchUser();
      } else {
        toast.error(t("Form.profile.failed-to-update-profile-photo"));
      }
    } else {
      toast.error(t("Form.profile.no-file-selected"));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(t("Validation.please-fill-in-all-required-fields"));
    }
  }, [errors]);

  const isPremium = user?.provider_profile?.isPremium;

  const treatmentMethods = getTreatmentMethodsData(t);
  const consultationTypes = getConsultationTypesData(t);
  const sessionFormats = getSessionFormatsData(t);
  const ageGroups = getAgeGroupsData(t);

  const providerTypes = Object.values(getProviderTypesData(t)).flat();
  const focusAreas = getFocusAreasData(t).flat();

  const [viewState, setViewState] = useState({
    latitude: latitude ?? 52.3676,
    longitude: longitude ?? 4.9041,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });

  useEffect(() => {
    if (latitude && longitude) {
      setViewState((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));
    }
  }, [latitude, longitude]);

  const handleScrollHold = () => {
    const container = document.getElementById("custom-scroll-container");
    if (!container) return;

    const scrollStep = () => {
      container.scrollBy({ top: 40 });
    };

    const interval = setInterval(scrollStep, 16);

    const clear = () => {
      clearInterval(interval);
      document.removeEventListener("mouseup", clear);
      document.removeEventListener("mouseleave", clear);
    };

    document.addEventListener("mouseup", clear);
    document.addEventListener("mouseleave", clear);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">{t("Common.profile-settings")}</h2>
          <p className="text-muted-foreground text-sm">
            {t("Common.profile.update-your-provider-profile-information")}{" "}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Profile Photo *</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user?.provider_profile?.profilePhoto?.url}
                  alt={user?.provider_profile?.firstName}
                />
                <AvatarFallback>
                  {user?.provider_profile?.firstName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                type="button"
                onClick={() =>
                  document.getElementById("profile-photo-input")?.click()
                }
                disabled={loading}
              >
                {loading ? t("Common.changing") : t("Common.change-photo")}
              </Button>
              <input
                type="file"
                id="profile-photo-input"
                className="hidden"
                onChange={handleChangeProfilePhoto}
              />
            </div>
            {!user?.provider_profile?.profilePhoto?.url && (
              <p className="text-sm text-red-500">Profile photo is required</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* title */}
            <div className="col-span-2">
              <h1 className="text-2xl font-bold">
                {t("ProviderSearch.filter-section.essential-information")}
              </h1>
              <Separator className="my-2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">{t("Form.first-name")} *</Label>
              <Input
                id="firstName"
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">{t("Form.last-name")} *</Label>
              <Input
                id="lastName"
                {...register("lastName", {
                  required: "Last name is required",
                })}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("Common.email")} *</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="bookingUrl">{t("Common.booking-url")}</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="text-muted-foreground h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent className="w-[300px] p-2">
                      <div className="space-y-2 text-sm">
                        <p>
                          {`Enter the part of your Cal.com link after "cal.com/".`}
                          <br />
                          {`E.g., if your link is "cal.com/john-doe", just enter "john-doe".`}
                        </p>
                        <div className="aspect-video w-full overflow-hidden rounded">
                          <iframe
                            className="h-full w-full"
                            src="https://www.youtube.com/embed/DboZrQjHgWU"
                            title="How to find your Cal.com URL"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="border-input bg-background has-[:focus-visible]:ring-ring flex items-center rounded-md border has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2">
                <span className="text-muted-foreground pl-3">
                  https://cal.com/
                </span>
                <Input
                  id="bookingUrl"
                  type="text"
                  className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...register("bookingUrl", {
                    setValueAs: (value) =>
                      value
                        ? value.replace(/^https?:\/\/(www\.)?cal\.com\//, "")
                        : "",
                  })}
                  defaultValue={
                    user?.provider_profile?.bookingUrl?.replace(
                      /^https?:\/\/(www\.)?cal\.com\//,
                      "",
                    ) || ""
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">{t("Common.gender")} *</Label>
              <Controller
                control={control}
                name="gender"
                rules={{ required: t("Validation.gender-is-required") }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="font-semibold">
                      <SelectValue placeholder={t("Common.select-gender")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t("Common.male")}</SelectItem>
                      <SelectItem value="female">
                        {t("Common.female")}
                      </SelectItem>
                      <SelectItem value="other">{t("Common.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Controller
                control={control}
                name="providerType"
                render={({ field }) => (
                  <MultiSelect
                    label={t("Common.provider-type")}
                    options={providerTypes}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </div>

            {isPremium ? (
              <div className="space-y-2">
                <Label htmlFor="religion">{t("Common.religion")}</Label>
                <Controller
                  control={control}
                  name="religion"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value || ""}
                    >
                      <SelectTrigger className="font-semibold">
                        <SelectValue
                          placeholder={t("Common.select-religion")}
                        />
                      </SelectTrigger>

                      <SelectContent className="relative max-h-[200px] overflow-hidden">
                        <div
                          id="custom-scroll-container"
                          className="max-h-[180px] overflow-y-auto scroll-smooth pr-4"
                        >
                          {RELIGION_DATA.map((religion) => (
                            <SelectItem key={religion} value={religion}>
                              {religion}
                            </SelectItem>
                          ))}
                        </div>

                        <button
                          type="button"
                          onMouseDown={handleScrollHold}
                          className="absolute right-1 bottom-0 z-10 bg-white/80 p-1 text-xs text-gray-500 hover:text-black"
                        >
                          ▼
                        </button>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.religion && (
                  <p className="text-sm text-red-500">
                    {errors.religion.message}
                  </p>
                )}
              </div>
            ) : null}

            {isPremium ? (
              <div className="space-y-2">
                <Label>{t("Common.waiting-time-weeks")}</Label>
                <div className="flex items-center space-x-4">
                  <Controller
                    control={control}
                    name="waitingTime"
                    render={({ field }) => (
                      <>
                        <Slider
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          max={24}
                          step={1}
                          className="flex-1"
                        />
                        <span className="w-12 text-right font-medium">
                          {field.value}w
                        </span>
                      </>
                    )}
                  />
                </div>
                <p className="text-muted-foreground text-sm">
                  {t("Common.current-waiting-time-for-new-clients")}{" "}
                </p>
              </div>
            ) : null}
          </div>

          {isPremium ? (
            <div className="grid grid-cols-1 gap-4 space-y-2 md:grid-cols-2">
              <Controller
                control={control}
                name="languages"
                rules={{
                  required: "At least one language is required",
                  validate: (value) =>
                    value && value.length > 0
                      ? true
                      : "At least one language is required",
                }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <MultiSelect
                      label={`${t("Common.languages")} *`}
                      options={languages.map((item) => ({
                        label: item,
                        value: item,
                      }))}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                    {errors.languages && (
                      <p className="text-sm text-red-500">
                        {errors.languages.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="culturalBackground"
                render={({ field }) => (
                  <MultiSelect
                    label={t("Common.cultural-backgrounds")}
                    options={backgrounds.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="description">
              {t("Common.professional-description")} *
            </Label>
            <Textarea
              id="description"
              {...register("description", {
                required: "Professional description is required",
                minLength: {
                  value: 50,
                  message:
                    "Professional description must be at least 50 characters",
                },
              })}
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold">
                {t("Common.address-details")}
              </h3>

              <Separator className="my-2" />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* business name */}
              <div className="space-y-2">
                <Label htmlFor="businessName">
                  {t("Form.business-name")} *
                </Label>
                <Input
                  id="businessName"
                  type="text"
                  {...register("businessName", {
                    required: "Business name is required",
                  })}
                />
                {errors.businessName && (
                  <p className="text-sm text-red-500">
                    {errors.businessName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Controller
                  control={control}
                  name="businessAddress"
                  rules={{ required: "Business address is required" }}
                  render={({ field: addressField }) => (
                    <Controller
                      control={control}
                      name="latitude"
                      render={({ field: latField }) => (
                        <Controller
                          control={control}
                          name="longitude"
                          render={({ field: lngField }) => (
                            <div className="space-y-2">
                              <Label htmlFor="businessAddress">
                                {t("Form.business-address")} *
                              </Label>
                              {/* @ts-expect-error  unmet type*/}
                              <SearchBox
                                accessToken={
                                  process.env.NEXT_PUBLIC_MAPBOX_TOKEN!
                                }
                                value={addressField.value}
                                onChange={(value: string) =>
                                  addressField.onChange(value)
                                }
                                onRetrieve={(res) => {
                                  const coords =
                                    res.features?.[0]?.geometry?.coordinates;
                                  const place =
                                    res.features?.[0]?.properties
                                      ?.full_address ||
                                    res.features?.[0]?.properties.full_address;

                                  if (coords && place) {
                                    const [lng, lat] = coords;
                                    latField.onChange(lat);
                                    lngField.onChange(lng);
                                    addressField.onChange(place);
                                  }
                                }}
                                options={{
                                  country: "nl",
                                  language: "en",
                                  limit: 5,
                                }}
                                placeholder={t(
                                  "Common.search-for-your-business-location",
                                )}
                              />
                              {errors.businessAddress && (
                                <p className="text-sm text-red-500">
                                  {errors.businessAddress.message}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      )}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <Controller
            control={control}
            name="latitude"
            render={({ field: latField }) => (
              <Controller
                control={control}
                name="longitude"
                render={({ field: lngField }) => (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      {t("Common.business-location")}
                    </Label>

                    <div className="h-72 overflow-hidden rounded-md">
                      <Map
                        {...viewState}
                        onMove={(evt) => setViewState(evt.viewState)}
                        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                        mapStyle="mapbox://styles/mapbox/streets-v11"
                        style={{ width: "100%", height: "100%" }}
                        onClick={(e) => {
                          const { lat, lng } = e.lngLat;
                          latField.onChange(lat);
                          lngField.onChange(lng);
                          setViewState((prev) => ({
                            ...prev,
                            latitude: lat,
                            longitude: lng,
                          }));
                          debouncedReverseGeocode(lat, lng);
                        }}
                      >
                        <Marker
                          latitude={viewState.latitude}
                          longitude={viewState.longitude}
                          draggable
                          onDragEnd={(e) => {
                            const { lat, lng } = e.lngLat;
                            latField.onChange(lat);
                            lngField.onChange(lng);
                            setViewState((prev) => ({
                              ...prev,
                              latitude: lat,
                              longitude: lng,
                            }));
                            debouncedReverseGeocode(lat, lng);
                          }}
                        />
                        <NavigationControl position="top-left" />
                      </Map>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t("Common.latitude")}</Label>
                        <Input
                          type="number"
                          value={viewState.latitude}
                          onChange={(e) => {
                            const newLat = parseFloat(e.target.value);
                            latField.onChange(newLat);
                            if (!isNaN(newLat)) {
                              setViewState((prev) => ({
                                ...prev,
                                latitude: newLat,
                              }));
                              debouncedReverseGeocode(
                                newLat,
                                viewState.longitude,
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("Common.longitude")}</Label>
                        <Input
                          type="number"
                          value={viewState.longitude}
                          onChange={(e) => {
                            const newLng = parseFloat(e.target.value);
                            lngField.onChange(newLng);
                            if (!isNaN(newLng)) {
                              setViewState((prev) => ({
                                ...prev,
                                longitude: newLng,
                              }));
                              debouncedReverseGeocode(
                                viewState.latitude,
                                newLng,
                              );
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              />
            )}
          />

          <section className="space-y-4">
            <div>
              <Label className="text-2xl font-bold">
                {t(
                  "ProviderSearch.filter-section.expertise-and-specialization",
                )}
                *
              </Label>
              <Separator className="my-2" />
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <Controller
                control={control}
                name="specialities"
                rules={{
                  required: "At least one specialty is required",
                  validate: (value) =>
                    value && value.length > 0
                      ? true
                      : "At least one specialty is required",
                }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <SpecialtySelector
                      selectedSpecialties={field.value}
                      onSpecialtiesChange={(value) => field.onChange(value)}
                      specialitiesData={specialitiesData}
                    />
                    {errors.specialities && (
                      <p className="text-sm text-red-500">
                        {errors.specialities.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 space-y-2 md:grid-cols-2">
              {/* Treatment Methods */}
              {isPremium ? (
                <div className="space-y-2">
                  <Controller
                    control={control}
                    name="treatmentMethods"
                    render={({ field }) => (
                      <MultiSelect
                        label={t("Common.treatment-methods")}
                        options={treatmentMethods}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </div>
              ) : null}
            </div>
          </section>

          <section>
            <div>
              <Label className="text-2xl font-bold">
                {t("ProviderSearch.filter-section.session-details")}*
              </Label>
              <Separator className="my-2" />
              <div className="grid grid-cols-1 gap-4 space-y-2 md:grid-cols-2">
                {/* Consultation Types */}
                <div className="space-y-2">
                  <Controller
                    control={control}
                    name="consultationTypes"
                    rules={{
                      required: "At least one consultation type is required",
                      validate: (value) =>
                        value && value.length > 0
                          ? true
                          : "At least one consultation type is required",
                    }}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <MultiSelect
                          label={`${t("Common.consultation-types")} *`}
                          options={consultationTypes}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        />
                        {errors.consultationTypes && (
                          <p className="text-sm text-red-500">
                            {errors.consultationTypes.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Session Formats */}
                {isPremium ? (
                  <div className="space-y-2">
                    <Controller
                      control={control}
                      name="sessionFormats"
                      render={({ field }) => (
                        <MultiSelect
                          label={t("Common.session-formats")}
                          options={sessionFormats}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  </div>
                ) : null}

                {/* Age Groups */}
                {isPremium ? (
                  <div className="space-y-2">
                    <Controller
                      control={control}
                      name="ageGroups"
                      render={({ field }) => (
                        <MultiSelect
                          label={t("Common.age-groups")}
                          options={ageGroups}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("Common.saving") : t("Common.save-changes")}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
