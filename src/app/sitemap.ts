import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/utils";

const locales = ["ar", "en", "fr"];

const pages = [
  "",
  "/about",
  "/president",
  "/structure",
  "/events",
  "/news",
  "/publications",
  "/partners",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${page}`])
          ),
        },
      });
    }
  }

  return entries;
}
