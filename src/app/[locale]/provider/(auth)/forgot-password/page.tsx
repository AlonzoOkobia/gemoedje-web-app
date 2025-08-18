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
import { ArrowLeft, Loader2, Mail, MailCheck, Stethoscope } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || "Failed to send reset email");
      }

      setEmailSent(true);
      toast.success(t("Auth.reset-email-sent"), {
        description: t("Auth.reset-email-sent-desc"),
      });
    } catch (error: any) {
      toast.error(t("Auth.reset-email-failed"), {
        description: error.message || t("Auth.reset-email-failed-desc"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
              <MailCheck className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">{t("Auth.email-sent")}</h2>
            <p className="text-muted-foreground text-sm">
              {t("Auth.email-sent-desc")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm">
                {t("Auth.email-sent-to")}{" "}
                <span className="font-medium">{getValues("email")}</span>
              </p>
            </div>
            <div className="text-muted-foreground space-y-2 text-sm">
              <p>{t("Auth.check-email-instructions")}</p>
              <ul className="space-y-1 pl-4">
                <li>• {t("Auth.check-inbox-spam")}</li>
                <li>• {t("Auth.link-expires-24h")}</li>
                <li>• {t("Auth.contact-support-no-email")}</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-3">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/provider/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("Auth.back-to-login")}
              </Link>
            </Button>
            <Button
              variant="link"
              className="text-sm"
              onClick={() => {
                setEmailSent(false);
              }}
            >
              {t("Auth.resend-email")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center px-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
            <Stethoscope className="text-primary h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">
            {t("Auth.forgot-password-title")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t("Auth.forgot-password-desc")}
          </p>
        </CardHeader>
        <CardContent>
          <form
            id="forgot-password-form"
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <Label htmlFor="email">{t("Common.email")}</Label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("Auth.enter-email-placeholder")}
                  className="pl-10"
                  disabled={isLoading}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col space-y-3">
          <Button
            type="submit"
            form="forgot-password-form"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Auth.sending-reset-email")}
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                {t("Auth.send-reset-email")}
              </>
            )}
          </Button>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/provider/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("Auth.back-to-login")}
            </Link>
          </Button>

          <div className="text-muted-foreground text-center text-xs">
            <p>
              {t("Auth.dont-have-account")}{" "}
              <Button variant="link" className="h-auto p-0 text-xs" asChild>
                <Link href="/provider/register">
                  {t("Common.register-as-provider")}
                </Link>
              </Button>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
