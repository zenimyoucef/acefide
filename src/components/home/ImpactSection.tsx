"use client";

import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { FileText, Calendar, Handshake, Users } from "lucide-react";

const stats = [
  { key: "studies", icon: FileText, value: "50+" },
  { key: "events", icon: Calendar, value: "30+" },
  { key: "partnerships", icon: Handshake, value: "20+" },
  { key: "members", icon: Users, value: "100+" },
];

export function ImpactSection() {
  const t = useTranslations("impact");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <section
      className={cn(
        "-mt-px py-20 bg-[#eef2f4]",
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="pressable flex flex-col items-center p-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 sm:p-8"
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <stat.icon className="h-7 w-7 text-primary" />
              </div>
              <span className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground text-center">
                {t(stat.key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
