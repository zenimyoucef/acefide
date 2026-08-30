import { Trash2, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminForm } from "@/components/admin/AdminForm";
import { PublicationForm } from "@/components/admin/PublishingForms";
import { deletePublication } from "../actions";

export default async function AdminStudies({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = await prisma.publication.findMany({ where: { category: "STUDY" }, orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header>
        <h1 className="text-3xl font-bold">الدراسات الاقتصادية</h1>
        <p className="mt-2 text-sm text-slate-500">نشر الأبحاث والدراسات الاقتصادية مع مستند قابل للتحميل.</p>
      </header>

      <PublicationForm locale={locale} fixedCategory="STUDY" />

      <section>
        <h2 className="mb-4 text-xl font-bold">الدراسات المحفوظة</h2>
        <div className="overflow-hidden rounded-xl border bg-white">
          {items.length ? items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 border-b p-4 last:border-0">
              <div>
                <p className="font-semibold">{item.titleAr}</p>
                <p className="mt-1 text-xs text-slate-500">
                  <span className={`inline-flex items-center gap-1 ${item.published ? "text-green-600" : "text-slate-400"}`}>
                    {item.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {item.published ? "منشور" : "مسودة"}
                  </span>
                </p>
              </div>
              <AdminForm action={deletePublication.bind(null, locale, item.id)} locale={locale}>
                <button className="flex items-center gap-1 text-sm font-semibold text-red-700 hover:text-red-900">
                  <Trash2 className="h-3.5 w-3.5" /> حذف
                </button>
              </AdminForm>
            </div>
          )) : <p className="p-8 text-center text-sm text-slate-500">لا توجد دراسات بعد.</p>}
        </div>
      </section>
    </div>
  );
}
