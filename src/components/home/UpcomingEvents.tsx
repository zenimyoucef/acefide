"use client";

import { useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from "lucide-react";

const activities = [
  { slug: "african-business-fair-2026", date: "08.06.2026", type: { ar: "مشاركة", fr: "Participation", en: "Participation" }, title: { ar: "المشاركة في الطبعة الرابعة للصالون الإفريقي للأعمال", fr: "Participation à la 4e édition du Salon africain des affaires", en: "Participation in the 4th African Business Fair" }, location: { ar: "المدرسة العليا للفندقة والإطعام، الجزائر", fr: "ESHRA, Alger", en: "ESHRA, Algiers" } },
  { slug: "mining-innovation-roadmap-2025", date: "30.07.2025", type: { ar: "لقاء تنسيقي", fr: "Réunion de coordination", en: "Coordination meeting" }, title: { ar: "خارطة طريق للابتكار والمقاولاتية في قطاع المناجم", fr: "Feuille de route pour l’innovation et l’entrepreneuriat dans le secteur minier", en: "Roadmap for innovation and entrepreneurship in the mining sector" }, location: { ar: "مقر المديرية العامة للبحث العلمي، الجزائر", fr: "Siège de la DGRSDT, Alger", en: "DGRSDT headquarters, Algiers" } },
  { slug: "sonarem-mining-cooperation-2025", date: "02.06.2025", type: { ar: "فعالية وشراكة", fr: "Événement et partenariat", en: "Event and partnership" }, title: { ar: "المناجم: الاستثمار والابتكار والتحويل المحلي", fr: "Mines : investissement, innovation et transformation locale", en: "Mining: investment, innovation, and local transformation" }, location: { ar: "الجزائر العاصمة", fr: "Alger", en: "Algiers" } },
] as const;

export function UpcomingEvents() {
  const locale = useLocale() as "ar" | "fr" | "en";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const copy = locale === "ar"
    ? { kicker: "الحضور الميداني", title: "أبرز الأنشطة", body: "لقاءات تجمع المؤسسات والخبراء وصنّاع الفرص حول مستقبل الاقتصاد والاستثمار.", all: "كل الأنشطة", featured: "فعالية بارزة" }
    : locale === "fr"
      ? { kicker: "Présence sur le terrain", title: "Activités récentes", body: "Des rencontres qui réunissent institutions, experts et acteurs économiques autour des priorités nationales.", all: "Toutes les activités", featured: "À la une" }
      : { kicker: "Public presence", title: "Latest activities", body: "Convening institutions, experts, and economic actors around Algeria’s development priorities.", all: "All activities", featured: "Featured event" };
  const [featured, ...rest] = activities;

  return (
    <section className="bg-white py-20 md:py-28" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="container-content">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div className="max-w-2xl"><p className="section-kicker">{copy.kicker}</p><h2 className="section-title mt-4">{copy.title}</h2><p className="section-copy mt-5">{copy.body}</p></div>
          <Link href="/events" className="group hidden shrink-0 items-center gap-2 rounded-full border border-primary/15 px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-white sm:flex">{copy.all}<Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" /></Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <Link href={`/events/${featured.slug}`} className="group relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-[#0b1f33] p-7 text-white shadow-[0_22px_60px_rgba(11,31,51,.16)] md:p-10">
            <div className="absolute -end-20 -top-24 h-72 w-72 rounded-full bg-turquoise/25 blur-3xl transition-transform duration-700 group-hover:scale-125" />
            <div className="absolute inset-0 opacity-[.07] [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="relative"><span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#e5c978]">{copy.featured}</span><div className="mt-7 flex items-center gap-2 text-sm text-white/65"><CalendarDays className="h-4 w-4" />{featured.date}</div><h3 className="mt-4 max-w-2xl text-2xl font-bold leading-tight tracking-tight md:text-4xl">{featured.title[locale]}</h3><p className="mt-6 flex items-start gap-2 text-sm text-white/65"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{featured.location[locale]}</p><span className="mt-8 inline-flex items-center gap-2 font-bold text-turquoise-light">{copy.all}<Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" /></span></div>
          </Link>

          <div className="grid gap-5">
            {rest.map((item) => <Link key={item.slug} href={`/events/${item.slug}`} className="surface-card group flex min-h-[170px] flex-col justify-between p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl"><div className="flex items-center justify-between gap-4"><span className="rounded-full bg-primary/8 px-3 py-1 text-xs font-bold text-primary">{item.type[locale]}</span><span className="text-xs font-bold text-accent">{item.date}</span></div><h3 className="my-4 text-lg font-bold leading-7 text-[#0b1f33] transition-colors group-hover:text-primary">{item.title[locale]}</h3><p className="flex items-start gap-2 text-sm text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{item.location[locale]}</p></Link>)}
          </div>
        </div>
      </div>
    </section>
  );
}
