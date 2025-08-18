import { SiteConfig } from "@/types/site-config";

export const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://gemoedje.nl";

const TWITTER_URL = "https://x.com";
const EMAIL_URL = "mailto:info@gemoedje.nl";

export const siteConfig: SiteConfig = {
  name: "Gemoedje.nl",
  tagLine: "Vind jouw therapeut",
  description:
    "Gemoedje.nl is een platform voor het vinden van therapeuten. We bieden een breed scala aan therapieën aan, waaronder psychotherapie, psychologie, coaching en nog veel meer.",
  url: BASE_URL,
  authors: [
    {
      name: "Gemoedje.nl",
      url: "https://gemoedje.nl",
    },
  ],
  creator: "Gemoedje.nl",
  socialLinks: {
    twitter: TWITTER_URL,
    email: EMAIL_URL,
  },
  themeColors: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  defaultNextTheme: "system",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};
