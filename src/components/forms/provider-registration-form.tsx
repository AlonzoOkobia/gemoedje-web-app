"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { HCAPTCHA_CONFIG } from "@/config/hcaptcha";
import {
  ApiError,
  completeProviderRegistration,
  extractErrorMessage,
  isEmailConflictError,
} from "@/libs/api/client";
import { RegistrationFormData } from "@/types/strapi";
import { useTranslations } from "next-intl";

const registrationSchema = (t: any) =>
  z.object({
    firstName: z.string().min(1, t("Validation.first-name-is-required")),
    lastName: z.string().min(1, t("Validation.last-name-is-required")),
    businessName: z.string().min(1, t("Validation.business-name-is-required")),
    businessAddress: z
      .string()
      .min(1, t("Validation.business-address-is-required")),
    phoneNo: z
      .string()
      .min(1, t("Validation.phone-number-is-required"))
      .regex(
        /^[\+]?[0-9\s\-\(\)]+$/,
        t("Validation.please-enter-a-valid-phone-number"),
      ),
    kvkNo: z
      .string()
      .min(1, t("Validation.kvk-number-is-required"))
      .regex(/^\d{8}$/, t("Validation.kvk-number-must-be-exactly-8-digits")),
    email: z.string().email(t("Validation.enter-valid-email")),
    password: z
      .string()
      .min(1, t("Validation.password-is-required"))
      .regex(
        /^(?=.*[A-Z])(?=.*\d).{8,}$/,
        t("Validation.password-require-one-upper-one-number"),
      ),
    hcaptchaToken: z
      .string()
      .min(1, t("Validation.please-complete-the-captcha-verification")),
  });

type ExtendedRegistrationFormData = RegistrationFormData & {
  hcaptchaToken: string;
};

export function ProviderRegistrationForm() {
  const t = useTranslations();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [hcaptchaToken, setHcaptchaToken] = useState<string>("");
  const hcaptchaRef = useRef<HCaptcha>(null);

  const formSchema = registrationSchema(t);

  type TFormSchema = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
  } = useForm<ExtendedRegistrationFormData>({
    resolver: zodResolver(formSchema),
  });

  const onHCaptchaChange = (token: string | null) => {
    if (token) {
      setHcaptchaToken(token);
      setValue("hcaptchaToken", token);
    }
  };

  const onHCaptchaExpire = () => {
    setHcaptchaToken("");
    setValue("hcaptchaToken", "");
  };

  const onSubmit = async (data: ExtendedRegistrationFormData) => {
    setIsSubmitting(true);

    try {
      if (!data.hcaptchaToken) {
        setError("hcaptchaToken", {
          type: "manual",
          message: t("Validation.please-complete-the-captcha-verification"),
        });
        setIsSubmitting(false);
        return;
      }

      toast.info(t("Common.creating-account"));

      const { hcaptchaToken: _, ...registrationData } = data;

      await completeProviderRegistration(registrationData);

      toast.success(t("Common.registration-successful"), {
        description: t("Common.registration-success-desc"),
      });

      setRegistrationSuccess(true);
      reset();
      setHcaptchaToken("");
      hcaptchaRef.current?.resetCaptcha();
    } catch (error: any) {
      toast.error(t("Common.registration-failed"), {
        description: error.message,
      });

      hcaptchaRef.current?.resetCaptcha();
      setHcaptchaToken("");
      setValue("hcaptchaToken", "");

      if (error instanceof ApiError && isEmailConflictError(error)) {
        setError("email", {
          type: "manual",
          message: t("Common.this-email-is-already-registered"),
        });
      } else {
        let errorMessage = t(
          "Common.an-unexpected-error-occurred-please-try-again",
        );

        if (error instanceof ApiError) {
          errorMessage = extractErrorMessage(error);

          if (error.step === "user_registration") {
            errorMessage = `${t("Common.account-creation-failed")}: ${errorMessage}`;
          } else if (error.step === "provider_profile_creation") {
            errorMessage = `${t("Common.profile-creation-failed")}: ${errorMessage}`;

            if (error.userCreated) {
              toast.error(t("Error.registration-partially-completed"), {
                description: t("Error.registration-partially-completed-desc", {
                  userId: error.userId || "",
                }),
                duration: 3000,
              });
              return;
            }
          }
        }

        toast.error(t("Common.registration-failed"), {
          description: errorMessage,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">
            {t("Form.registration-successful")}{" "}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-muted-foreground">
            {t("Form.provider-created-successfuly-confirm-email")}{" "}
          </p>
          <p className="text-muted-foreground text-sm">
            {t("Form.registration-verify-credentials")}{" "}
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              setRegistrationSuccess(false);
              setHcaptchaToken("");
              hcaptchaRef.current?.resetCaptcha();
            }}
            variant="outline"
            className="w-full"
          >
            {t("Form.register-another-provider")}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          {t("Form.provider-registration")}{" "}
        </CardTitle>
        <p className="text-muted-foreground text-center">
          {t("Form.join-our-healthcare-network-as-a-verified-provider")}{" "}
        </p>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t("Form.personal-information")}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  {t("Form.first-name")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder={t("Form.enter-your-first-name")}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  {t("Form.last-name")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder={t("Form.enter-your-last-name")}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t("Form.business-information")}
            </h3>

            <div className="space-y-2">
              <Label htmlFor="businessName">
                {t("Form.business-name")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="businessName"
                {...register("businessName")}
                placeholder={t("Form.enter-your-business-practice-name")}
                className={errors.businessName ? "border-red-500" : ""}
              />
              {errors.businessName && (
                <p className="text-sm text-red-500">
                  {errors.businessName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress">
                {t("Form.business-address")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="businessAddress"
                {...register("businessAddress")}
                placeholder={t("Form.enter-your-complete-business-address")}
                className={errors.businessAddress ? "border-red-500" : ""}
                rows={3}
              />
              {errors.businessAddress && (
                <p className="text-sm text-red-500">
                  {errors.businessAddress.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="kvkNo">
                  {t("Form.kvk-number")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="kvkNo"
                  {...register("kvkNo")}
                  placeholder="12345678"
                  maxLength={8}
                  className={errors.kvkNo ? "border-red-500" : ""}
                />
                {errors.kvkNo && (
                  <p className="text-sm text-red-500">{errors.kvkNo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNo">
                  {t("Form.phone-number")}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phoneNo"
                  {...register("phoneNo")}
                  placeholder={t("Form.phone-placeholder")}
                  className={errors.phoneNo ? "border-red-500" : ""}
                />
                {errors.phoneNo && (
                  <p className="text-sm text-red-500">
                    {errors.phoneNo.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t("Form.account-information")}
            </h3>

            <div className="space-y-2">
              <Label htmlFor="email">
                {t("Form.email-address")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="your.email@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {t("Common.password")} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder={t("Form.minimum-6-characters")}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="text-muted-foreground rounded-lg bg-gray-50 p-4 text-sm">
            <p className="mb-2">
              {t("Form.by-registering-terms-service-privacy-policy")}
            </p>
            <p>{t("Form.by-registering-terms-service-privacy-policy-2")} </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-center">
              <HCaptcha
                ref={hcaptchaRef}
                sitekey={HCAPTCHA_CONFIG.siteKey}
                onVerify={onHCaptchaChange}
                onExpire={onHCaptchaExpire}
                theme="light"
              />
            </div>
            {errors.hcaptchaToken && (
              <p className="text-center text-sm text-red-500">
                {errors.hcaptchaToken.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-6">
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !hcaptchaToken}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Form.creating-account")}
              </>
            ) : (
              t("Form.submit-registration")
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
