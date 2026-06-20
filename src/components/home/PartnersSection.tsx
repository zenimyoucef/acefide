"use client";

import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Building2, GraduationCap, Globe, Landmark, Briefcase } from "lucide-react";

const partnerCategories = [
  { key: "institutional", icon: Building2 },
  { key: "government", icon: Landmark },
  { key: "international", icon: Globe },
  { key: "universities", icon: GraduationCap },
  { key: "private", icon: Briefcase },
];

export function PartnersSection() {
  const t = useTranslations("partners");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <section
      className={cn(
        "py-20 bg-muted/50",
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {partnerCategories.map((cat) => (
            <div
              key={cat.key}
              className="pressable flex flex-col items-center p-5 rounded-xl bg-card border border-border/50 hover:shadow-md transition-all hover:-translate-y-1 group sm:p-6"
            >
              <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                <cat.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                {t(cat.key)}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {locale === "ar" ? "قيد الإضافة" : locale === "fr" ? "À venir" : "Coming soon"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
