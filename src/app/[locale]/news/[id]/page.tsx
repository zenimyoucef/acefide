import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Link } from "@/lib/navigation";

const copy = {
  ar: { back: "العودة إلى الأخبار", news: "أخبار المركز", published: "نُشر في" },
  fr: { back: "Retour aux actualités", news: "Actualités du centre", published: "Publié le" },
  en: { back: "Back to news", news: "Center news", published: "Published on" },
} as const;

async function getArticle(id: string) {
  return prisma.news.findFirst({ where: { published: true, OR: [{ id }, { slug: id }] } }).catch(() => null);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const article = await getArticle(id);
  if (!article) return {};
  const title = locale === "ar" ? article.titleAr : locale === "fr" ? article.titleFr : article.titleEn;
  const description = locale === "ar" ? article.excerptAr : locale === "fr" ? article.excerptFr : article.excerptEn;
  return { title, description: description || undefined, openGraph: { type: "article", title, description: description || undefined, images: article.coverImage ? [article.coverImage] : undefined } };
}

export default async function NewsDetail({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: localeParam, id } = await params;
  const locale = localeParam === "ar" || localeParam === "fr" ? localeParam : "en";
  const article = await getArticle(id);
  if (!article) notFound();

  const text = copy[locale];
  const title = locale === "ar" ? article.titleAr : locale === "fr" ? article.titleFr : article.titleEn;
  const excerpt = locale === "ar" ? article.excerptAr : locale === "fr" ? article.excerptFr : article.excerptEn;
  const content = locale === "ar" ? article.contentAr : locale === "fr" ? article.contentFr : article.contentEn;
  const date = article.publishedAt || article.createdAt;
  const paragraphs = content.split(/\r?\n\s*\r?\n|\r?\n/).map(value => value.trim()).filter(Boolean);

  return <main className="min-h-[75vh] bg-[#f5f2e9] pb-24 text-[#17211d]" dir={locale === "ar" ? "rtl" : "ltr"}>
    <header className="bg-[#0b1f33] text-white">
      <div className="container-content max-w-5xl py-12 sm:py-16 lg:py-20">
        <Link href="/news" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/75 transition hover:border-white/40 hover:text-white">
          <ArrowLeft className={`h-4 w-4 ${locale === "ar" ? "rotate-180" : ""}`} /> {text.back}
        </Link>
        <div className="mt-10 max-w-4xl">
          <span className="inline-flex rounded-full bg-[#c8a24a]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#e5c978]">{text.news}</span>
          <h1 className="mt-5 text-3xl font-black leading-[1.25] tracking-tight sm:text-4xl lg:text-6xl">{title}</h1>
          <div className="mt-7 flex items-center gap-2 text-sm text-white/65"><CalendarDays className="h-4 w-4 text-[#e5c978]"/><span>{text.published} {date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}</span></div>
        </div>
      </div>
    </header>

    <article className="container-content max-w-5xl">
      {article.coverImage ? <div className="relative -mt-1 aspect-[16/8] overflow-hidden rounded-b-2xl bg-slate-200 shadow-xl sm:mt-10 sm:rounded-2xl">
        <div className="absolute inset-0 bg-cover bg-center" role="img" aria-label={title} style={{ backgroundImage: `url(${JSON.stringify(article.coverImage).slice(1,-1)})` }}/>
      </div> : <div className="mt-10 flex min-h-40 items-center justify-center rounded-2xl border border-[#17211d]/10 bg-[linear-gradient(135deg,#dfe9e1,#f4efe1)] text-primary/30"><Newspaper className="h-16 w-16"/></div>}

      <div className="mx-auto max-w-3xl py-10 sm:py-14">
        {excerpt && <p className="border-s-4 border-primary ps-5 text-xl font-semibold leading-9 text-[#263c34] sm:text-2xl sm:leading-10">{excerpt}</p>}
        <div className={`${excerpt ? "mt-10 border-t border-[#17211d]/15 pt-10" : ""} space-y-6 text-[1.05rem] leading-9 text-[#33443d] sm:text-lg sm:leading-10`}>
          {paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}
        </div>
        {article.galleryImages.filter(image=>image!==article.coverImage).length>0&&<div className="mt-12 grid gap-4 sm:grid-cols-2">{article.galleryImages.filter(image=>image!==article.coverImage).map((image,index)=><div key={image} className={`${index%3===0?"sm:col-span-2 aspect-[16/8]":"aspect-[4/3]"} overflow-hidden rounded-2xl bg-slate-200 shadow-sm`}><div className="h-full w-full bg-cover bg-center" role="img" aria-label={`${title} ${index+2}`} style={{backgroundImage:`url(${JSON.stringify(image).slice(1,-1)})`}}/></div>)}</div>}
      </div>
    </article>
  </main>;
}
