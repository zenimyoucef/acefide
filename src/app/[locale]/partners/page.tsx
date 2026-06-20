"use client";

import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Landmark, Globe, GraduationCap, Briefcase } from "lucide-react";

const partnerCategories = [
  { key: "institutional", icon: Building2, count: 5 },
  { key: "government", icon: Landmark, count: 3 },
  { key: "international", icon: Globe, count: 4 },
  { key: "universities", icon: GraduationCap, count: 6 },
  { key: "private", icon: Briefcase, count: 8 },
];

export default function PartnersPage() {
  const t = useTranslations("partners");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div className={cn(isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <section className="gradient-primary py-20">
        <div className="container-content text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("title")}</h1>
          <div className="w-16 h-1 bg-turquoise mx-auto rounded-full" />
        </div>
      </section>

      <section className="py-20">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerCategories.map((cat) => (
              <Card key={cat.key} className="group hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-turquoise/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <cat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{t(cat.key)}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {cat.count} {locale === "ar" ? "شريك" : locale === "fr" ? "partenaires" : "partners"}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {Array.from({ length: cat.count }).map((_, i) => (
                      <div
                        key={i}
                        className="h-12 w-20 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground border border-border/50"
                      >
                        {locale === "ar" ? "شعار" : locale === "fr" ? "Logo" : "Logo"} {i + 1}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
