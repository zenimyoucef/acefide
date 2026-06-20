"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, ArrowRight, ArrowLeft } from "lucide-react";

const events = [
  {
    id: 1,
    titleAr: "المؤتمر السنوي للاستثمار والمقاولاتية",
    titleEn: "Annual Conference on Investment and Entrepreneurship",
    titleFr: "Conférence Annuelle sur l'Investissement et l'Entrepreneuriat",
    date: "2026-09-15",
    locationAr: "الجزائر العاصمة",
    locationEn: "Algiers",
    locationFr: "Alger",
    speakersAr: "خبراء اقتصاد، مستثمرون، مسؤولون حكوميون",
    speakersEn: "Economic experts, investors, government officials",
    speakersFr: "Experts économiques, investisseurs, responsables gouvernementaux",
    type: "conference" as const,
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    titleAr: "ورشة عمل: آليات تمويل الشركات الناشئة",
    titleEn: "Workshop: Startup Financing Mechanisms",
    titleFr: "Atelier : Mécanismes de financement des startups",
    date: "2026-08-20",
    locationAr: "الجزائر العاصمة",
    locationEn: "Algiers",
    locationFr: "Alger",
    speakersAr: "خبراء ماليون، ممثلو بنوك",
    speakersEn: "Financial experts, bank representatives",
    speakersFr: "Experts financiers, représentants bancaires",
    type: "workshop" as const,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    titleAr: "منتدى الاستشراف الاقتصادي",
    titleEn: "Economic Foresight Forum",
    titleFr: "Forum de Prospective Économique",
    date: "2026-07-10",
    locationAr: "الجزائر العاصمة",
    locationEn: "Algiers",
    locationFr: "Alger",
    speakersAr: "أكاديميون، باحثون، خبراء دوليون",
    speakersEn: "Academics, researchers, international experts",
    speakersFr: "Universitaires, chercheurs, experts internationaux",
    type: "forum" as const,
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function EventsPage() {
  const t = useTranslations("events");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const filteredEvents = events;

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
          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === "upcoming"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t("upcoming")}
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === "past"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t("past")}
            </button>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="group hover:shadow-lg transition-all overflow-hidden">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <Image
                    src={event.image}
                    alt={locale === "ar" ? event.titleAr : locale === "fr" ? event.titleFr : event.titleEn}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5">
                    <div className="text-white">
                      <div className="text-4xl font-bold">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-sm text-white/85">
                        {new Date(event.date).toLocaleDateString(
                          locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-FR" : "en-US",
                          { month: "long", year: "numeric" }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge variant="turquoise" className="mb-3">
                    {event.type === "conference"
                      ? locale === "ar" ? "مؤتمر" : locale === "fr" ? "Conférence" : "Conference"
                      : event.type === "workshop"
                      ? locale === "ar" ? "ورشة" : locale === "fr" ? "Atelier" : "Workshop"
                      : locale === "ar" ? "منتدى" : locale === "fr" ? "Forum" : "Forum"}
                  </Badge>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {locale === "ar" ? event.titleAr : locale === "fr" ? event.titleFr : event.titleEn}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {locale === "ar" ? event.locationAr : locale === "fr" ? event.locationFr : event.locationEn}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {locale === "ar" ? event.speakersAr : locale === "fr" ? event.speakersFr : event.speakersEn}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="rounded-full flex-1" asChild>
                      <a href="#">
                        {t("register")}
                        <Arrow className="h-3.5 w-3.5" />
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
