import { Trash2 } from "lucide-react";
import type { LeadershipMember, Locale } from "@/lib/structure";
import { removeLeadershipMember, saveLeadershipMember } from "@/app/[locale]/admin/actions";
import { ImageUploadField } from "./ImageUploadField";

const input = "mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary";
const area = "mt-1 min-h-32 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 outline-none focus:border-primary";
const languages = [
  { code: "Ar", locale: "ar", label: "العربية", dir: "rtl" },
  { code: "Fr", locale: "fr", label: "Français", dir: "ltr" },
  { code: "En", locale: "en", label: "English", dir: "ltr" },
] as const;

export function LeadershipEditor({ locale, members }: { locale: string; members: LeadershipMember[] }) {
  const t = locale === "ar"
    ? { title: "أعضاء الفريق", help: "عدّل بيانات الأعضاء وإنجازاتهم وصورهم.", upload: "اختيار صورة جديدة", name: "الاسم", role: "المنصب", achievements: "الإنجازات والمسيرة الناجحة", achievementsHelp: "اكتب كل إنجاز في سطر مستقل.", save: "حفظ التغييرات", remove: "حذف العضو", protected: "لا يمكن حذف الرئيس" }
    : locale === "fr"
      ? { title: "Membres de l’équipe", help: "Modifiez les profils, réalisations et photos.", upload: "Choisir une nouvelle photo", name: "Nom", role: "Fonction", achievements: "Réalisations et parcours", achievementsHelp: "Écrivez une réalisation par ligne.", save: "Enregistrer", remove: "Supprimer", protected: "Le président ne peut pas être supprimé" }
      : { title: "Team members", help: "Edit member profiles, achievements, and photos.", upload: "Choose a new photo", name: "Name", role: "Role", achievements: "Achievements and success story", achievementsHelp: "Write one achievement per line.", save: "Save changes", remove: "Remove member", protected: "The president cannot be removed" };
  const activeLocale = (locale === "ar" || locale === "fr" ? locale : "en") as Locale;

  return (
    <section className="mt-10">
      <div className="mb-6"><h2 className="text-2xl font-bold">{t.title}</h2><p className="mt-2 text-sm text-slate-500">{t.help}</p></div>
      <div className="space-y-6">
        {members.map((member) => (
          <article key={member.id} className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
            <form action={saveLeadershipMember.bind(null, locale, member.id)}>
              <div className="mb-5 flex items-center gap-3">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white ${member.accent}`}>{member.initials}</span>
                <div className="min-w-0"><h3 className="truncate font-bold">{member.name[activeLocale]}</h3><p className="truncate text-sm text-slate-500">{member.role[activeLocale]}</p></div>
              </div>
              <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
                <ImageUploadField name="imageFile" preserveName="imageUrl" label={t.upload} currentImage={member.imageUrl} />
                <div className="space-y-4">
                  {languages.map((language) => (
                    <fieldset key={language.code} dir={language.dir} className="rounded-xl border p-3 sm:p-4">
                      <legend className="px-2 text-sm font-bold">{language.label}</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block text-xs font-semibold">{t.name}<input name={`name${language.code}`} required defaultValue={member.name[language.locale]} className={input} /></label>
                        <label className="block text-xs font-semibold">{t.role}<input name={`role${language.code}`} required defaultValue={member.role[language.locale]} className={input} /></label>
                      </div>
                      <label className="mt-3 block text-xs font-semibold">{t.achievements}<textarea name={`achievements${language.code}`} defaultValue={member.achievements?.[language.locale] || ""} placeholder={t.achievementsHelp} className={area} /></label>
                    </fieldset>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex justify-end"><button className="w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white sm:w-auto">{t.save}</button></div>
            </form>
            <div className="mt-4 border-t pt-4">{member.id === "president" ? <p className="text-xs text-slate-400">{t.protected}</p> : <form action={removeLeadershipMember.bind(null, locale, member.id)}><button className="inline-flex items-center gap-2 text-sm font-semibold text-red-700"><Trash2 className="h-4 w-4" />{t.remove}</button></form>}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
