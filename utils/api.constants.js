export const GOOGLEAPIS_DOMAIN = "www.googleapis.com";

export const BASE_URL = `https://${GOOGLEAPIS_DOMAIN}/tasks/v1`;

export const CACHE_TTL = process.env.NODE_ENV === "production" ? 60 : 0;