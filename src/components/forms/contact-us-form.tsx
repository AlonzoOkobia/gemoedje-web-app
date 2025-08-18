"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HCAPTCHA_CONFIG } from "@/config/hcaptcha";
import { createSupportMessage } from "@/libs/api/support.api";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

// Schema
const contactSchema = (t: any) =>
  z.object({
    name: z.string().min(1, { message: t("Validation.name-is-required") }),
    email: z.string().email({ message: t("Validation.enter-valid-email") }),
    subject: z.string().min(1, t("Validation.subject-is-required")),
    message: z.string().min(1, t("Validation.message-is-required")),
    hcaptchaToken: z
      .string()
      .min(1, t("Validation.please-complete-the-captcha-verification")),
  });

export function ContactUsForm() {
  const t = useTranslations();

  const formSchema = contactSchema(t);
  type TFormSchema = z.infer<typeof formSchema>;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hcaptchaToken, setHcaptchaToken] = useState("");
  const hcaptchaRef = useRef<HCaptcha>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
  } = useForm<z.infer<typeof formSchema>>({
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

  const onSubmit = async (data: TFormSchema) => {
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

      await createSupportMessage({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });

      toast.success(t("Common.message-sent-success"), {
        description: t("Common.message-sent-success-desc"),
      });

      reset();
      setHcaptchaToken("");
      hcaptchaRef.current?.resetCaptcha();
    } catch (error) {
      toast.error(t("Common.something-went-wrong"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">{t("Common.name")}</Label>
        <Input
          id="name"
          placeholder={t("Common.your-full-name")}
          {...register("name")}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("Common.email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">{t("Common.subject")}</Label>
        <Input
          id="subject"
          placeholder={t("Common.what-would-you-like-to-discuss")}
          {...register("subject")}
          className={errors.subject ? "border-red-500" : ""}
        />
        {errors.subject && (
          <p className="text-sm text-red-500">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t("Common.message")}</Label>
        <Textarea
          id="message"
          placeholder={t("Common.tell-us-more-about-your-inquiry")}
          rows={4}
          {...register("message")}
          className={errors.message ? "border-red-500" : ""}
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message.message}</p>
        )}
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

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !hcaptchaToken}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("Common.sending-message")}{" "}
          </>
        ) : (
          t("Common.send-message")
        )}
      </Button>
    </form>
  );
}
