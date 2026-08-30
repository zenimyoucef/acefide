import { ArrowLeft, FileText, Globe2, ImagePlus, Languages } from "lucide-react";
import { Link } from "@/lib/navigation";
import { saveNews, updateNews } from "../../actions";
import { FriendlySlugField } from "@/components/admin/FriendlySlugField";
import { MultiImageUploadField } from "@/components/admin/MultiImageUploadField";
import { prisma } from "@/lib/prisma";
import { AdminForm } from "@/components/admin/AdminForm";

const inputClass =
  "mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10";
const textareaClass =
  "mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm font-normal leading-6 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10";

const t = {
  back: "العودة إلى الأخبار",
  heading: "إنشاء مقال إخباري",
  intro: "أضف المقال بالعربية. احفظه كمسودة حتى يصبح جاهزًا.",
  address: "عنوان الصفحة",
  addressHelp: "تُستخدم هذه القيمة لإنشاء رابط المقال، ويجب أن تكون قصيرة وفريدة.",
  titles: "العنوان والملخص",
  titlesHelp: "يظهر العنوان والملخص القصير في بطاقات الأخبار وصفحات القوائم.",
  title: "عنوان المقال",
  titlePlaceholder: "أدخل العنوان الذي سيظهر للقراء",
  summary: "ملخص قصير",
  optional: "اختياري",
  summaryPlaceholder: "لخّص المقال في جملة أو جملتين",
  cover: "صورة الغلاف",
  coverHelp: "اختر الصورة الرئيسية للمقال. الملف المرفوع له الأولوية على الرابط.",
  upload: "رفع صورة من الجهاز",
  content: "محتوى المقال",
  contentHelp: "اكتب المقال كاملًا. سيتم الحفاظ على فواصل الفقرات.",
  contentPlaceholder: "اكتب المقال كاملًا هنا…",
  publish: "النشر فورًا",
  publishHelp: "اتركه غير محدد لحفظ المقال كمسودة.",
  cancel: "إلغاء",
  save: "حفظ المقال",
};

export default async function NewNews({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ edit?: string }> }) {
  const { locale } = await params;
  const { edit } = await searchParams;
  const article = edit ? await prisma.news.findUnique({ where: { id: edit } }) : null;

  return (
    <div className="mx-auto max-w-5xl pb-12">
      <Link href="/admin/news" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> {t.back}
      </Link>

      <div className="mb-7">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">{t.heading}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t.intro}</p>
      </div>

      <AdminForm action={article ? updateNews.bind(null, locale, article.id) : saveNews.bind(null, locale)} locale={locale} successRedirect={`/${locale}/admin/news`} className="space-y-6">
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

          <div className="space-y-5" dir="rtl">
            <label htmlFor="titleAr" className="block text-sm font-semibold text-slate-800">
              {t.title} <span className="text-red-600">*</span>
              <input id="titleAr" name="titleAr" required defaultValue={article?.titleAr || ""} placeholder={t.titlePlaceholder} className={inputClass} />
            </label>
            <label htmlFor="excerptAr" className="block text-sm font-semibold text-slate-800">
              {t.summary} <span className="font-normal text-slate-500">({t.optional})</span>
              <textarea id="excerptAr" name="excerptAr" rows={3} defaultValue={article?.excerptAr || ""} placeholder={t.summaryPlaceholder} className={textareaClass} />
            </label>
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
          <MultiImageUploadField label={t.upload} existingImages={article ? [...new Set([article.coverImage, ...article.galleryImages].filter((v): v is string => Boolean(v)))] : []} mainImage={article?.coverImage} />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary"><FileText className="h-5 w-5" /></div>
            <div>
              <h2 className="font-bold text-slate-950">{t.content}</h2>
              <p className="mt-1 text-sm text-slate-500">{t.contentHelp}</p>
            </div>
          </div>
          <label htmlFor="contentAr" className="block text-sm font-semibold text-slate-800" dir="rtl">
            المحتوى <span className="text-red-600">*</span>
            <textarea id="contentAr" name="contentAr" required rows={10} defaultValue={article?.contentAr || ""} placeholder={t.contentPlaceholder} className={textareaClass} />
          </label>
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
      </AdminForm>
    </div>
  );
}
