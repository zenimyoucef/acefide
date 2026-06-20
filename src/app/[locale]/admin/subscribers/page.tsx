"use client";

import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminSubscribersPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "ar";
  return (
    <div className={cn(isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <h1 className="text-2xl font-bold text-foreground mb-6">{t("subscribers")}</h1>
      <Card><CardContent className="p-6"><div className="text-center py-16 text-muted-foreground"><p>{locale === "ar" ? "لا يوجد مشتركون بعد" : "No subscribers yet"}</p></div></CardContent></Card>
    </div>
  );
}
