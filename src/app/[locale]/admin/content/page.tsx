"use client";

import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function AdminContentPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "ar";
  return (
    <div className={cn(isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <h1 className="text-2xl font-bold text-foreground mb-6">{t("content")}</h1>
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <Settings className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">{locale === "ar" ? "إدارة المحتوى" : "Content Management"}</h2>
              <p className="text-sm text-muted-foreground">{locale === "ar" ? "تخصيص محتوى الصفحات الرئيسية" : "Customize homepage content"}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
              <span className="text-sm font-medium">{locale === "ar" ? "النص الرئيسي للصفحة الرئيسية" : "Hero Section Text"}</span>
              <span className="text-xs text-muted-foreground">{locale === "ar" ? "قابل للتعديل" : "Editable"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
