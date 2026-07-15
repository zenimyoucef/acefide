import { prisma } from "@/lib/prisma";
import { PublicationForm } from "@/components/admin/PublishingForms";
import { deletePublication } from "../actions";

export default async function AdminPublicationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = await prisma.publication.findMany({ where:{category:{not:"STUDY"}}, orderBy:{createdAt:"desc"} });
  return <div className="mx-auto max-w-5xl space-y-10"><header><h1 className="text-3xl font-bold">Publications</h1><p className="mt-2 text-sm text-slate-500">Publish reports, analyses, and policy briefs with downloadable PDFs.</p></header><PublicationForm locale={locale}/><Saved items={items} locale={locale}/></div>;
}
function Saved({items,locale}:{items:Awaited<ReturnType<typeof prisma.publication.findMany>>;locale:string}){return <section><h2 className="mb-4 text-xl font-bold">Saved publications</h2><div className="overflow-hidden rounded-xl border bg-white">{items.length?items.map(x=><div key={x.id} className="flex items-center justify-between gap-4 border-b p-4 last:border-0"><div><p className="font-semibold">{locale==="ar"?x.titleAr:locale==="fr"?x.titleFr:x.titleEn}</p><p className="mt-1 text-xs text-slate-500">{x.category.replaceAll("_"," ")} · {x.published?"Published":"Draft"}</p></div><form action={deletePublication.bind(null,locale,x.id)}><button className="text-sm font-semibold text-red-700">Delete</button></form></div>):<p className="p-8 text-center text-sm text-slate-500">No publications saved yet.</p>}</div></section>}
