import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/utils";

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

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? ("weekly" as const) : ("monthly" as const),
    priority: page === "" ? 1.0 : 0.8,
  }));
}
