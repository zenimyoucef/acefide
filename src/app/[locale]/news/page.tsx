import { CalendarDays, Newspaper, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getActivities, localized } from "@/lib/activities";
import { Link } from "@/lib/navigation";

type NewsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
};

type JournalItem = {
  id: string;
  href: string;
  title: string;
  excerpt: string | null;
  date: Date;
  coverImage: string | null;
  category: string;
};

const copy = {
  ar: {
    masthead: "الجريدة الاقتصادية",
    subtitle: "أخبار وتحليلات المركز الجزائري للاستشراف الاقتصادي",
    search: "ابحث عن خبر بالعنوان...",
    submit: "بحث",
    latest: "العدد الأخير",
    read: "متابعة القراءة",
    empty: "لا توجد أخبار مطابقة لبحثك.",
    clear: "عرض جميع الأخبار",
  },
  fr: {
    masthead: "Le Journal Économique",
    subtitle: "Actualités et analyses du Centre algérien de prospective économique",
    search: "Rechercher une actualité par titre...",
    submit: "Rechercher",
    latest: "Dernière édition",
    read: "Lire la suite",
    empty: "Aucune actualité ne correspond à votre recherche.",
    clear: "Voir toutes les actualités",
  },
  en: {
    masthead: "The Economic Journal",
    subtitle: "News and analysis from the Algerian Center for Economic Foresight",
    search: "Search news by title...",
    submit: "Search",
    latest: "Latest edition",
    read: "Continue reading",
    empty: "No news matches your search.",
    clear: "View all news",
  },
} as const;

export default async function NewsPage({ params, searchParams }: NewsPageProps) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "ar" || localeParam === "fr" ? localeParam : "en") as keyof typeof copy;
  const queryValue = (await searchParams).q;
  const query = (Array.isArray(queryValue) ? queryValue[0] : queryValue || "").trim();
  const text = copy[locale];

  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 100,
  }).catch(() => []);

  let items: JournalItem[] = news.map((item) => ({
    id: item.id,
    href: `/news/${item.slug}`,
    title: locale === "ar" ? item.titleAr : locale === "fr" ? item.titleFr : item.titleEn,
    excerpt: locale === "ar" ? item.excerptAr : locale === "fr" ? item.excerptFr : item.excerptEn,
    date: item.publishedAt ?? item.createdAt,
    coverImage: item.coverImage,
    category: item.category,
  }));

  if (!items.length) {
    items = (await getActivities()).map((activity) => {
      const article = localized(activity, locale);
      return {
        id: activity.id,
        href: `/events/${activity.slug}`,
        title: article.title,
        excerpt: article.description,
        date: activity.date,
        coverImage: activity.coverImage,
        category: "NEWS",
      };
    });
  }

  if (query) {
    const normalizedQuery = query.toLocaleLowerCase(locale);
    items = items.filter((item) => item.title.toLocaleLowerCase(locale).includes(normalizedQuery));
  }

  const lead = items[0];
  const remaining = items.slice(1);

  return (
    <main className="min-h-screen bg-[#f5f2e9] text-[#17211d]" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="container-content py-10 md:py-14">
        <header className="border-y-4 border-double border-[#17211d] py-5 text-center">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-primary">ACEFIDE · {text.latest}</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] sm:text-6xl lg:text-7xl">{text.masthead}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">{text.subtitle}</p>
          <p className="mt-4 border-t border-[#17211d]/30 pt-3 text-xs font-semibold">
            {new Date().toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </header>

        <form action={`/${locale}/news`} className="mx-auto my-7 flex max-w-2xl overflow-hidden rounded-full border border-[#17211d]/30 bg-white shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
          <label htmlFor="news-search" className="sr-only">{text.search}</label>
          <Search className="ms-5 h-5 w-5 shrink-0 self-center text-primary" />
          <input
            id="news-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder={text.search}
            className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm outline-none"
          />
          <button type="submit" className="m-1 rounded-full bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary-dark">{text.submit}</button>
        </form>

        {!lead ? (
          <section className="border-y border-[#17211d]/30 py-20 text-center">
            <p className="text-lg font-bold">{text.empty}</p>
            {query && <Link href="/news" className="mt-4 inline-block text-sm font-bold text-primary hover:underline">{text.clear}</Link>}
          </section>
        ) : (
          <>
            <Link href={lead.href} className="group grid gap-7 border-y border-[#17211d]/40 py-7 lg:grid-cols-12">
              <ArticleCover item={lead} number={1} featured />
              <article className="flex flex-col justify-center border-s-4 border-primary ps-6 lg:col-span-5">
                <span className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-primary">{lead.category}</span>
                <JournalDate date={lead.date} locale={locale} />
                <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] transition-colors group-hover:text-primary sm:text-5xl">{lead.title}</h2>
                {lead.excerpt && <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">{lead.excerpt}</p>}
                <span className="mt-6 text-sm font-black text-primary">{text.read} ←</span>
              </article>
            </Link>

            {remaining.length > 0 && (
              <section className="grid border-b border-[#17211d]/40 md:grid-cols-2 lg:grid-cols-3">
                {remaining.map((item, index) => (
                  <Link
                    href={item.href}
                    key={item.id}
                    className={`group py-7 md:px-6 ${index % 3 !== 2 ? "lg:border-e lg:border-[#17211d]/30" : ""} ${index >= 3 ? "border-t border-[#17211d]/30" : ""}`}
                  >
                    <ArticleCover item={item} number={index + 2} />
                    <span className="mt-5 block text-[0.65rem] font-black uppercase tracking-[0.18em] text-primary">{item.category}</span>
                    <JournalDate date={item.date} locale={locale} />
                    <h2 className="mt-3 text-2xl font-black leading-8 transition-colors group-hover:text-primary">{item.title}</h2>
                    {item.excerpt && <p className="mt-3 line-clamp-4 text-sm leading-7 text-muted-foreground">{item.excerpt}</p>}
                  </Link>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function ArticleCover({ item, number, featured = false }: { item: JournalItem; number: number; featured?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden bg-[#dce3dc] ${featured ? "min-h-64 lg:col-span-7 lg:min-h-[28rem]" : "aspect-[16/9]"}`}
      role={item.coverImage ? "img" : undefined}
      aria-label={item.coverImage ? item.title : undefined}
    >
      {item.coverImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center grayscale-[12%] transition duration-700 group-hover:scale-[1.025] group-hover:grayscale-0"
          style={{ backgroundImage: `url(${JSON.stringify(item.coverImage).slice(1, -1)})` }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(135deg,#dfe9e1,#f4efe1)] text-primary/35">
          <Newspaper className={featured ? "h-24 w-24" : "h-14 w-14"} />
          <span className="mt-3 text-xs font-black uppercase tracking-[0.2em]">ACEFIDE</span>
        </div>
      )}
      <span className="absolute start-3 top-3 flex h-10 min-w-10 items-center justify-center rounded-full border border-white/60 bg-[#102a22]/90 px-2 text-sm font-black text-white shadow-lg backdrop-blur">
        {String(number).padStart(2, "0")}
      </span>
    </div>
  );
}

function JournalDate({ date, locale }: { date: Date; locale: "ar" | "fr" | "en" }) {
  return (
    <time dateTime={date.toISOString()} className="inline-flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.12em] text-primary">
      <CalendarDays className="h-3.5 w-3.5" />
      {date.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" })}
    </time>
  );
}
