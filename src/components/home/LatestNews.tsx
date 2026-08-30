import { ArrowLeft, ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Link } from "@/lib/navigation";

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
    read: "اقرأ الخبر",
    empty: "لا توجد أخبار منشورة حاليًا.",
  },
  fr: {
    edition: "Dernières nouvelles",
    title: "Actualités du centre",
    description: "Actualités, analyses et partenariats du centre dans une lecture contemporaine de l'économie.",
    viewAll: "Voir toutes les actualités",
    read: "Lire l'article",
    empty: "Aucune actualité publiée pour le moment.",
  },
  en: {
    edition: "Latest news",
    title: "Center News",
    description: "News, analysis, and partnerships from the center in a contemporary view of the economy.",
    viewAll: "View all news",
    read: "Read article",
    empty: "No news has been published yet.",
  },
} as const;

const categoryLabels = {
  NEWS: { ar: "أخبار", fr: "Actualité", en: "News" },
  REPORTS: { ar: "تقارير", fr: "Rapport", en: "Reports" },
  STUDIES: { ar: "دراسات", fr: "Étude", en: "Studies" },
  ANALYSIS: { ar: "تحليل", fr: "Analyse", en: "Analysis" },
} as const;

export async function LatestNews({ locale }: LatestNewsProps) {
  const text = copy[locale];
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const items = await prisma.news.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 7,
  }).catch(() => []);

  const localized = (item: (typeof items)[number]) => ({
    title: locale === "ar" ? item.titleAr : locale === "fr" ? item.titleFr : item.titleEn,
    excerpt: locale === "ar" ? item.excerptAr : locale === "fr" ? item.excerptFr : item.excerptEn,
  });
  const lead = items[0];
  const rest = items.slice(1);

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
            <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Empty state */}
        {!lead ? (
          <div className="rounded-2xl border border-border/60 bg-white py-16 text-center text-muted-foreground">
            {text.empty}
          </div>
        ) : (
          <>
            {/* Lead article */}
            <Link
              href={`/news/${lead.slug}`}
              className="group grid gap-6 rounded-2xl border border-border/50 bg-white p-5 shadow-[0_1px_3px_rgba(11,31,51,0.04)] transition-all duration-400 hover:-translate-y-1 hover:border-primary/15 hover:shadow-[0_16px_45px_rgba(11,31,51,0.1)] sm:p-7 lg:grid-cols-[1.2fr_1fr]"
            >
              {lead.coverImage && (
                <div className="flex w-full items-center justify-center overflow-hidden rounded-xl bg-muted p-4 transition-all duration-500 group-hover:bg-muted/80">
                  <img
                    src={lead.coverImage}
                    alt={localized(lead).title}
                    className="max-h-[28rem] w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <NewsMeta item={lead} locale={locale} />
                <h3 className="mt-3 text-2xl font-black leading-tight tracking-[-0.02em] text-[#0b1f33] transition-colors duration-300 group-hover:text-primary sm:text-3xl">
                  {localized(lead).title}
                </h3>
                {localized(lead).excerpt && (
                  <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                    {localized(lead).excerpt}
                  </p>
                )}
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition-all duration-300 group-hover:gap-3">
                  {text.read}
                  <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
              </div>
            </Link>

            {/* Secondary articles */}
            {rest.length > 0 && (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((item) => {
                  const article = localized(item);
                  return (
                    <Link
                      key={item.id}
                      href={`/news/${item.slug}`}
                      className="group flex flex-col rounded-2xl border border-border/50 bg-white p-5 shadow-[0_1px_3px_rgba(11,31,51,0.04)] transition-all duration-400 hover:-translate-y-1 hover:border-primary/15 hover:shadow-[0_12px_35px_rgba(11,31,51,0.08)] sm:p-6"
                    >
                      {item.coverImage && (
                        <div className="mb-4 flex w-full items-center justify-center overflow-hidden rounded-xl bg-muted p-3 transition-all duration-500 group-hover:bg-muted/80">
                          <img
                            src={item.coverImage}
                            alt={article.title}
                            className="max-h-44 w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <NewsMeta item={item} locale={locale} />
                      <h3 className="mt-2.5 text-base font-extrabold leading-6 text-[#0b1f33] transition-colors duration-300 group-hover:text-primary sm:text-lg">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {article.excerpt}
                        </p>
                      )}
                      <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-all duration-300 group-hover:gap-2.5">
                        {text.read}
                        <Arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

type NewsMetaProps = {
  item: Awaited<ReturnType<typeof prisma.news.findMany>>[number];
  locale: Locale;
};

function NewsMeta({ item, locale }: NewsMetaProps) {
  const date = item.publishedAt ?? item.createdAt;
  return (
    <p className="flex flex-wrap items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-primary">
      <span>{categoryLabels[item.category][locale]}</span>
      <span className="text-border">/</span>
      <time dateTime={date.toISOString()} className="inline-flex items-center gap-1.5 text-muted-foreground">
        <CalendarDays className="h-3.5 w-3.5" />
        {date.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" })}
      </time>
    </p>
  );
}
