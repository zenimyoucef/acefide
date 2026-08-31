"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, Trash2 } from "lucide-react";
import { AdminForm } from "./AdminForm";
import { AvatarPositionField } from "./AvatarPositionField";
import { LeadershipAvatar } from "@/components/structure/LeadershipAvatar";
import type { LeadershipMember } from "@/lib/structure";
import { removeLeadershipMember, saveLeadershipMember } from "@/app/[locale]/admin/actions";
import { cn } from "@/lib/utils";

const input = "mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary";
const area = "mt-1 min-h-32 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 outline-none focus:border-primary";

const t = {
  title: "أعضاء الفريق",
  help: "ابحث عن العضو ثم اضغط عليه لعرض بياناته وتعديلها.",
  search: "ابحث بالاسم أو المنصب…",
  empty: "لا يوجد عضو مطابق لبحثك.",
  count: (shown: number, total: number) => (shown === total ? `${total} عضو` : `${shown} من ${total} عضو`),
  upload: "اختيار صورة جديدة",
  name: "الاسم",
  role: "المنصب",
  achievements: "الإنجازات والمسيرة الناجحة",
  achievementsHelp: "اكتب كل إنجاز في سطر مستقل.",
  save: "حفظ التغييرات",
  remove: "حذف العضو",
  protected: "لا يمكن حذف الرئيس",
};

export function LeadershipEditor({ locale, members }: { locale: string; members: LeadershipMember[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((member) =>
      [member.name.ar, member.name.fr, member.name.en, member.role.ar, member.role.fr, member.role.en]
        .some((value) => value?.toLowerCase().includes(q))
    );
  }, [members, query]);

  return (
    <section className="mt-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">{t.title}</h2>
          <p className="mt-2 text-sm text-slate-500">{t.help}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{t.count(filtered.length, members.length)}</span>
      </div>

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.search}
          aria-label={t.search}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-primary ltr:pl-10 ltr:pr-3 rtl:pr-10 rtl:pl-3"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed bg-slate-50 p-8 text-center text-sm text-slate-500">{t.empty}</p>
        )}

        {filtered.map((member) => {
          const open = openId === member.id;
          return (
            <article key={member.id} className={cn("overflow-hidden rounded-2xl border bg-white shadow-sm transition", open && "ring-1 ring-primary/30")}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : member.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 p-3 text-start transition hover:bg-slate-50 sm:p-4"
              >
                <LeadershipAvatar member={member} locale="ar" size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-slate-900">{member.name.ar}</span>
                  <span className="block truncate text-sm text-slate-500">{member.role.ar}</span>
                </span>
                <ChevronDown className={cn("h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200", open && "rotate-180")} />
              </button>

              {open && (
                <div className="border-t p-4 sm:p-6">
                  <AdminForm action={saveLeadershipMember.bind(null, locale, member.id)} locale={locale}>
                    <div className="grid items-start gap-6 lg:grid-cols-[auto_1fr]">
                      <AvatarPositionField
                        label={t.upload}
                        currentImage={member.imageUrl}
                        currentPosition={member.imagePosition}
                        initials={member.initials}
                        accent={member.accent}
                      />
                      <div className="space-y-4">
                        <fieldset dir="rtl" className="rounded-xl border p-3 sm:p-4">
                          <legend className="px-2 text-sm font-bold">العربية</legend>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block text-xs font-semibold">{t.name}<input name="nameAr" required defaultValue={member.name.ar} className={input} /></label>
                            <label className="block text-xs font-semibold">{t.role}<input name="roleAr" required defaultValue={member.role.ar} className={input} /></label>
                          </div>
                          <label className="mt-3 block text-xs font-semibold">{t.achievements}<textarea name="achievementsAr" defaultValue={member.achievements?.ar || ""} placeholder={t.achievementsHelp} className={area} /></label>
                        </fieldset>
                        <fieldset dir="ltr" className="rounded-xl border p-3 opacity-50 sm:p-4">
                          <legend className="px-2 text-sm font-bold">Français</legend>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block text-xs font-semibold">Nom<input name="nameFr" defaultValue={member.name.fr} className={input} /></label>
                            <label className="block text-xs font-semibold">Fonction<input name="roleFr" defaultValue={member.role.fr} className={input} /></label>
                          </div>
                          <label className="mt-3 block text-xs font-semibold">Réalisations<textarea name="achievementsFr" defaultValue={member.achievements?.fr || ""} className={area} /></label>
                        </fieldset>
                        <fieldset dir="ltr" className="rounded-xl border p-3 opacity-50 sm:p-4">
                          <legend className="px-2 text-sm font-bold">English</legend>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block text-xs font-semibold">Name<input name="nameEn" defaultValue={member.name.en} className={input} /></label>
                            <label className="block text-xs font-semibold">Role<input name="roleEn" defaultValue={member.role.en} className={input} /></label>
                          </div>
                          <label className="mt-3 block text-xs font-semibold">Achievements<textarea name="achievementsEn" defaultValue={member.achievements?.en || ""} className={area} /></label>
                        </fieldset>
                      </div>
                    </div>
                    <div className="mt-5 flex justify-end"><button className="w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white sm:w-auto">{t.save}</button></div>
                  </AdminForm>
                  <div className="mt-4 border-t pt-4">
                    {member.id === "president" ? (
                      <p className="text-xs text-slate-400">{t.protected}</p>
                    ) : (
                      <AdminForm action={removeLeadershipMember.bind(null, locale, member.id)} locale={locale} confirmMessage={`${t.remove}؟`}>
                        <button className="inline-flex items-center gap-2 text-sm font-semibold text-red-700"><Trash2 className="h-4 w-4" />{t.remove}</button>
                      </AdminForm>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
