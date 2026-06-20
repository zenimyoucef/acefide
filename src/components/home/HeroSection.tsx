"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, BarChart3, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section
      className={cn(
        "relative min-h-[calc(100svh-4rem)] flex items-center overflow-hidden",
        isRtl && "font-arabic"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/algiers-hero.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,10,16,0.90)_0%,rgba(8,18,27,0.78)_30%,rgba(10,18,25,0.46)_58%,rgba(8,13,18,0.32)_100%)] z-10" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,14,0.24)_0%,rgba(5,10,14,0.14)_45%,rgba(9,18,27,0.76)_100%)] z-10" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>
      </div>

      <div className="container-content relative z-20 py-16 sm:py-20">
        <div className="scroll-reveal-soft max-w-3xl text-start">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm mb-8">
            <BarChart3 className="h-4 w-4" />
            <span>{locale === "ar" ? "مركز فكر اقتصادي مستقل" : locale === "fr" ? "Centre de réflexion économique indépendant" : "Independent Economic Think Tank"}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-[0_3px_18px_rgba(0,0,0,0.55)]">
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-10 max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            {t("subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Button
              size="xl"
              className="w-full bg-turquoise text-white hover:bg-turquoise/90 rounded-full group sm:w-auto"
              asChild
            >
              <Link href="/membership">
                {t("becomeMember")}
                <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="w-full rounded-full border-white/45 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:w-auto"
              asChild
            >
              <Link href="/events">
                {t("registerEvents")}
              </Link>
            </Button>
          </div>

          {/* Secondary CTAs */}
          <div className="flex flex-col gap-4 mt-10 sm:flex-row sm:flex-wrap sm:gap-6">
            <Link
              href="/consultation"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            >
              <Users className="h-4 w-4" />
              {t("requestConsultation")}
            </Link>
            <Link
              href="/publications"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            >
              <FileText className="h-4 w-4" />
              {t("explorePublications")}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute -bottom-px left-0 right-0 h-64 bg-[linear-gradient(180deg,transparent_0%,rgba(8,52,43,0.30)_34%,rgba(8,74,57,0.74)_68%,#094d38_100%)] z-10" />
    </section>
  );
}
