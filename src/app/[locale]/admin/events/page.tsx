import { prisma } from "@/lib/prisma";
import { AdminForm } from "@/components/admin/AdminForm";
import { EventForm } from "@/components/admin/PublishingForms";
import { deleteEvent } from "../actions";

export default async function AdminEventsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ edit?: string }> }) {
  const { locale } = await params;
  const { edit } = await searchParams;
  const items = await prisma.event.findMany({ orderBy: { date: "desc" } });
  const initial = edit ? items.find((item) => item.id === edit) : null;
  return <div className="mx-auto max-w-5xl space-y-10"><header><h1 className="text-3xl font-bold">{initial ? "Edit event" : "Events"}</h1><p className="mt-2 text-sm text-slate-500">Create activities, meetings, participations, and media appearances.</p></header><EventForm locale={locale} initial={initial}/><section><h2 className="mb-4 text-xl font-bold">Saved events</h2><div className="overflow-hidden rounded-xl border bg-white">{items.length ? items.map((item) => <div key={item.id} className="flex flex-col gap-3 border-b p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{locale === "ar" ? item.titleAr : locale === "fr" ? item.titleFr : item.titleEn}</p><p className="mt-1 text-xs text-slate-500">{item.date.toLocaleString()} · {item.category.replaceAll("_", " ")} · {item.published ? "Published" : "Draft"}</p></div><div className="flex items-center gap-4"><a href={`/${locale}/admin/events?edit=${item.id}`} className="text-sm font-semibold text-primary">Edit</a><AdminForm action={deleteEvent.bind(null, locale, item.id)} locale={locale}><button className="text-sm font-semibold text-red-700">Delete</button></AdminForm></div></div>) : <p className="p-8 text-center text-sm text-slate-500">No events saved yet.</p>}</div></section></div>;
}
