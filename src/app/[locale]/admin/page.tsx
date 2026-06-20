"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Newspaper,
  Calendar,
  FileText,
  BookOpen,
  Handshake,
  Users,
  MessageSquare,
  Mail,
  Settings,
  BarChart3,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const adminCards = [
  { key: "news", icon: Newspaper, href: "/admin/news", count: 0 },
  { key: "events", icon: Calendar, href: "/admin/events", count: 0 },
  { key: "studies", icon: FileText, href: "/admin/studies", count: 0 },
  { key: "publications", icon: BookOpen, href: "/admin/publications", count: 0 },
  { key: "partners", icon: Handshake, href: "/admin/partners", count: 0 },
  { key: "members", icon: Users, href: "/admin/members", count: 0 },
  { key: "consultations", icon: MessageSquare, href: "/admin/consultations", count: 0 },
  { key: "subscribers", icon: Mail, href: "/admin/subscribers", count: 0 },
];

export default function AdminDashboard() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className={cn(isRtl && "font-arabic", "min-h-screen bg-muted/30")} dir={isRtl ? "rtl" : "ltr"}>
      <div className="gradient-primary py-12">
        <div className="container-content">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <BarChart3 className="h-8 w-8" />
                {t("dashboard")}
              </h1>
            </div>
            <Link
              href="/"
              className="text-white/70 hover:text-white text-sm flex items-center gap-2 transition-colors"
            >
              {locale === "ar" ? "العودة للموقع" : locale === "fr" ? "Retour au site" : "Back to site"}
              <Arrow className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container-content py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/5 to-turquoise/5 border-primary/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("members")}</p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-turquoise/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-turquoise" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("consultations")}</p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Newspaper className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("news")}</p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-turquoise/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-turquoise" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("events")}</p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {adminCards.map((card) => (
            <Link key={card.key} href={card.href}>
              <Card className="group hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-turquoise/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <card.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Arrow className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-semibold text-foreground">{t(card.key)}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {card.count} {locale === "ar" ? "عنصر" : locale === "fr" ? "éléments" : "items"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Content Management */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{t("content")}</CardTitle>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/content"
                  className="px-4 py-2 rounded-lg bg-muted text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  {locale === "ar" ? "الصفحة الرئيسية" : locale === "fr" ? "Page d'accueil" : "Home Page"}
                </Link>
                <Link
                  href="/admin/content"
                  className="px-4 py-2 rounded-lg bg-muted text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  {locale === "ar" ? "SEO" : "SEO"}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
