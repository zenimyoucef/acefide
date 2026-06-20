"use client";

import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminPartnersPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "ar";
  return (
    <div className={cn(isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("partners")}</h1>
        <Button className="rounded-full"><Plus className="h-4 w-4" />{t("add")}</Button>
      </div>
      <Card><CardContent className="p-6"><div className="text-center py-16 text-muted-foreground"><p>{locale === "ar" ? "لا يوجد شركاء بعد" : "No partners yet"}</p></div></CardContent></Card>
    </div>
  );
}
