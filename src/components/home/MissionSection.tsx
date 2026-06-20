"use client";

import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Eye, TrendingUp, Rocket, FileCheck } from "lucide-react";

const missions = [
  { key: "foresight", icon: Eye },
  { key: "investment", icon: TrendingUp },
  { key: "entrepreneurship", icon: Rocket },
  { key: "policy", icon: FileCheck },
];

export function MissionSection() {
  const t = useTranslations("mission");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <section
      className={cn(
        "py-20",
        isRtl && "font-arabic"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="container-content scroll-reveal">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
          <div className="w-16 h-1 bg-turquoise mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {missions.map((mission) => (
            <div
              key={mission.key}
              className="pressable group relative p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 sm:p-8"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-turquoise rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-turquoise/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <mission.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {t(`${mission.key}.title`)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(`${mission.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
