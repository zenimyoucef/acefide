import { Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Link } from "@/lib/navigation";
import { LatestNewsCarousel } from "./LatestNewsCarousel";

type Locale = "ar" | "fr" | "en";

type LatestNewsProps = {
  locale: Locale;
};

const copy = {
  ar: {
    edition: "آخر الأخبار",
    title: "أخبار المركز",
    description: "أخبار المركز، تحليلاته، وشراكاته في قراءة حديثة للمشهد الاقتصادي.",
    viewAll: "عرض جميع الأخبار",
    empty: "لا توجد أخبار منشورة حاليًا.",
  },
  fr: {
    edition: "Dernières nouvelles",
    title: "Actualités du centre",
    description: "Actualités, analyses et partenariats du centre dans une lecture contemporaine de l'économie.",
    viewAll: "Voir toutes les actualités",
    empty: "Aucune actualité publiée pour le moment.",
  },
  en: {
    edition: "Latest news",
    title: "Center News",
    description: "News, analysis, and partnerships from the center in a contemporary view of the economy.",
    viewAll: "View all news",
    empty: "No news has been published yet.",
  },
} as const;

export async function LatestNews({ locale }: LatestNewsProps) {
  const text = copy[locale];
  const isRtl = locale === "ar";

  const items = await prisma.news
    .findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 10,
    })
    .catch(() => []);

  const localized = items.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: locale === "ar" ? item.titleAr : locale === "fr" ? item.titleFr : item.titleEn,
    excerpt: locale === "ar" ? item.excerptAr : locale === "fr" ? item.excerptFr : item.excerptEn,
    coverImage: item.coverImage,
    category: item.category,
    date: (item.publishedAt ?? item.createdAt).toISOString(),
  }));

  return (
    <section className="bg-[#f7f8f4] py-16 md:py-20" dir={isRtl ? "rtl" : "ltr"}>
      <div className="container-content">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <Newspaper className="h-4 w-4" />
              {text.edition}
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0b1f33] md:text-4xl">
              {text.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              {text.description}
            </p>
          </div>
          <Link
            href="/news"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-primary transition-all duration-300 hover:text-primary-dark hover:gap-3"
          >
            {text.viewAll}
            <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">←</span>
          </Link>
        </div>

        {/* Carousel */}
        {localized.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-white py-16 text-center text-muted-foreground">
            {text.empty}
          </div>
        ) : (
          <LatestNewsCarousel items={localized} locale={locale} />
        )}
      </div>
    </section>
  );
}
