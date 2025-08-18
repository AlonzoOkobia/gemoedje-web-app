// Strapi API configuration
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export const STRAPI_API_URL = `${STRAPI_URL}/api`;
