"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Search, BarChart3, TrendingUp, Rocket, Files, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { key: "research", icon: BarChart3 },
  { key: "investment", icon: TrendingUp },
  { key: "entrepreneurship", icon: Rocket },
  { key: "policy", icon: Files },
  { key: "partnerships", icon: Handshake },
];

const projects = [
  {
    id: 1,
    category: "research",
    titleAr: "دراسة آفاق الاقتصاد الجزائري 2030",
    titleEn: "Algerian Economic Outlook 2030 Study",
    summaryAr: "دراسة استشرافية شاملة لتحليل التوجهات الاقتصادية الكبرى وتقديم سيناريوهات للمستقبل.",
    summaryEn: "A comprehensive foresight study analyzing major economic trends and providing future scenarios.",
  },
  {
    id: 2,
    category: "investment",
    titleAr: "برنامج دعم الاستثمار في القطاعات الواعدة",
    titleEn: "Investment Support Program in Promising Sectors",
    summaryAr: "تحديد القطاعات الاقتصادية الواعدة وتقديم توصيات للمستثمرين المحليين والدوليين.",
    summaryEn: "Identifying promising economic sectors and providing recommendations for local and international investors.",
  },
  {
    id: 3,
    category: "entrepreneurship",
    titleAr: "حاضنة المقاولاتية الشبابية",
    titleEn: "Youth Entrepreneurship Incubator",
    summaryAr: "برنامج متكامل لدعم رواد الأعمال الشباب وتطوير مشاريعهم من الفكرة إلى التنفيذ.",
    summaryEn: "An integrated program supporting young entrepreneurs from idea to execution.",
  },
];

export default function ProjectsPage() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.key
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {t(`categories.${cat.key}`)}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects
              .filter((p) => !activeCategory || p.category === activeCategory)
              .map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-all overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-turquoise/10 flex items-center justify-center">
                    <Search className="h-12 w-12 text-primary/30" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {locale === "ar" ? project.titleAr : project.titleEn}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {locale === "ar" ? project.summaryAr : project.summaryEn}
                    </p>
                    <Button variant="outline" size="sm" className="rounded-full group/btn" asChild>
                      <Link href={`/projects/${project.id}`}>
                        {t("viewDetails")}
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
