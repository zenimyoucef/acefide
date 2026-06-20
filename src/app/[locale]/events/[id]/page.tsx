"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Calendar, MapPin, Users } from "lucide-react";

export default function EventDetailPage() {
  const t = useTranslations("events");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className={cn(isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <section className="gradient-primary py-20">
        <div className="container-content">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <Arrow className="h-4 w-4" />
            {locale === "ar" ? "العودة للفعاليات" : locale === "fr" ? "Retour aux événements" : "Back to Events"}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {locale === "ar" ? "تفاصيل الفعالية" : locale === "fr" ? "Détails de l'événement" : "Event Details"}
          </h1>
        </div>
      </section>
      <section className="py-20">
        <div className="container-content max-w-4xl">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted mb-8">
            <Image
              src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=80"
              alt={locale === "ar" ? "ØªÙØ§ØµÙŠÙ„ Ø§Ù„ÙØ¹Ø§Ù„ÙŠØ©" : locale === "fr" ? "DÃ©tails de l'Ã©vÃ©nement" : "Event details"}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{locale === "ar" ? "قيد التحديد" : locale === "fr" ? "À déterminer" : "To be determined"}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{locale === "ar" ? "الجزائر العاصمة" : locale === "fr" ? "Alger" : "Algiers"}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Users className="h-5 w-5 text-primary" />
                <span>{locale === "ar" ? "المتحدثون قيد التحديد" : locale === "fr" ? "Intervenants à confirmer" : "Speakers to be confirmed"}</span>
              </div>
            </div>
            <Button size="lg" className="rounded-full">
              {t("register")}
              <Arrow className="h-4 w-4" />
            </Button>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
            <p>{locale === "ar" ? "تفاصيل الفعالية قيد الإضافة..." : locale === "fr" ? "Détails de l'événement à venir..." : "Event details coming soon..."}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
