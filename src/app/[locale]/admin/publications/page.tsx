import { AdminForm } from "@/components/admin/AdminForm";
import { PublicationForm } from "@/components/admin/PublishingForms";
import { prisma } from "@/lib/prisma";
import { deletePublication } from "../actions";

export default async function AdminPublicationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = await prisma.publication.findMany({ where: { category: { not: "STUDY" } }, orderBy: { createdAt: "desc" } });
  return <div className="mx-auto max-w-5xl space-y-10"><header><h1 className="text-3xl font-bold">Publications</h1><p className="mt-2 text-sm text-slate-500">Publish reports, analyses, and policy briefs with downloadable documents.</p></header><PublicationForm locale={locale}/><section><h2 className="mb-4 text-xl font-bold">Saved publications</h2><div className="overflow-hidden rounded-xl border bg-white">{items.length ? items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 border-b p-4 last:border-0"><div><p className="font-semibold">{locale === "ar" ? item.titleAr : locale === "fr" ? item.titleFr : item.titleEn}</p><p className="mt-1 text-xs text-slate-500">{item.category.replaceAll("_", " ")} · {item.published ? "Published" : "Draft"}</p></div><AdminForm action={deletePublication.bind(null, locale, item.id)} locale={locale}><button className="text-sm font-semibold text-red-700">Delete</button></AdminForm></div>) : <p className="p-8 text-center text-sm text-slate-500">No publications saved yet.</p>}</div></section></div>;
}
