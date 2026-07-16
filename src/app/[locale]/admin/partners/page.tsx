import Image from "next/image";
import { Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PartnerForm } from "@/components/admin/PublishingForms";
import { deletePartner } from "../actions";

export default async function AdminPartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = await prisma.partner.findMany({ orderBy:[{order:"asc"},{createdAt:"desc"}] });
  return <div className="mx-auto max-w-5xl space-y-10"><header><h1 className="text-3xl font-bold">Partners</h1><p className="mt-2 text-sm text-slate-500">Add organizations that collaborate with ACEFIDE and control where they appear.</p></header><PartnerForm locale={locale}/><section><h2 className="mb-4 text-xl font-bold">Saved partners</h2><div className="overflow-hidden rounded-xl border bg-white">{items.length?items.map(x=><div key={x.id} className="flex items-center justify-between gap-4 border-b p-4 last:border-0"><div className="flex min-w-0 items-center gap-4"><div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-slate-50 p-2">{x.logo?<Image src={x.logo} alt={`${locale==="ar"?x.nameAr:locale==="fr"?x.nameFr:x.nameEn} logo`} width={80} height={64} className="h-full w-full object-contain"/>:<Building2 className="h-7 w-7 text-slate-400"/>}</div><div className="min-w-0"><p className="truncate font-semibold">{locale==="ar"?x.nameAr:locale==="fr"?x.nameFr:x.nameEn}</p><p className="mt-1 text-xs text-slate-500">{x.category.replaceAll("_"," ")} · Order {x.order} · {x.published?"Published":"Draft"}</p></div></div><form action={deletePartner.bind(null,locale,x.id)}><button className="text-sm font-semibold text-red-700">Delete</button></form></div>):<p className="p-8 text-center text-sm text-slate-500">No partners saved yet.</p>}</div></section></div>;
}
