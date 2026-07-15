"use client";
import { useEffect, useState } from "react";
import { Link2 } from "lucide-react";
import { useLocale } from "next-intl";

function toSlug(value: string) { return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80); }
const copy = {
  en:{label:"Page link",help:"Created automatically from the English title.",waiting:"Enter the English title below to create the link"},
  fr:{label:"Lien de la page",help:"Créé automatiquement à partir du titre anglais.",waiting:"Saisissez le titre anglais ci-dessous pour créer le lien"},
  ar:{label:"رابط الصفحة",help:"يُنشأ تلقائيًا من العنوان الإنجليزي.",waiting:"أدخل العنوان الإنجليزي أدناه لإنشاء الرابط"},
} as const;

export function FriendlySlugField() {
  const locale=useLocale();
  const t=copy[locale as keyof typeof copy]||copy.en; const [slug,setSlug]=useState("");
  useEffect(()=>{const source=document.querySelector<HTMLInputElement>('[name="titleEn"], [name="nameEn"]');if(!source)return;const update=()=>setSlug(toSlug(source.value));update();source.addEventListener("input",update);return()=>source.removeEventListener("input",update);},[]);
  return <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4"><div className="flex items-start gap-3"><Link2 className="mt-0.5 h-5 w-5 shrink-0 text-primary"/><div className="min-w-0 flex-1"><p className="block text-sm font-bold text-slate-900">{t.label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{t.help}</p><input type="hidden" name="slug" value={slug}/><div className="mt-3 truncate rounded-lg border bg-white px-3 py-2 text-sm text-slate-600">{slug?<span><span className="text-slate-400">/…/</span>{slug}</span>:<span className="italic text-slate-400">{t.waiting}</span>}</div></div></div></div>;
}
