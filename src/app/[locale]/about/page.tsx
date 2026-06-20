"use client";

import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Building2, Eye, Target, Heart, Lightbulb, Award, FileCheck, TrendingUp } from "lucide-react";

const valuesKeys = ["innovation", "excellence", "transparency", "development", "impact"] as const;
const valueIcons = [Lightbulb, Award, FileCheck, TrendingUp, Heart] as const;

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div className={cn(isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="gradient-primary py-20">
        <div className="container-content text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("title")}
          </h1>
          <div className="w-16 h-1 bg-turquoise mx-auto rounded-full" />
        </div>
      </section>

      {/* History */}
      <section className="py-20">
        <div className="container-content max-w-4xl">
          <div className="flex items-start gap-6 mb-12">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{t("history")}</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{t("historyDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-muted/30">
        <div className="container-content max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border/50">
              <Eye className="h-10 w-10 text-turquoise mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">{t("vision")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("visionDesc")}</p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border/50">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">{t("mission")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("missionDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container-content max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">{t("values")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {valuesKeys.map((key, i) => {
              const Icon = valueIcons[i];
              return (
                <div key={key} className="flex flex-col items-center p-6 rounded-xl bg-card border border-border/50 hover:shadow-md transition-all hover:-translate-y-1">
                  <Icon className="h-8 w-8 text-primary mb-3" />
                  <span className="text-sm font-medium text-center text-foreground">
                    {t(`values_list.${key}`)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="py-20 bg-muted/30">
        <div className="container-content max-w-4xl">
          <div className="p-8 rounded-2xl bg-card border border-border/50">
            <h2 className="text-2xl font-bold text-foreground mb-4">{t("registration")}</h2>
            <p className="text-muted-foreground">{t("registrationInfo")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
