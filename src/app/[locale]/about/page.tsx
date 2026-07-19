"use client";

import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Building2, Eye, Target, Heart, Lightbulb, Award, FileCheck, TrendingUp } from "lucide-react";
import aboutHeroBackground from "../../../../assets/480484075_3835887829965863_3326901755810918903_n.jpg";

const valuesKeys = ["innovation", "excellence", "transparency", "development", "impact"] as const;
const valueIcons = [Lightbulb, Award, FileCheck, TrendingUp, Heart] as const;

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div className={cn(isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-primary-dark bg-cover bg-center py-20"
        style={{ backgroundImage: `url(${aboutHeroBackground.src})` }}
      >
        <div className="absolute inset-0 bg-primary-dark/70" />
        <div className="container-content relative text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {t("title")}
          </h1>
          <div className="mx-auto h-1 w-16 rounded-full bg-turquoise" />
        </div>
      </section>

      {/* History */}
      <section className="py-20">
        <div className="container-content max-w-4xl">
          <div className="mb-12 flex items-start gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-bold text-foreground">{t("history")}</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">{t("historyDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-muted/30 py-20">
        <div className="container-content max-w-4xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-border/50 bg-card p-8">
              <Eye className="mb-4 h-10 w-10 text-turquoise" />
              <h2 className="mb-4 text-2xl font-bold text-foreground">{t("vision")}</h2>
              <p className="leading-relaxed text-muted-foreground">{t("visionDesc")}</p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-8">
              <Target className="mb-4 h-10 w-10 text-primary" />
              <h2 className="mb-4 text-2xl font-bold text-foreground">{t("mission")}</h2>
              <p className="leading-relaxed text-muted-foreground">{t("missionDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container-content max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">{t("values")}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {valuesKeys.map((key, i) => {
              const Icon = valueIcons[i];
              return (
                <div key={key} className="flex flex-col items-center rounded-xl border border-border/50 bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-md">
                  <Icon className="mb-3 h-8 w-8 text-primary" />
                  <span className="text-center text-sm font-medium text-foreground">
                    {t(`values_list.${key}`)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="bg-muted/30 py-20">
        <div className="container-content max-w-4xl">
          <div className="rounded-2xl border border-border/50 bg-card p-8">
            <h2 className="mb-4 text-2xl font-bold text-foreground">{t("registration")}</h2>
            <p className="text-muted-foreground">{t("registrationInfo")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
