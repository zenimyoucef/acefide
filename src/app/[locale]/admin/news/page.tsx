"use client";

import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

export default function AdminNewsPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div className={cn(isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("news")}</h1>
        <Button className="rounded-full">
          <Plus className="h-4 w-4" />
          {t("add")}
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder={locale === "ar" ? "بحث..." : "Search..."}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-turquoise"
              />
            </div>
          </div>
          <div className="text-center py-16 text-muted-foreground">
            <p>{locale === "ar" ? "لا توجد أخبار بعد" : locale === "fr" ? "Pas encore d'actualités" : "No news yet"}</p>
            <p className="text-sm mt-2">
              {locale === "ar" ? "انقر على 'إضافة' لإنشاء أول خبر" : locale === "fr" ? "Cliquez sur 'Ajouter' pour créer la première actualité" : "Click 'Add' to create the first news article"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
