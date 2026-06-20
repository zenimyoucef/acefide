"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ArrowRight, ArrowLeft, Calendar } from "lucide-react";

const categories = ["reports", "studies", "analysis"] as const;
type Category = (typeof categories)[number];

const publications = [
  {
    id: 1,
    category: "studies" as Category,
    titleAr: "دراسة: آفاق الاقتصاد الجزائري 2026-2030",
    titleEn: "Study: Algerian Economic Outlook 2026-2030",
    titleFr: "Étude : Perspectives économiques algériennes 2026-2030",
    date: "2026-01-15",
    summaryAr: "دراسة استشرافية شاملة حول التوجهات الاقتصادية الكبرى في الجزائر.",
    summaryEn: "Comprehensive foresight study on major economic trends in Algeria.",
    summaryFr: "Étude prospective complète sur les grandes tendances économiques en Algérie.",
    pdfUrl: "#",
  },
  {
    id: 2,
    category: "reports" as Category,
    titleAr: "تقرير مناخ الاستثمار في الجزائر",
    titleEn: "Algeria Investment Climate Report",
    titleFr: "Rapport sur le climat d'investissement en Algérie",
    date: "2025-11-20",
    summaryAr: "تحليل شامل لمناخ الاستثمار وفرص الاستثمار في الجزائر.",
    summaryEn: "Comprehensive analysis of the investment climate and opportunities in Algeria.",
    summaryFr: "Analyse complète du climat d'investissement et des opportunités en Algérie.",
    pdfUrl: "#",
  },
  {
    id: 3,
    category: "analysis" as Category,
    titleAr: "تحليل استراتيجي: التنويع الاقتصادي في الجزائر",
    titleEn: "Strategic Analysis: Economic Diversification in Algeria",
    titleFr: "Analyse stratégique : Diversification économique en Algérie",
    date: "2025-09-10",
    summaryAr: "تحليل استراتيجي لجهود التنويع الاقتصادي في الجزائر والتحديات والفرص.",
    summaryEn: "Strategic analysis of economic diversification efforts in Algeria, challenges and opportunities.",
    summaryFr: "Analyse stratégique des efforts de diversification économique en Algérie, défis et opportunités.",
    pdfUrl: "#",
  },
];

export default function PublicationsPage() {
  const t = useTranslations("news");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const filtered = activeCategory
    ? publications.filter((p) => p.category === activeCategory)
    : publications;

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
          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                !activeCategory
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {locale === "ar" ? "الكل" : locale === "fr" ? "Tous" : "All"}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pub) => (
              <Card key={pub.id} className="group hover:shadow-lg transition-all overflow-hidden">
                <div className="aspect-[3/2] bg-gradient-to-br from-primary/10 to-turquoise/10 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-primary/30" />
                </div>
                <CardContent className="p-6">
                  <Badge variant="turquoise" className="mb-3">
                    {t(`categories.${pub.category}`)}
                  </Badge>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {locale === "ar" ? pub.titleAr : locale === "fr" ? pub.titleFr : pub.titleEn}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {locale === "ar" ? pub.summaryAr : locale === "fr" ? pub.summaryFr : pub.summaryEn}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {pub.date}
                    </span>
                    <Button variant="outline" size="sm" className="rounded-full" asChild>
                      <a href={pub.pdfUrl}>
                        <Download className="h-3.5 w-3.5" />
                        {t("downloadPdf")}
                      </a>
                    </Button>
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
