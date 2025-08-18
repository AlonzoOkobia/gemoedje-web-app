"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createWishlistRequest } from "@/features/provider-resources/api/wishlist-request";
import { useRouter } from "@/i18n/routing";
import { useUser } from "@/libs/userContext";
import { useMutation } from "@tanstack/react-query";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Command,
  Globe,
  GraduationCap,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function ProviderResourcesPage() {
  const t = useTranslations("Common.resources");
  const [isNotifying, setIsNotifying] = useState(false);

  const { user, refetchUser } = useUser();

  const router = useRouter();

  const { mutate: createWishlistRequestMutation, isPending } = useMutation({
    mutationFn: createWishlistRequest,
  });

  const handleNotifyMe = async () => {
    if (!user?.email || !user?.provider_profile?.documentId) {
      toast.error("Please enter your email address");
      return;
    }

    setIsNotifying(true);
    createWishlistRequestMutation(
      {
        email: user.email,
        documentId: user.provider_profile.documentId,
      },
      {
        onSettled: () => {
          setIsNotifying(false);
        },
        onSuccess: () => {
          setIsNotifying(false);
          toast.success(
            "Thank you for your interest! We will get back to you soon.",
          );
          refetchUser();
        },
        onError: () => {
          setIsNotifying(false);
          toast.error(
            "Failed to create wishlist request or already wishlisted",
          );
        },
      },
    );
  };

  const features = [
    {
      icon: BookOpen,
      title: t("feature-1"),
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: Globe,
      title: t("feature-2"),
      color: "text-green-600 bg-green-50",
    },
    {
      icon: MessageSquare,
      title: t("feature-3"),
      color: "text-purple-600 bg-purple-50",
    },
    {
      icon: GraduationCap,
      title: t("feature-4"),
      color: "text-orange-600 bg-orange-50",
    },
    {
      icon: TrendingUp,
      title: t("feature-5"),
      color: "text-pink-600 bg-pink-50",
    },
    {
      icon: Users,
      title: t("feature-6"),
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      icon: Command,
      title: t("feature-7"),
      color: "text-indigo-600 bg-indigo-50",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="relative">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-orange-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
        </div>

        <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
          <Calendar className="mr-2 h-4 w-4" />
          {t("coming-soon")}
        </Badge>

        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
          {t("description")}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="border-0 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`rounded-lg p-3 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed font-medium text-gray-900">
                    {feature.title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {user?.provider_profile?.isWishlisted ? null : (
        <>
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                {t("launch-timeline")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800">{t("stay-tuned")}</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-semibold text-gray-900">
                {t("get-notified")}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {t("notify-me")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mx-auto flex max-w-md flex-col justify-center gap-3 sm:flex-row">
                <Button
                  onClick={handleNotifyMe}
                  disabled={isNotifying || isPending}
                  className="bg-blue-600 px-6 text-white hover:bg-blue-700"
                >
                  {isNotifying || isPending
                    ? "Subscribing..."
                    : t("get-notified")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Footer message */}
      <div className="border-t border-gray-100 pt-8 text-center">
        <p className="text-sm text-gray-500">
          Thank you for your patience as we build something amazing for you! 🚀
        </p>
      </div>
    </div>
  );
}
