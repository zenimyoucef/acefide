"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, ArrowLeft } from "lucide-react";

const categories = ["news", "reports", "studies", "analysis"] as const;
type Category = (typeof categories)[number];

const newsItems = [
  {
    id: 1,
    category: "studies" as Category,
    titleAr: "إطلاق دراسة استشرافية حول مستقبل الاقتصاد الجزائري",
    titleEn: "Launch of a Foresight Study on the Future of the Algerian Economy",
    titleFr: "Lancement d'une étude prospective sur l'avenir de l'économie algérienne",
    date: "2026-05-15",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    excerptAr: "دراسة معمقة حول التحديات والفرص الاقتصادية في الجزائر خلال العقد القادم...",
    excerptEn: "An in-depth study on the economic challenges and opportunities in Algeria over the next decade...",
    excerptFr: "Une étude approfondie sur les défis et opportunités économiques en Algérie au cours de la prochaine décennie...",
  },
  {
    id: 2,
    category: "news" as Category,
    titleAr: "تنظيم المؤتمر السنوي الأول للاستثمار والمقاولاتية",
    titleEn: "Organizing the First Annual Conference on Investment and Entrepreneurship",
    titleFr: "Organisation de la première conférence annuelle sur l'investissement et l'entrepreneuriat",
    date: "2026-04-20",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    excerptAr: "المؤتمر يجمع خبراء الاقتصاد والمستثمرين ورواد الأعمال...",
    excerptEn: "The conference brings together economists, investors and entrepreneurs...",
    excerptFr: "La conférence réunit des économistes, des investisseurs et des entrepreneurs...",
  },
  {
    id: 3,
    category: "reports" as Category,
    titleAr: "تقرير الاستثمار في الجزائر 2026",
    titleEn: "Algeria Investment Report 2026",
    titleFr: "Rapport sur l'investissement en Algérie 2026",
    date: "2026-03-01",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    excerptAr: "تقرير شامل حول مناخ الاستثمار في الجزائر وفرص الاستثمار المتاحة...",
    excerptEn: "A comprehensive report on the investment climate in Algeria and available opportunities...",
    excerptFr: "Un rapport complet sur le climat d'investissement en Algérie et les opportunités disponibles...",
  },
];

export default function NewsPage() {
  const t = useTranslations("news");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const filtered = activeCategory
    ? newsItems.filter((item) => item.category === activeCategory)
    : newsItems;

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
          {/* Category Filters */}
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

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-all overflow-hidden">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <Image
                    src={item.image}
                    alt={locale === "ar" ? item.titleAr : locale === "fr" ? item.titleFr : item.titleEn}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="turquoise" className="text-xs">
                      {t(`categories.${item.category}`)}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {locale === "ar" ? item.titleAr : locale === "fr" ? item.titleFr : item.titleEn}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {locale === "ar" ? item.excerptAr : locale === "fr" ? item.excerptFr : item.excerptEn}
                  </p>
                  <Button variant="outline" size="sm" className="rounded-full group/btn" asChild>
                    <Link href={`/news/${item.id}`}>
                      {t("readMore")}
                      <Arrow className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
