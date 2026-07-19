import { UserPlus } from "lucide-react";
import { addLeadershipMember } from "../actions";
import { LeadershipEditor } from "@/components/admin/LeadershipEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { getLeadershipMembers } from "@/lib/leadership-data";
import { AdminForm } from "@/components/admin/AdminForm";

const input = "mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary";
const area = "mt-1 min-h-28 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 outline-none focus:border-primary";
const languages = [
  { code: "Ar", label: "العربية", dir: "rtl" },
  { code: "Fr", label: "Français", dir: "ltr" },
  { code: "En", label: "English", dir: "ltr" },
] as const;

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const members = await getLeadershipMembers();
  const t = locale === "ar"
    ? { title: "إدارة فريق العمل", help: "أضف أعضاء الفريق وعدّل بياناتهم وإنجازاتهم.", add: "إضافة عضو جديد", name: "الاسم", role: "المنصب", achievements: "الإنجازات والمسيرة الناجحة", achievementsHelp: "اكتب كل إنجاز في سطر مستقل.", photo: "اختيار صورة العضو", button: "إضافة العضو" }
    : locale === "fr"
      ? { title: "Gestion de l’équipe", help: "Ajoutez les membres et gérez leurs profils et réalisations.", add: "Ajouter un membre", name: "Nom", role: "Fonction", achievements: "Réalisations et parcours", achievementsHelp: "Écrivez une réalisation par ligne.", photo: "Choisir la photo du membre", button: "Ajouter le membre" }
      : { title: "Team management", help: "Add members and manage their profiles and achievements.", add: "Add a new member", name: "Name", role: "Role", achievements: "Achievements and success story", achievementsHelp: "Write one achievement per line.", photo: "Choose member photo", button: "Add member" };

  return (
    <div className="mx-auto max-w-5xl">
      <header><h1 className="text-3xl font-bold">{t.title}</h1><p className="mt-2 text-sm text-slate-500">{t.help}</p></header>
      <AdminForm action={addLeadershipMember.bind(null, locale)} locale={locale} className="mt-8 rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold"><UserPlus className="h-5 w-5 text-primary" />{t.add}</h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {languages.map((language) => (
            <fieldset key={language.code} dir={language.dir} className="rounded-xl border p-3 sm:p-4">
              <legend className="px-2 text-sm font-bold">{language.label}</legend>
              <label className="block text-xs font-semibold">{t.name}<input name={`name${language.code}`} required className={input} /></label>
              <label className="mt-3 block text-xs font-semibold">{t.role}<input name={`role${language.code}`} required className={input} /></label>
              <label className="mt-3 block text-xs font-semibold">{t.achievements}<textarea name={`achievements${language.code}`} placeholder={t.achievementsHelp} className={area} /></label>
            </fieldset>
          ))}
        </div>
        <div className="mt-5"><ImageUploadField name="imageFile" preserveName="imageUrl" label={t.photo} /></div>
        <div className="mt-5 flex justify-end"><button className="w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white sm:w-auto">{t.button}</button></div>
      </AdminForm>
      <LeadershipEditor locale={locale} members={members} />
    </div>
  );
}
