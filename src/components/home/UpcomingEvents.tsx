"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const events = [
  {
    id: 1,
    title: "المؤتمر السنوي للاستثمار والمقاولاتية",
    titleEn: "Annual Conference on Investment and Entrepreneurship",
    date: "2026-09-15",
    location: "الجزائر العاصمة",
    locationEn: "Algiers",
    type: "conference",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "ورشة عمل: آليات تمويل الشركات الناشئة",
    titleEn: "Workshop: Startup Financing Mechanisms",
    date: "2026-08-20",
    location: "الجزائر العاصمة",
    locationEn: "Algiers",
    type: "workshop",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "منتدى الاستشراف الاقتصادي",
    titleEn: "Economic Foresight Forum",
    date: "2026-07-10",
    location: "الجزائر العاصمة",
    locationEn: "Algiers",
    type: "forum",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
  },
];

export function UpcomingEvents() {
  const t = useTranslations("events");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section
      className={cn(
        "py-20",
        isRtl && "font-arabic"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="container-content scroll-reveal">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("upcoming")}
            </h2>
            <div className="w-16 h-1 bg-turquoise rounded-full" />
          </div>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/events">
              {t("viewAll")}
              <Arrow className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card
              key={event.id}
              className="group overflow-hidden hover:shadow-lg transition-all relative"
            >
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="turquoise">
                  {event.type === "conference"
                    ? locale === "ar" ? "مؤتمر" : "Conference"
                    : event.type === "workshop"
                    ? locale === "ar" ? "ورشة" : "Workshop"
                    : locale === "ar" ? "منتدى" : "Forum"}
                </Badge>
              </div>
              <div className="relative aspect-video overflow-hidden bg-muted">
                <Image
                  src={event.image}
                  alt={locale === "ar" ? event.title : event.titleEn}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <div className="text-white">
                    <div className="text-3xl font-bold">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-sm text-white/85">
                      {new Date(event.date).toLocaleDateString(locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-FR" : "en-US", { month: "long", year: "numeric" })}
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {locale === "ar" ? event.title : event.titleEn}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {locale === "ar" ? event.location : event.locationEn}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="mt-4 rounded-full w-full"
                  asChild
                >
                  <Link href={`/events/${event.id}`}>
                    {t("details")}
                    <Arrow className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
