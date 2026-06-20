"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function ProjectDetailPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className={cn(isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <section className="gradient-primary py-20">
        <div className="container-content">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <Arrow className="h-4 w-4" />
            {locale === "ar" ? "العودة للمشاريع" : locale === "fr" ? "Retour aux projets" : "Back to Projects"}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {locale === "ar" ? "تفاصيل المشروع" : locale === "fr" ? "Détails du projet" : "Project Details"}
          </h1>
        </div>
      </section>
      <section className="py-20">
        <div className="container-content max-w-4xl">
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
            <p>{locale === "ar" ? "تفاصيل المشروع قيد الإضافة..." : locale === "fr" ? "Détails du projet à venir..." : "Project details coming soon..."}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
