import { ArrowLeft, FileText, Globe2, ImagePlus, Languages } from "lucide-react";
import { Link } from "@/lib/navigation";
import { saveNews, updateNews } from "../../actions";
import { FriendlySlugField } from "@/components/admin/FriendlySlugField";
import { MultiImageUploadField } from "@/components/admin/MultiImageUploadField";
import { prisma } from "@/lib/prisma";

const inputClass =
  "mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10";
const textareaClass =
  "mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm font-normal leading-6 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10";

const languages = [
  { code: "Ar", name: "Arabic", nativeName: "العربية", dir: "rtl" as const },
  { code: "Fr", name: "French", nativeName: "Français", dir: "ltr" as const },
  { code: "En", name: "English", nativeName: "English", dir: "ltr" as const },
];

const copy = {
  en: { back:"Back to news", heading:"Create a news article", intro:"Add the article in Arabic, French, and English. Save it as a draft until all three versions are ready.", address:"Page address", addressHelp:"This creates the article’s web address. It must be short and unique.", slug:"Address name", slugHelp:"Use lowercase English letters, numbers, and hyphens. Example: economic-forum-2026", titles:"Titles and summaries", titlesHelp:"The title and short summary appear on news cards and listing pages.", title:"Article title", titlePlaceholder:"Enter the headline readers will see", summary:"Short summary", optional:"optional", summaryPlaceholder:"Summarize the article in one or two sentences", cover:"Cover image", coverHelp:"Choose the main image displayed with this article. An uploaded file takes priority over a URL.", upload:"Upload from your computer", imageUrl:"Or use an image URL", content:"Article content", contentHelp:"Write the full article in each language. Paragraph breaks will be preserved.", fullContent:"content", contentPlaceholder:"Write the full article here…", publish:"Publish immediately", publishHelp:"Leave unchecked to save the article as a draft.", cancel:"Cancel", save:"Save article" },
  fr: { back:"Retour aux actualités", heading:"Créer un article d’actualité", intro:"Ajoutez l’article en arabe, français et anglais. Enregistrez-le comme brouillon jusqu’à ce que les trois versions soient prêtes.", address:"Adresse de la page", addressHelp:"Cette valeur crée l’adresse web de l’article. Elle doit être courte et unique.", slug:"Nom dans l’adresse", slugHelp:"Utilisez uniquement des lettres anglaises minuscules, des chiffres et des tirets. Exemple : forum-economique-2026", titles:"Titres et résumés", titlesHelp:"Le titre et le résumé court apparaissent dans les listes d’actualités.", title:"Titre de l’article", titlePlaceholder:"Saisissez le titre visible par les lecteurs", summary:"Résumé court", optional:"facultatif", summaryPlaceholder:"Résumez l’article en une ou deux phrases", cover:"Image de couverture", coverHelp:"Choisissez l’image principale de l’article. Un fichier téléversé est prioritaire sur une URL.", upload:"Téléverser depuis l’ordinateur", imageUrl:"Ou utiliser une URL d’image", content:"Contenu de l’article", contentHelp:"Rédigez l’article complet dans chaque langue. Les paragraphes seront conservés.", fullContent:"contenu", contentPlaceholder:"Rédigez l’article complet ici…", publish:"Publier immédiatement", publishHelp:"Laissez décoché pour enregistrer comme brouillon.", cancel:"Annuler", save:"Enregistrer l’article" },
  ar: { back:"العودة إلى الأخبار", heading:"إنشاء مقال إخباري", intro:"أضف المقال بالعربية والفرنسية والإنجليزية. احفظه كمسودة إلى أن تصبح النسخ الثلاث جاهزة.", address:"عنوان الصفحة", addressHelp:"تُستخدم هذه القيمة لإنشاء رابط المقال، ويجب أن تكون قصيرة وفريدة.", slug:"اسم الرابط", slugHelp:"استخدم حروفًا إنجليزية صغيرة وأرقامًا وشرطات فقط. مثال: economic-forum-2026", titles:"العناوين والملخصات", titlesHelp:"يظهر العنوان والملخص القصير في بطاقات الأخبار وصفحات القوائم.", title:"عنوان المقال", titlePlaceholder:"أدخل العنوان الذي سيظهر للقراء", summary:"ملخص قصير", optional:"اختياري", summaryPlaceholder:"لخّص المقال في جملة أو جملتين", cover:"صورة الغلاف", coverHelp:"اختر الصورة الرئيسية للمقال. الملف المرفوع له الأولوية على الرابط.", upload:"رفع صورة من الجهاز", imageUrl:"أو استخدام رابط صورة", content:"محتوى المقال", contentHelp:"اكتب المقال كاملًا بكل لغة. سيتم الحفاظ على فواصل الفقرات.", fullContent:"المحتوى", contentPlaceholder:"اكتب المقال كاملًا هنا…", publish:"النشر فورًا", publishHelp:"اتركه غير محدد لحفظ المقال كمسودة.", cancel:"إلغاء", save:"حفظ المقال" },
} as const;

export default async function NewNews({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams:Promise<{edit?:string}> }) {
  const { locale } = await params;
  const {edit}=await searchParams;const article=edit?await prisma.news.findUnique({where:{id:edit}}):null;
  const t = copy[locale as keyof typeof copy] || copy.en;

  return (
    <div className="mx-auto max-w-5xl pb-12">
      <Link href="/admin/news" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> {t.back}
      </Link>

      <div className="mb-7">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">{t.heading}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          {t.intro}
        </p>
      </div>

      <form action={article?updateNews.bind(null,locale,article.id):saveNews.bind(null, locale)} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary"><Globe2 className="h-5 w-5" /></div>
            <div>
              <h2 className="font-bold text-slate-950">{t.address}</h2>
              <p className="mt-1 text-sm text-slate-500">{t.addressHelp}</p>
            </div>
          </div>
          <FriendlySlugField />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary"><Languages className="h-5 w-5" /></div>
            <div>
              <h2 className="font-bold text-slate-950">{t.titles}</h2>
              <p className="mt-1 text-sm text-slate-500">{t.titlesHelp}</p>
            </div>
          </div>

          <div className="space-y-7">
            {languages.map((language) => (
              <fieldset key={language.code} className="rounded-xl border border-slate-200 bg-slate-50/60 p-5" dir={language.dir}>
                <legend className="px-2 text-sm font-bold text-primary">{language.name} · {language.nativeName}</legend>
                <div className="space-y-5">
                  <label htmlFor={`title${language.code}`} className="block text-sm font-semibold text-slate-800">
                    {t.title} <span className="text-red-600">*</span>
                    <input id={`title${language.code}`} name={`title${language.code}`} required defaultValue={article?.[`title${language.code}` as "titleAr"|"titleFr"|"titleEn"]||""} placeholder={t.titlePlaceholder} className={inputClass} />
                  </label>
                  <label htmlFor={`excerpt${language.code}`} className="block text-sm font-semibold text-slate-800">
                    {t.summary} <span className="font-normal text-slate-500">({t.optional})</span>
                    <textarea id={`excerpt${language.code}`} name={`excerpt${language.code}`} rows={3} defaultValue={article?.[`excerpt${language.code}` as "excerptAr"|"excerptFr"|"excerptEn"]||""} placeholder={t.summaryPlaceholder} className={textareaClass} />
                  </label>
                </div>
              </fieldset>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary"><ImagePlus className="h-5 w-5" /></div>
            <div>
              <h2 className="font-bold text-slate-950">{t.cover}</h2>
              <p className="mt-1 text-sm text-slate-500">{t.coverHelp}</p>
            </div>
          </div>
          <MultiImageUploadField label={t.upload} existingImages={article?[...new Set([article.coverImage,...article.galleryImages].filter((value):value is string=>Boolean(value)))]:[]} mainImage={article?.coverImage}/>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary"><FileText className="h-5 w-5" /></div>
            <div>
              <h2 className="font-bold text-slate-950">{t.content}</h2>
              <p className="mt-1 text-sm text-slate-500">{t.contentHelp}</p>
            </div>
          </div>
          <div className="space-y-7">
            {languages.map((language) => (
              <label key={language.code} htmlFor={`content${language.code}`} className="block text-sm font-semibold text-slate-800" dir={language.dir}>
                {language.name} {t.fullContent} · {language.nativeName} <span className="text-red-600">*</span>
                <textarea id={`content${language.code}`} name={`content${language.code}`} required rows={10} defaultValue={article?.[`content${language.code}` as "contentAr"|"contentFr"|"contentEn"]||""} placeholder={t.contentPlaceholder} className={textareaClass} />
              </label>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" name="published" defaultChecked={article?.published} className="mt-1 h-4 w-4 rounded border-slate-300 accent-primary" />
            <span>
              <span className="block text-sm font-bold text-slate-900">{t.publish}</span>
              <span className="mt-1 block text-xs text-slate-500">{t.publishHelp}</span>
            </span>
          </label>
          <div className="flex items-center gap-3">
            <Link href="/admin/news" className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">{t.cancel}</Link>
            <button type="submit" className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary/90">{t.save}</button>
          </div>
        </section>
      </form>
    </div>
  );
}
