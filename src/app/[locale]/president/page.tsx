"use client";

import Image from "next/image";
import akram from "../../../../assets/akram.png";
import { useLocale, useTranslations } from "next-intl";
import { ArrowDown, Calendar, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const timeline = [
  { year: "2020", en: "Founded ACEFIDE", ar: "تأسيس المركز الجزائري للاستشراف الاقتصادي", fr: "Fondation du ACEFIDE" },
  { year: "2021", en: "First Economic Study Published", ar: "إصدار أول دراسة اقتصادية", fr: "Première étude économique publiée" },
  { year: "2022", en: "First Strategic Partnership", ar: "أول شراكة استراتيجية", fr: "Premier partenariat stratégique" },
  { year: "2023", en: "International Recognition", ar: "اعتراف دولي", fr: "Reconnaissance internationale" },
  { year: "2024", en: "Expansion of Programs", ar: "توسيع البرامج", fr: "Expansion des programmes" },
];

export default function PresidentPage() {
  const t = useTranslations("president");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div className={cn(isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <section className="relative overflow-hidden bg-[#f7f8f4] text-[#0b1f33]">
        <div className="absolute inset-x-0 top-0 h-64 bg-[#073f31]" />
        <div className="container-content relative z-10 py-12 md:py-16 lg:py-20">
          <div className="grid min-h-[calc(100vh-8rem)] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <article className="order-2 lg:order-1">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">ACEFIDE</p>
              <h1 className="mt-5 text-4xl font-black leading-tight text-[#0b1f33] md:text-6xl">
                {t("name")}
              </h1>
              <p className="mt-4 max-w-xl text-xl font-bold leading-8 text-primary md:text-2xl">
                {t("title")}
              </p>
              <p className="mt-8 max-w-2xl text-lg font-medium leading-9 text-[#43534d]">
                {t("shortBio")}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#president-message"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {t("readMore")}
                  <ArrowDown className="h-4 w-4" />
                </a>
                <span className="h-px w-16 bg-primary/30" />
              </div>
            </article>

            <div className="order-1 lg:order-2">
              <div className="relative mx-auto max-w-[560px]">
                <div className="absolute -inset-4 rounded-[2rem] border border-primary/15 bg-white shadow-[0_28px_70px_rgba(11,31,51,.12)]" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#dbe8e2] shadow-2xl">
                  <Image
                    src={akram}
                    alt={t("name")}
                    fill
                    priority
                    sizes="(min-width: 1024px) 520px, 88vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#062f26]/90 via-[#062f26]/36 to-transparent p-6 text-white">
                    <Quote className="mb-3 h-8 w-8 text-turquoise-light" />
                    <p className="text-sm font-bold leading-7 text-white/90">{t("shortBio")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="president-message" className="bg-[#f3fbf6] py-20 text-[#10241d]">
        <div className="container-content max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-white p-8 shadow-[0_18px_50px_rgba(13,107,79,0.08)] md:p-12">
            <Quote className="absolute end-6 top-6 h-16 w-16 text-turquoise/15" />
            <div className="relative z-10">
              <h2 className="mb-6 text-3xl font-black text-[#10241d]">{t("message")}</h2>
              <div className="max-w-none space-y-4 text-base leading-8 text-[#385047] md:text-lg">
                <p>{t("fullBio")}</p>
                <p>
                  {locale === "ar"
                    ? "يؤمن المركز بأن الاستشراف الاقتصادي العلمي هو الأساس لبناء مستقبل اقتصادي مزدهر للجزائر، ونسعى من خلال عملنا إلى تقديم إسهامات ملموسة في مسيرة التنمية الوطنية."
                    : locale === "fr"
                    ? "Le centre croit que la prospective économique scientifique est la base pour construire un avenir économique prospère pour l'Algérie, et nous cherchons à travers notre travail à apporter des contributions concrètes au développement national."
                    : "The center believes that scientific economic foresight is the foundation for building a prosperous economic future for Algeria, and through our work we strive to make tangible contributions to national development."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eef2f4] py-20">
        <div className="container-content max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#172638]">
            {t("timeline")}
          </h2>
          <div className="space-y-6">
            {timeline.map((item) => (
              <div key={item.year} className="flex items-start gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <span className="text-lg font-bold text-primary">{item.year}</span>
                  <p className="mt-1 text-[#172638]">
                    {locale === "ar" ? item.ar : locale === "fr" ? item.fr : item.en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
