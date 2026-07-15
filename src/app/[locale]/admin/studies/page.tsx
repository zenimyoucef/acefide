import { prisma } from "@/lib/prisma";
import { PublicationForm } from "@/components/admin/PublishingForms";
import { deletePublication } from "../actions";

export default async function AdminStudiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = await prisma.publication.findMany({ where:{category:"STUDY"}, orderBy:{createdAt:"desc"} });
  return <div className="mx-auto max-w-5xl space-y-10"><header><h1 className="text-3xl font-bold">Economic studies</h1><p className="mt-2 text-sm text-slate-500">Publish research and economic studies with a downloadable PDF.</p></header><PublicationForm locale={locale} fixedCategory="STUDY"/><section><h2 className="mb-4 text-xl font-bold">Saved studies</h2><div className="overflow-hidden rounded-xl border bg-white">{items.length?items.map(x=><div key={x.id} className="flex items-center justify-between gap-4 border-b p-4 last:border-0"><div><p className="font-semibold">{locale==="ar"?x.titleAr:locale==="fr"?x.titleFr:x.titleEn}</p><p className="mt-1 text-xs text-slate-500">{x.published?"Published":"Draft"}</p></div><form action={deletePublication.bind(null,locale,x.id)}><button className="text-sm font-semibold text-red-700">Delete</button></form></div>):<p className="p-8 text-center text-sm text-slate-500">No studies saved yet.</p>}</div></section></div>;
}
