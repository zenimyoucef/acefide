"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminForm } from "@/components/admin/AdminForm";
import { EventForm } from "@/components/admin/PublishingForms";
import { deleteEvent } from "../actions";

const categoryLabels: Record<string, string> = {
  ORGANIZED: "فعالية منظمة",
  PARTICIPATION: "مشاركة",
  MEETING: "لقاء",
  MEDIA: "ظهور إعلامي",
};

export default async function AdminEvents({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ edit?: string }> }) {
  const { locale } = await params;
  const { edit } = await searchParams;
  const initial = edit ? await prisma.event.findUnique({ where: { id: edit } }) : null;
  const items = await prisma.event.findMany({ orderBy: { date: "desc" } });

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header>
        <h1 className="text-3xl font-bold">{initial ? "تعديل فعالية" : "الفعاليات"}</h1>
        <p className="mt-2 text-sm text-slate-500">إنشاء الأنشطة واللقاءات والم participation والظهور الإعلامية.</p>
      </header>

      <EventForm locale={locale} initial={initial} />

      <section>
        <h2 className="mb-4 text-xl font-bold">الفعاليات المحفوظة</h2>
        <div className="overflow-hidden rounded-xl border bg-white">
          {items.length ? items.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 border-b p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{item.titleAr}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.date.toLocaleDateString("ar")} · {categoryLabels[item.category] || item.category} ·{" "}
                  <span className={`inline-flex items-center gap-1 ${item.published ? "text-green-600" : "text-slate-400"}`}>
                    {item.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {item.published ? "منشور" : "مسودة"}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <a href={`/admin/events?edit=${item.id}`} className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark">
                  <Pencil className="h-3.5 w-3.5" /> تعديل
                </a>
                <AdminForm action={deleteEvent.bind(null, locale, item.id)} locale={locale}>
                  <button className="flex items-center gap-1 text-sm font-semibold text-red-700 hover:text-red-900">
                    <Trash2 className="h-3.5 w-3.5" /> حذف
                  </button>
                </AdminForm>
              </div>
            </div>
          )) : <p className="p-8 text-center text-sm text-slate-500">لا توجد فعاليات بعد.</p>}
        </div>
      </section>
    </div>
  );
}
