"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminForm } from "@/components/admin/AdminForm";
import { deleteNews } from "../actions";

export default async function AdminNews({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">الأخبار</h1>
        <Link href="/admin/news/new" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> إضافة خبر
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 text-start">العنوان</th>
              <th>الحالة</th>
              <th>التاريخ</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {items.map((x) => (
              <tr className="border-t" key={x.id}>
                <td className="p-4 font-semibold">{x.titleAr}</td>
                <td>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${x.published ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {x.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {x.published ? "منشور" : "مسودة"}
                  </span>
                </td>
                <td className="text-slate-500">{x.createdAt.toLocaleDateString("ar")}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/news/new?edit=${x.id}`} className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark">
                      <Pencil className="h-3.5 w-3.5" /> تعديل
                    </Link>
                    <AdminForm action={deleteNews.bind(null, locale, x.id)} locale={locale}>
                      <button className="flex items-center gap-1 text-sm font-semibold text-red-700 hover:text-red-900">
                        <Trash2 className="h-3.5 w-3.5" /> حذف
                      </button>
                    </AdminForm>
                  </div>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr><td colSpan={4} className="p-8 text-center text-sm text-slate-500">لا توجد أخبار بعد.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
