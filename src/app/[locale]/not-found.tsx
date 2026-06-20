"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";

export default function LocaleNotFound() {
  const t = useTranslations("common");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div
      className={cn(
        "min-h-[80vh] flex items-center justify-center bg-background",
        isRtl && "font-arabic"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-8xl font-bold text-gradient mb-4">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-4">
          {t("notFound")}
        </h1>
        <p className="text-muted-foreground mb-8">
          {locale === "ar"
            ? "الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
            : locale === "fr"
            ? "La page que vous recherchez n'existe pas ou a été déplacée."
            : "The page you are looking for does not exist or has been moved."}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
        >
          <Home className="h-4 w-4" />
          {t("backToHome")}
        </Link>
      </div>
    </div>
  );
}
