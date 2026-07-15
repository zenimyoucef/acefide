import { prisma } from "@/lib/prisma";
import { EventForm } from "@/components/admin/PublishingForms";
import { deleteEvent } from "../actions";

export default async function AdminEventsPage({ params, searchParams }: { params: Promise<{ locale: string }>;searchParams:Promise<{edit?:string}> }) {
  const { locale } = await params;
  const {edit}=await searchParams;
  const items = await prisma.event.findMany({ orderBy: { date: "desc" } });
  const initial=edit?items.find(x=>x.id===edit):null;
  return <div className="mx-auto max-w-5xl space-y-10"><header><h1 className="text-3xl font-bold">{initial?"Edit event":"Events"}</h1><p className="mt-2 text-sm text-slate-500">Create activities, meetings, participations, and media appearances.</p></header><EventForm locale={locale} initial={initial}/><section><h2 className="mb-4 text-xl font-bold">Saved events</h2><div className="overflow-hidden rounded-xl border bg-white">{items.length?items.map(x=><div key={x.id} className="flex flex-col gap-3 border-b p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{locale==="ar"?x.titleAr:locale==="fr"?x.titleFr:x.titleEn}</p><p className="mt-1 text-xs text-slate-500">{x.date.toLocaleString()} · {x.category.replaceAll("_"," ")} · {x.published?"Published":"Draft"}</p></div><div className="flex items-center gap-4"><a href={`/${locale}/admin/events?edit=${x.id}`} className="text-sm font-semibold text-primary">Edit</a><form action={deleteEvent.bind(null,locale,x.id)}><button className="text-sm font-semibold text-red-700">Delete</button></form></div></div>):<p className="p-8 text-center text-sm text-slate-500">No events saved yet.</p>}</div></section></div>;
}
