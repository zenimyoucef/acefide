import Image from "next/image";
import { Building2, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminForm } from "@/components/admin/AdminForm";
import { PartnerForm } from "@/components/admin/PublishingForms";
import { deletePartner } from "../actions";

const categoryLabels: Record<string, string> = {
  INSTITUTIONAL: "مؤسساتي",
  GOVERNMENT: "حكومي",
  INTERNATIONAL: "دولي",
  UNIVERSITY: "جامعي",
  PRIVATE: "قطاع خاص",
};

export default async function AdminPartners({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = await prisma.partner.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header>
        <h1 className="text-3xl font-bold">الشركاء</h1>
        <p className="mt-2 text-sm text-slate-500">إضافة المنظمات التي تتعاون مع المركز والتحكم في كيفية ظهورها.</p>
      </header>

      <PartnerForm locale={locale} />

      <section>
        <h2 className="mb-4 text-xl font-bold">الشركاء المحفوظون</h2>
        <div className="overflow-hidden rounded-xl border bg-white">
          {items.length ? items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 border-b p-4 last:border-0">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-slate-50 p-2">
                  {item.logo ? <Image src={item.logo} alt={`${item.nameAr} logo`} width={80} height={64} className="h-full w-full object-contain" /> : <Building2 className="h-7 w-7 text-slate-400" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{item.nameAr}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {categoryLabels[item.category] || item.category} · الترتيب {item.order} ·{" "}
                    <span className={`inline-flex items-center gap-1 ${item.published ? "text-green-600" : "text-slate-400"}`}>
                      {item.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {item.published ? "منشور" : "مسودة"}
                    </span>
                  </p>
                </div>
              </div>
              <AdminForm action={deletePartner.bind(null, locale, item.id)} locale={locale}>
                <button className="flex items-center gap-1 text-sm font-semibold text-red-700 hover:text-red-900">
                  <Trash2 className="h-3.5 w-3.5" /> حذف
                </button>
              </AdminForm>
            </div>
          )) : <p className="p-8 text-center text-sm text-slate-500">لا يوجد شركاء بعد.</p>}
        </div>
      </section>
    </div>
  );
}
