"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft, Calendar } from "lucide-react";

export default function NewsDetailPage() {
  const t = useTranslations("news");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className={cn(isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <section className="gradient-primary py-20">
        <div className="container-content">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <Arrow className="h-4 w-4" />
            {locale === "ar" ? "العودة للأخبار" : locale === "fr" ? "Retour aux actualités" : "Back to News"}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {locale === "ar" ? "تفاصيل الخبر" : locale === "fr" ? "Détails de l'actualité" : "News Details"}
          </h1>
        </div>
      </section>
      <section className="py-20">
        <div className="container-content max-w-4xl">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted mb-8">
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
              alt={locale === "ar" ? "ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø®Ø¨Ø±" : locale === "fr" ? "DÃ©tails de l'actualitÃ©" : "News details"}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {locale === "ar" ? "قيد النشر" : locale === "fr" ? "À publier" : "Pending publication"}</span>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
            <p>{locale === "ar" ? "محتوى الخبر قيد الإضافة..." : locale === "fr" ? "Contenu de l'article à venir..." : "News content coming soon..."}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
