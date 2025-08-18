export const HCAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ||
  "10000000-ffff-ffff-ffff-000000000001";

export const HCAPTCHA_CONFIG = {
  siteKey: HCAPTCHA_SITE_KEY,
  theme: "light" as const,
  size: "normal" as const,
};
