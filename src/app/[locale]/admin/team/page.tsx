import { UserPlus } from "lucide-react";
import { addLeadershipMember } from "../actions";
import { LeadershipEditor } from "@/components/admin/LeadershipEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { getLeadershipMembers } from "@/lib/leadership-data";
import { AdminForm } from "@/components/admin/AdminForm";

const input = "mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary";
const area = "mt-1 min-h-28 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 outline-none focus:border-primary";

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const members = await getLeadershipMembers();

  return (
    <div className="mx-auto max-w-5xl">
      <header>
        <h1 className="text-3xl font-bold">إدارة فريق العمل</h1>
        <p className="mt-2 text-sm text-slate-500">أضف أعضاء الفريق وعدّل بياناتهم وإنجازاتهم.</p>
      </header>

      <AdminForm action={addLeadershipMember.bind(null, locale)} locale={locale} className="mt-8 rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold"><UserPlus className="h-5 w-5 text-primary" />إضافة عضو جديد</h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <fieldset dir="rtl" className="rounded-xl border p-3 sm:p-4">
            <legend className="px-2 text-sm font-bold">العربية</legend>
            <label className="block text-xs font-semibold">الاسم<input name="nameAr" required className={input} /></label>
            <label className="mt-3 block text-xs font-semibold">المنصب<input name="roleAr" required className={input} /></label>
            <label className="mt-3 block text-xs font-semibold">الإنجازات والمسيرة الناجحة<textarea name="achievementsAr" placeholder="اكتب كل إنجاز في سطر مستقل." className={area} /></label>
          </fieldset>
          <fieldset dir="ltr" className="rounded-xl border p-3 sm:p-4 opacity-50">
            <legend className="px-2 text-sm font-bold">Français</legend>
            <label className="block text-xs font-semibold">Nom<input name="nameFr" className={input} /></label>
            <label className="mt-3 block text-xs font-semibold">Fonction<input name="roleFr" className={input} /></label>
            <label className="mt-3 block text-xs font-semibold">Réalisations<textarea name="achievementsFr" className={area} /></label>
          </fieldset>
          <fieldset dir="ltr" className="rounded-xl border p-3 sm:p-4 opacity-50">
            <legend className="px-2 text-sm font-bold">English</legend>
            <label className="block text-xs font-semibold">Name<input name="nameEn" className={input} /></label>
            <label className="mt-3 block text-xs font-semibold">Role<input name="roleEn" className={input} /></label>
            <label className="mt-3 block text-xs font-semibold">Achievements<textarea name="achievementsEn" className={area} /></label>
          </fieldset>
        </div>
        <div className="mt-5"><ImageUploadField name="imageFile" preserveName="imageUrl" label="اختيار صورة العضو" /></div>
        <div className="mt-5 flex justify-end"><button className="w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white sm:w-auto">إضافة العضو</button></div>
      </AdminForm>

      <LeadershipEditor locale={locale} members={members} />
    </div>
  );
}
