"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Shield,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Reset password form schema
const resetPasswordSchema = (t: any) =>
  z
    .object({
      password: z
        .string()
        .min(8, t("Validation.password-must-be-at-least-8-characters"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t("Validation.password-must-contain-lowercase-uppercase-number"),
        ),
      passwordConfirmation: z
        .string()
        .min(1, t("Validation.password-confirmation-is-required")),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: t("Validation.passwords-do-not-match"),
      path: ["passwordConfirmation"],
    });

type ResetPasswordForm = z.infer<ReturnType<typeof resetPasswordSchema>>;

function ResetPasswordContent() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    passwordConfirmation: false,
  });

  const code = searchParams?.get("code");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema(t)),
  });

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!code) {
      toast.error(t("Common.something-went-wrong"), {
        description: "Invalid or missing reset code",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          password: data.password,
          passwordConfirmation: data.passwordConfirmation,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || "Password reset failed");
      }

      toast.success(t("Common.password-updated"), {
        description: t("Common.your-password-has-been-changed-successfully"),
      });

      setIsSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/provider/login");
      }, 2000);
    } catch (error: any) {
      toast.error("Password Reset Failed", {
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show error if no code is present
  if (!code) {
    return (
      <div className="flex items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-900">
              Invalid Reset Link
            </h2>
            <p className="text-muted-foreground text-sm">
              The password reset link is invalid or has expired.
            </p>
          </CardHeader>
          <CardFooter>
            <Link href="/provider/forgot-password" className="w-full">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Request New Reset Link
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show success state
  if (isSuccess) {
    return (
      <div className="flex items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-900">
              Password Reset Successful!
            </h2>
            <p className="text-muted-foreground text-sm">
              Your password has been successfully updated. You will be
              redirected to the login page shortly.
            </p>
          </CardHeader>
          <CardFooter>
            <Link href="/provider/login" className="w-full">
              <Button className="w-full">Continue to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
            <Lock className="text-primary h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">Reset Your Password</h2>
          <p className="text-muted-foreground text-sm">
            Enter your new password below. Make sure it&apos;s strong and
            secure.
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">
                {t("Common.new-password")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPasswords.password ? "text" : "password"}
                  placeholder="Enter your new password"
                  {...register("password")}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      password: !prev.password,
                    }))
                  }
                  disabled={isSubmitting}
                >
                  {showPasswords.password ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPasswords.password
                      ? t("Common.hide-password")
                      : t("Common.show-password")}
                  </span>
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs">
                    Password requirements:
                  </div>
                  <div className="space-y-1 text-xs">
                    <div
                      className={`flex items-center gap-1 ${password.length >= 8 ? "text-green-600" : "text-red-500"}`}
                    >
                      <div
                        className={`h-1 w-1 rounded-full ${password.length >= 8 ? "bg-green-600" : "bg-red-500"}`}
                      />
                      At least 8 characters
                    </div>
                    <div
                      className={`flex items-center gap-1 ${/[a-z]/.test(password) ? "text-green-600" : "text-red-500"}`}
                    >
                      <div
                        className={`h-1 w-1 rounded-full ${/[a-z]/.test(password) ? "bg-green-600" : "bg-red-500"}`}
                      />
                      One lowercase letter
                    </div>
                    <div
                      className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? "text-green-600" : "text-red-500"}`}
                    >
                      <div
                        className={`h-1 w-1 rounded-full ${/[A-Z]/.test(password) ? "bg-green-600" : "bg-red-500"}`}
                      />
                      One uppercase letter
                    </div>
                    <div
                      className={`flex items-center gap-1 ${/\d/.test(password) ? "text-green-600" : "text-red-500"}`}
                    >
                      <div
                        className={`h-1 w-1 rounded-full ${/\d/.test(password) ? "bg-green-600" : "bg-red-500"}`}
                      />
                      One number
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordConfirmation">
                {t("Common.confirm-new-password")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="passwordConfirmation"
                  type={
                    showPasswords.passwordConfirmation ? "text" : "password"
                  }
                  placeholder="Confirm your new password"
                  {...register("passwordConfirmation")}
                  className={
                    errors.passwordConfirmation
                      ? "border-red-500 pr-10"
                      : "pr-10"
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      passwordConfirmation: !prev.passwordConfirmation,
                    }))
                  }
                  disabled={isSubmitting}
                >
                  {showPasswords.passwordConfirmation ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPasswords.passwordConfirmation
                      ? t("Common.hide-password")
                      : t("Common.show-password")}
                  </span>
                </Button>
              </div>
              {errors.passwordConfirmation && (
                <p className="text-sm text-red-500">
                  {errors.passwordConfirmation.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  {t("Common.update-password")}
                </>
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/provider/login"
                className="text-muted-foreground hover:text-primary text-sm underline-offset-4 hover:underline"
              >
                <ArrowLeft className="mr-1 inline h-3 w-3" />
                Back to Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-4">
          <Card className="mx-auto w-full max-w-md">
            <CardContent className="flex items-center justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin" />
            </CardContent>
          </Card>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
