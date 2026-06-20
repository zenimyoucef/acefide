"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, FileText, Download, Calendar } from "lucide-react";

export default function PublicationDetailPage() {
  const t = useTranslations("news");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className={cn(isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <section className="gradient-primary py-20">
        <div className="container-content">
          <Link href="/publications" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
            <Arrow className="h-4 w-4" />
            {locale === "ar" ? "العودة للمنشورات" : locale === "fr" ? "Retour aux publications" : "Back to Publications"}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{locale === "ar" ? "تفاصيل المنشور" : locale === "fr" ? "Détails de la publication" : "Publication Details"}</h1>
        </div>
      </section>
      <section className="py-20">
        <div className="container-content max-w-4xl">
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/10 to-turquoise/10 flex items-center justify-center mb-8">
            <FileText className="h-20 w-20 text-primary/30" />
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-4 w-4" /> {locale === "ar" ? "قيد النشر" : locale === "fr" ? "À publier" : "Pending"}</span>
            <Button variant="outline" className="rounded-full" asChild>
              <a href="#"><Download className="h-4 w-4" /> {t("downloadPdf")}</a>
            </Button>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
            <p>{locale === "ar" ? "المنشور قيد الإضافة..." : locale === "fr" ? "Publication à venir..." : "Publication coming soon..."}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
