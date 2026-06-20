"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const newsItems = [
  {
    id: 1,
    title: "إطلاق دراسة استشرافية حول مستقبل الاقتصاد الجزائري",
    titleEn: "Launch of a Foresight Study on the Future of the Algerian Economy",
    category: "STUDIES",
    date: "2026-05-15",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    excerpt: "دراسة معمقة حول التحديات والفرص الاقتصادية في الجزائر خلال العقد القادم...",
  },
  {
    id: 2,
    title: "تنظيم المؤتمر السنوي الأول للاستثمار والمقاولاتية",
    titleEn: "Organizing the First Annual Conference on Investment and Entrepreneurship",
    category: "NEWS",
    date: "2026-04-20",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    excerpt: "المؤتمر يجمع خبراء الاقتصاد والمستثمرين ورواد الأعمال لمناقشة آفاق الاستثمار...",
  },
  {
    id: 3,
    title: "توقيع اتفاقية شراكة مع جامعة الجزائر",
    titleEn: "Signing a Partnership Agreement with the University of Algiers",
    category: "NEWS",
    date: "2026-03-10",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    excerpt: "اتفاقية شراكة استراتيجية تهدف إلى تعزيز التعاون الأكاديمي والبحثي...",
  },
];

export function LatestNews() {
  const t = useTranslations("news");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section
      className={cn(
        "py-20 bg-muted/30",
        isRtl && "font-arabic"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="container-content scroll-reveal">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("latest")}
            </h2>
            <div className="w-16 h-1 bg-turquoise rounded-full" />
          </div>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/news">
              {t("viewAll")}
              <Arrow className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={locale === "ar" ? item.title : item.titleEn}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="turquoise" className="text-xs">
                    {t(`categories.${item.category.toLowerCase()}`)}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {item.date}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {locale === "ar" ? item.title : item.titleEn}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {locale === "ar" ? item.excerpt : item.excerpt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
