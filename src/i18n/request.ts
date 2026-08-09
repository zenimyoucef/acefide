import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !["ar", "en", "fr"].includes(locale)) {
    locale = "ar";
  }

  return {
    locale,
    timeZone: "Africa/Algiers",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
