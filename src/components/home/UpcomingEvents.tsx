import { Link } from "@/lib/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";

const copy = {
  ar: { kicker: "الحضور الميداني", title: "أبرز الأنشطة", body: "لقاءات تجمع المؤسسات والخبراء وصنّاع الفرص حول مستقبل الاقتصاد والاستثمار.", all: "كل الأنشطة", featured: "فعالية بارزة", empty: "لا توجد فعاليات حالياً." },
  fr: { kicker: "Présence sur le terrain", title: "Activités phares", body: "Réunions réunissant entreprises, experts et createurs d'opportunités autour de l'avenir de l'économie et de l'investissement.", all: "Toutes les activités", featured: "Événement vedette", empty: "Aucune activité pour le moment." },
  en: { kicker: "Field presence", title: "Key activities", body: "Meetings bringing together businesses, experts and opportunity creators around the future of economy and investment.", all: "All activities", featured: "Featured event", empty: "No activities currently." },
} as const;

type Locale = "ar" | "fr" | "en";

export async function UpcomingEvents({ locale = "ar" }: { locale?: Locale }) {
  const text = copy[locale];

  const events = await prisma.event
    .findMany({
      where: { published: true },
      orderBy: [{ date: "desc" }],
      take: 4,
    })
    .catch(() => []);

  if (!events.length) return null;

  const localized = events.map((e) => ({
    slug: e.slug,
    title: locale === "ar" ? e.titleAr : locale === "fr" ? e.titleFr : e.titleEn,
    location: locale === "ar" ? e.locationAr : locale === "fr" ? e.locationFr : e.locationEn,
    date: e.date,
    category: e.category,
  }));

  const [featured, ...rest] = localized;

  return (
    <section className="bg-white py-14 sm:py-20" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="container-content">
        {/* Header */}
        <div className="mb-14 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="section-kicker">{text.kicker}</p>
            <h2 className="section-title mt-4">{text.title}</h2>
            <p className="section-copy mt-5">{text.body}</p>
          </div>
          <Link href="/events" className="group hidden shrink-0 items-center gap-2 rounded-full border border-primary/15 px-5 py-2.5 text-sm font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-[0_8px_25px_rgba(11,122,83,0.25)] sm:flex">
            {text.all}
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-[1.2fr_.8fr]">
          {/* Featured card */}
          <Link href={`/events/${featured.slug}`} className="group relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-[#0b1f33] p-7 text-white shadow-[0_22px_60px_rgba(11,31,51,.16)] transition-all duration-500 hover:shadow-[0_28px_70px_rgba(11,31,51,.24)] hover:-translate-y-1 sm:p-10">
            <div className="absolute -end-20 -top-24 h-72 w-72 rounded-full bg-turquoise/25 blur-3xl transition-all duration-700 group-hover:scale-125 group-hover:bg-turquoise/35" />
            <div className="absolute inset-0 opacity-[.07] [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="relative">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#e5c978] backdrop-blur-sm">{text.featured}</span>
              <div className="mt-7 flex items-center gap-2 text-sm text-white/65">
                <CalendarDays className="h-4 w-4" />
                {featured.date.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" })}
              </div>
              <h3 className="mt-4 max-w-2xl text-2xl font-bold leading-tight tracking-tight transition-colors duration-300 group-hover:text-turquoise-light md:text-4xl">{featured.title}</h3>
              {featured.location && (
                <p className="mt-6 flex items-start gap-2 text-sm text-white/65">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {featured.location}
                </p>
              )}
              <span className="mt-8 inline-flex items-center gap-2 font-bold text-turquoise-light transition-all duration-300 group-hover:gap-3">
                {text.all}
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Secondary cards */}
          {rest.length > 0 && (
            <div className="grid gap-5">
              {rest.map((item) => (
                <Link key={item.slug} href={`/events/${item.slug}`} className="group flex min-h-[170px] flex-col justify-between rounded-2xl border border-border/40 bg-[#f9faf8] p-6 transition-all duration-400 hover:-translate-y-1 hover:border-primary/20 hover:bg-white hover:shadow-[0_12px_35px_rgba(11,31,51,0.08)]">
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full bg-primary/8 px-3 py-1 text-xs font-bold text-primary transition-colors duration-300 group-hover:bg-primary/12">{item.category}</span>
                      <span className="text-xs font-bold text-accent">{item.date.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" })}</span>
                    </div>
                    <h3 className="my-4 text-lg font-bold leading-7 text-[#0b1f33] transition-colors duration-300 group-hover:text-primary">{item.title}</h3>
                  </div>
                  {item.location && (
                    <p className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                      {item.location}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
