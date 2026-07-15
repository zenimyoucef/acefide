import { UserPlus } from "lucide-react";
import { addLeadershipMember } from "../actions";
import { LeadershipEditor } from "@/components/admin/LeadershipEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { getLeadershipMembers } from "@/lib/leadership-data";

const input="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary";
const languages=[{code:"Ar",label:"العربية",dir:"rtl"},{code:"Fr",label:"Français",dir:"ltr"},{code:"En",label:"English",dir:"ltr"}] as const;

export default async function TeamPage({params}:{params:Promise<{locale:string}>}){
 const{locale}=await params;const members=await getLeadershipMembers();
 const t=locale==="ar"?{title:"إدارة فريق العمل",help:"أضف أعضاء الفريق أو عدّل بياناتهم أو احذفهم.",add:"إضافة عضو جديد",name:"الاسم",role:"المنصب",photo:"اختيار صورة العضو",button:"إضافة العضو"}:locale==="fr"?{title:"Gestion de l’équipe",help:"Ajoutez, modifiez ou supprimez les membres de l’équipe.",add:"Ajouter un membre",name:"Nom",role:"Fonction",photo:"Choisir la photo du membre",button:"Ajouter le membre"}:{title:"Team management",help:"Add, edit, or remove team members.",add:"Add a new member",name:"Name",role:"Role",photo:"Choose member photo",button:"Add member"};
 return <div className="mx-auto max-w-5xl"><header><h1 className="text-3xl font-bold">{t.title}</h1><p className="mt-2 text-sm text-slate-500">{t.help}</p></header><form action={addLeadershipMember.bind(null,locale)} className="mt-8 rounded-2xl border bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 text-xl font-bold"><UserPlus className="h-5 w-5 text-primary"/>{t.add}</h2><div className="mt-5 grid gap-5 md:grid-cols-3">{languages.map(l=><fieldset key={l.code} dir={l.dir} className="rounded-xl border p-4"><legend className="px-2 text-sm font-bold">{l.label}</legend><label className="block text-xs font-semibold">{t.name}<input name={`name${l.code}`} required className={input}/></label><label className="mt-3 block text-xs font-semibold">{t.role}<input name={`role${l.code}`} required className={input}/></label></fieldset>)}</div><div className="mt-5"><ImageUploadField name="imageFile" preserveName="imageUrl" label={t.photo}/></div><div className="mt-5 flex justify-end"><button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white">{t.button}</button></div></form><LeadershipEditor locale={locale} members={members}/></div>;
}
