"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { BarChart3, UserPlus } from "lucide-react";
import heroImage from "../../../public/images/algiers-hero.png";

export function HeroSection() {
  const t = useTranslations("hero");
  const badge = "منظمة غير حكومية";
  const inscription = "التسجيل";
  const suggestion = "إقتراحاتكم و إنشغالاتكم";

  return (
    <section className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden bg-[#071b20] text-white" dir="rtl">
      <Image
        src={heroImage}
        alt="Panoramic view of Algiers"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-left md:object-center"
      />
      {/* Main gradient overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(4,17,24,.96)_0%,rgba(5,24,29,.86)_38%,rgba(5,20,24,.42)_72%,rgba(5,15,18,.24)_100%)]" />
      {/* Bottom fade */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,12,18,.08)_35%,rgba(4,20,22,.92)_100%)]" />
      {/* Ambient glow */}
      <div className="absolute -start-24 top-1/3 h-72 w-72 rounded-full bg-turquoise/15 blur-[100px] animate-[floatGentle_8s_ease-in-out_infinite]" />
      <div className="absolute -end-16 bottom-1/4 h-48 w-48 rounded-full bg-accent/10 blur-[80px] animate-[floatGentle_10s_ease-in-out_infinite_2s]" />

      <div className="container-content relative z-10 flex min-h-[calc(100svh-4.5rem)] flex-col justify-center py-16 sm:py-20">
        <div className="max-w-[860px]">
          {/* Badge with stagger */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 shadow-lg backdrop-blur-md animate-[fadeIn_0.8s_ease-out_0.2s_both]">
            <BarChart3 className="h-4 w-4 text-turquoise-light" />
            <span>{badge}</span>
          </div>

          {/* Title with stagger */}
          <h1 className="max-w-[820px] text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] text-white drop-shadow-2xl sm:text-[2.9rem] lg:text-[3.6rem] xl:text-[4rem] animate-[fadeIn_0.8s_ease-out_0.4s_both]">
            {t("title")}
          </h1>

          {/* Subtitle with stagger */}
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg md:text-xl animate-[fadeIn_0.8s_ease-out_0.6s_both]">
            {t("subtitle")}
          </p>

          {/* Buttons with stagger */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap animate-[fadeIn_0.8s_ease-out_0.8s_both]">
            <Button
              size="xl"
              className="group w-full rounded-full bg-turquoise px-7 text-white shadow-[0_14px_35px_rgba(22,139,120,.35)] transition-all duration-300 hover:bg-turquoise-light hover:shadow-[0_18px_45px_rgba(22,139,120,.45)] hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              asChild
            >
              <Link href="/membership">
                {inscription}
                <UserPlus className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="w-full rounded-full border-white/30 bg-white/8 px-7 text-white backdrop-blur transition-all duration-300 hover:border-white/50 hover:bg-white/16 hover:text-white hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] sm:w-auto"
              asChild
            >
              <Link href="/suggestions">{suggestion}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
