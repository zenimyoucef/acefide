"use client";

import { useLocale } from "next-intl";
import { CalendarDays, Facebook, Handshake, MapPinned } from "lucide-react";

export function ImpactSection() {
  const locale = useLocale() as "ar" | "fr" | "en";
  const items = [
    { icon: CalendarDays, value: "2022", label: { ar: "الانطلاق الرسمي", fr: "Lancement officiel", en: "Official launch" }[locale] },
    { icon: Facebook, value: "19K+", label: { ar: "متابع على فيسبوك", fr: "abonnés Facebook", en: "Facebook followers" }[locale] },
    { icon: Handshake, value: "4+", label: { ar: "علاقات مؤسساتية موثقة", fr: "relations institutionnelles documentées", en: "documented institutional relationships" }[locale] },
    { icon: MapPinned, value: locale === "ar" ? "وطني" : locale === "fr" ? "National" : "National", label: { ar: "نطاق النشاط", fr: "rayonnement", en: "scope" }[locale] },
  ];
  return <section className="border-y border-white/10 bg-[#0b1f33] py-8 text-white" dir={locale === "ar" ? "rtl" : "ltr"}><div className="container-content grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-4">{items.map(({ icon: Icon, value, label }) => <div key={label} className="flex min-h-32 flex-col items-center justify-center gap-2 bg-[#0b1f33] p-5 text-center"><Icon className="mb-1 h-5 w-5 text-[#e5c978]"/><strong className="text-2xl font-extrabold tracking-tight">{value}</strong><span className="text-xs font-medium text-white/60 sm:text-sm">{label}</span></div>)}</div></section>;
}
