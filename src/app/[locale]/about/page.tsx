"use client";

import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Building2, Target, Heart, Lightbulb, Award, FileCheck, TrendingUp } from "lucide-react";


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
        className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-dark py-20"
      >
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
          <div className="grid grid-cols-1 gap-8">
            <div className="rounded-2xl border border-border/50 bg-card p-8">
              <Target className="mb-4 h-10 w-10 text-primary" />
              <h2 className="mb-4 text-2xl font-bold text-foreground">{t("mission")}</h2>
              <div className="space-y-4 leading-relaxed text-muted-foreground">{t("missionDesc").split("\n\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div>
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

    </div>
  );
}
