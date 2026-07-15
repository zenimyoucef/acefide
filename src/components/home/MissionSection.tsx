"use client";
import { useLocale } from "next-intl";
import { Building2, FileCheck2, Handshake, Lightbulb, Rocket, TrendingUp } from "lucide-react";

const objectives = [
  { icon: TrendingUp, ar: "تحسين مناخ الاستثمار", fr: "Améliorer le climat d’investissement", en: "Improve the investment climate" },
  { icon: Rocket, ar: "تشجيع المقاولاتية", fr: "Encourager l’entrepreneuriat", en: "Encourage entrepreneurship" },
  { icon: Lightbulb, ar: "دراسات استشرافية", fr: "Études prospectives", en: "Provide foresight studies" },
  { icon: Building2, ar: "دعم المستثمرين وحاملي المشاريع", fr: "Soutenir les investisseurs et porteurs de projets", en: "Support investors and project owners" },
  { icon: Handshake, ar: "تعزيز التعاون المؤسساتي", fr: "Renforcer la coopération institutionnelle", en: "Strengthen institutional cooperation" },
  { icon: FileCheck2, ar: "اقتراح الحلول والتوصيات", fr: "Proposer des solutions et recommandations", en: "Contribute solutions and recommendations" },
];
export function MissionSection() {
  const locale = useLocale() as "ar" | "fr" | "en";
  const title = locale === "ar" ? "أهدافنا" : locale === "fr" ? "Nos objectifs" : "Our objectives";
  return <section className="bg-[#f7f8f6] py-20" dir={locale === "ar" ? "rtl" : "ltr"}><div className="container-content"><div className="mb-12 max-w-2xl"><span className="text-sm font-bold uppercase tracking-widest text-primary">ACEFIDE</span><h2 className="mt-3 text-3xl font-bold text-[#0b1f33] md:text-4xl">{title}</h2></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{objectives.map(({ icon: Icon, ...item }, index) => <article key={item.en} className="group rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"><div className="mb-6 flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon /></div><span className="text-sm font-semibold text-[#c8a24a]">0{index + 1}</span></div><h3 className="text-lg font-semibold text-[#111827]">{item[locale]}</h3></article>)}</div></div></section>;
}
