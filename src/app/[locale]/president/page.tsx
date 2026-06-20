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
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-primary-dark text-white">
        <div className="absolute inset-0 bg-[linear-gradient(150deg,#063f2f_0%,#0d6b4f_34%,#f3fbf6_34.2%,#ffffff_53%,#dff7ee_53.2%,#14b8a6_72%,#063f2f_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,45,34,0.94)_0%,rgba(13,107,79,0.58)_34%,rgba(255,255,255,0.04)_52%,rgba(13,107,79,0.50)_76%,rgba(4,45,34,0.94)_100%)]" />

        <div className="container-content relative z-10 flex min-h-[calc(100vh-4rem)] items-center py-16 md:py-20">
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[0.95fr_1fr] lg:gap-16">
            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="absolute left-0 top-4 hidden h-[88%] w-full rounded-2xl border border-turquoise-light/35 bg-white/5 shadow-2xl backdrop-blur-sm md:block" />
              <div className="relative mx-auto aspect-[0.76] w-[min(78vw,448px)] overflow-hidden rounded-2xl border border-turquoise-light/60 bg-gradient-to-br from-primary/35 via-turquoise/15 to-white/35 shadow-2xl">
                <Image
                  src={akram}
                  alt={t("name")}
                  fill
                  priority
                  sizes="(min-width: 1024px) 448px, 78vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary-dark/20" />
              </div>
            </div>

            <div className="mx-auto max-w-xl rounded-2xl bg-primary-dark/72 p-6 text-center shadow-2xl backdrop-blur-sm md:p-8 lg:mx-0 lg:text-start">
              <Quote className="mb-6 h-12 w-12 text-turquoise-light/80" />
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                {t("name")}
              </h1>
              <p className="mt-4 text-lg font-semibold text-turquoise-light md:text-xl">
                {t("title")}
              </p>
              <p className="mt-8 max-w-lg text-base font-medium leading-8 text-white/92 md:text-lg">
                {t("shortBio")}
              </p>
              <a
                href="#president-message"
                className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-turquoise-light/80 bg-white/10 px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquoise-light focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark"
              >
                {t("readMore")}
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="president-message" className="bg-[#f3fbf6] py-20 text-[#10241d]">
        <div className="container-content max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-white p-8 shadow-[0_22px_60px_rgba(13,107,79,0.12)] md:p-12">
            <Quote className="absolute left-6 top-6 h-16 w-16 text-turquoise/15" />
            <div className="relative z-10">
              <h2 className="mb-6 text-2xl font-bold text-[#10241d]">{t("message")}</h2>
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
