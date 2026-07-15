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
    title: "الجريدة الاقتصادية",
    description: "أخبار المركز، تحليلاته، وشراكاته في قراءة حديثة للمشهد الاقتصادي.",
    viewAll: "تصفح جميع الأخبار",
    read: "اقرأ الخبر",
    empty: "لا توجد أخبار منشورة حاليًا.",
  },
  fr: {
    edition: "Dernières nouvelles",
    title: "Le journal économique",
    description: "Actualités, analyses et partenariats du centre dans une lecture contemporaine de l’économie.",
    viewAll: "Toutes les actualités",
    read: "Lire l’article",
    empty: "Aucune actualité publiée pour le moment.",
  },
  en: {
    edition: "Latest edition",
    title: "The Economic Journal",
    description: "News, analysis, and partnerships from the center in a contemporary view of the economy.",
    viewAll: "Browse all news",
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
    take: 5,
  }).catch(() => []);

  const localized = (item: (typeof items)[number]) => ({
    title: locale === "ar" ? item.titleAr : locale === "fr" ? item.titleFr : item.titleEn,
    excerpt: locale === "ar" ? item.excerptAr : locale === "fr" ? item.excerptFr : item.excerptEn,
  });
  const lead = items[0];
  const secondary = items.slice(1, 3);
  const briefs = items.slice(3, 5);

  return (
    <section className="bg-[#f5f3ed] py-16 text-[#14221d] md:py-24" dir={isRtl ? "rtl" : "ltr"}>
      <div className="container-content">
        <header className="border-y-4 border-double border-[#14221d] py-5 text-center">
          <div className="flex items-center justify-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-primary">
            <span className="h-px w-8 bg-primary/50" />
            <Newspaper className="h-4 w-4" />
            {text.edition}
            <span className="h-px w-8 bg-primary/50" />
          </div>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl md:text-6xl">{text.title}</h2>
          <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-[#14221d]/20 pt-3 text-xs sm:flex-row">
            <p className="max-w-2xl text-muted-foreground">{text.description}</p>
            <Link href="/news" className="group inline-flex shrink-0 items-center gap-2 font-bold text-primary hover:text-primary-dark">
              {text.viewAll}<Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        </header>

        {!lead ? (
          <div className="border-b border-[#14221d]/25 py-16 text-center text-muted-foreground">{text.empty}</div>
        ) : (
          <div className="grid border-b border-[#14221d]/30 lg:grid-cols-12">
            <Link href={`/news/${lead.slug}`} className="group py-7 lg:col-span-7 lg:border-e lg:border-[#14221d]/30 lg:pe-8">
              {lead.coverImage && (
                <div
                  className="aspect-[16/9] w-full overflow-hidden bg-muted bg-cover bg-center grayscale-[12%] transition duration-700 group-hover:grayscale-0"
                  style={{ backgroundImage: `url(${JSON.stringify(lead.coverImage).slice(1, -1)})` }}
                  role="img"
                  aria-label={localized(lead).title}
                />
              )}
              <div className={lead.coverImage ? "mt-5" : "pt-3"}>
                <NewsMeta item={lead} locale={locale} />
                <h3 className="mt-3 text-3xl font-black leading-tight tracking-[-0.025em] transition-colors group-hover:text-primary sm:text-4xl">{localized(lead).title}</h3>
                {localized(lead).excerpt && <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">{localized(lead).excerpt}</p>}
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">{text.read}<Arrow className="h-4 w-4" /></span>
              </div>
            </Link>

            <div className="divide-y divide-[#14221d]/25 lg:col-span-5 lg:ps-8">
              {secondary.map((item) => {
                const article = localized(item);
                return (
                  <Link key={item.id} href={`/news/${item.slug}`} className="group grid gap-4 py-7 sm:grid-cols-[1fr_9rem] lg:grid-cols-1 xl:grid-cols-[1fr_9rem]">
                    <div>
                      <NewsMeta item={item} locale={locale} />
                      <h3 className="mt-3 text-xl font-extrabold leading-7 transition-colors group-hover:text-primary sm:text-2xl">{article.title}</h3>
                      {article.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>}
                    </div>
                    {item.coverImage && (
                      <div className="order-first aspect-[4/3] bg-muted bg-cover bg-center sm:order-last lg:order-first xl:order-last" style={{ backgroundImage: `url(${JSON.stringify(item.coverImage).slice(1, -1)})` }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {briefs.length > 0 && (
          <div className="grid divide-y divide-[#14221d]/25 md:grid-cols-2 md:divide-x md:divide-y-0 rtl:md:divide-x-reverse">
            {briefs.map((item, index) => {
              const article = localized(item);
              return (
                <Link key={item.id} href={`/news/${item.slug}`} className={`group py-6 ${index === 0 ? "md:pe-8" : "md:ps-8"}`}>
                  <NewsMeta item={item} locale={locale} />
                  <h3 className="mt-2 text-xl font-extrabold leading-7 transition-colors group-hover:text-primary">{article.title}</h3>
                  {article.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>}
                </Link>
              );
            })}
          </div>
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
      <span className="text-[#14221d]/25">/</span>
      <time dateTime={date.toISOString()} className="inline-flex items-center gap-1.5 text-muted-foreground">
        <CalendarDays className="h-3.5 w-3.5" />
        {date.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" })}
      </time>
    </p>
  );
}
