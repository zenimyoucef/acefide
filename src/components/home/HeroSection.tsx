"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, UserPlus, Users } from "lucide-react";
import heroImage from "../../../public/images/algiers-hero.png";

export function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const badge = isRtl ? "جمعية غير حكومية" : locale === "fr" ? "Organisation non gouvernementale (ONG)" : "Non-Governmental Organization (NGO)";
  const inscription = isRtl ? "التسجيل" : locale === "fr" ? "Inscription" : "Register";
  const contact = isRtl ? "اتصل بنا" : locale === "fr" ? "Nous contacter" : "Contact us";

  return (
    <section className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden bg-[#071b20] text-white" dir={isRtl ? "rtl" : "ltr"}>
      <Image src={heroImage} alt="Panoramic view of Algiers" fill priority placeholder="blur" sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,17,24,.96)_0%,rgba(5,24,29,.86)_38%,rgba(5,20,24,.42)_72%,rgba(5,15,18,.24)_100%)] rtl:bg-[linear-gradient(270deg,rgba(4,17,24,.96)_0%,rgba(5,24,29,.86)_38%,rgba(5,20,24,.42)_72%,rgba(5,15,18,.24)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,12,18,.08)_35%,rgba(4,20,22,.92)_100%)]" />
      <div className="absolute -start-24 top-1/3 h-72 w-72 rounded-full bg-turquoise/15 blur-[100px]" />

      <div className="container-content relative z-10 flex min-h-[calc(100svh-4.5rem)] flex-col justify-center py-16 sm:py-20">
        <div className="scroll-reveal-soft max-w-[860px]">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 shadow-lg backdrop-blur-md">
            <BarChart3 className="h-4 w-4 text-turquoise-light" /><span>{badge}</span>
          </div>
          <h1 className="max-w-[820px] text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] text-white drop-shadow-2xl sm:text-[2.9rem] lg:text-[3.6rem] xl:text-[4rem]">{t("title")}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg md:text-xl">{t("subtitle")}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button size="xl" className="group w-full rounded-full bg-turquoise px-7 text-white shadow-[0_14px_35px_rgba(22,139,120,.35)] hover:bg-turquoise/90 sm:w-auto" asChild>
              <Link href="/membership">{inscription}<UserPlus className="h-5 w-5" /></Link>
            </Button>
            <Button size="xl" variant="outline" className="w-full rounded-full border-white/30 bg-white/8 px-7 text-white backdrop-blur hover:bg-white/16 hover:text-white sm:w-auto" asChild><Link href="/contact">{contact}</Link></Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/65">
            <Link href="/membership" className="inline-flex items-center gap-2 transition-colors hover:text-white"><UserPlus className="h-4 w-4" />{t("becomeMember")}</Link>
            <Link href="/consultation" className="inline-flex items-center gap-2 transition-colors hover:text-white"><Users className="h-4 w-4" />{t("requestConsultation")}</Link>
            <Link href="/publications" className="inline-flex items-center gap-2 transition-colors hover:text-white"><FileText className="h-4 w-4" />{t("explorePublications")}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
