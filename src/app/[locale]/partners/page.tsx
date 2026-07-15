import Image from "next/image";
import { ArrowLeft, ArrowRight, Building2, Handshake } from "lucide-react";
import { Link } from "@/lib/navigation";
import { prisma } from "@/lib/prisma";

export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const partners = await prisma.partner.findMany({ where: { published: true }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] }).catch(() => []);
  const copy = locale === "ar"
    ? { kicker: "تعاون مؤسسي", title: "شركاؤنا", body: "المؤسسات والهيئات التي تتعاون مع المركز.", empty: "سيتم نشر الشركاء هنا قريباً.", website: "زيارة الموقع" }
    : locale === "fr"
      ? { kicker: "Coopération institutionnelle", title: "Nos partenaires", body: "Les institutions et organisations qui collaborent avec le centre.", empty: "Les partenaires seront bientôt publiés ici.", website: "Visiter le site" }
      : { kicker: "Institutional cooperation", title: "Our partners", body: "Institutions and organizations collaborating with the center.", empty: "Partners will be published here soon.", website: "Explore collaboration" };

  return <div dir={locale === "ar" ? "rtl" : "ltr"}>
    <header className="bg-[#0b1f33] py-20 text-white"><div className="container-content max-w-4xl"><p className="section-kicker !text-[#e5c978]">{copy.kicker}</p><h1 className="mt-4 text-4xl font-bold md:text-5xl">{copy.title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{copy.body}</p></div></header>
    <section className="bg-[#f3f6f1] py-16 md:py-20"><div className="container-content">
      {partners.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{partners.map(partner => {
        const name = locale === "ar" ? partner.nameAr : locale === "fr" ? partner.nameFr : partner.nameEn;
        const description = locale === "ar" ? partner.descriptionAr : locale === "fr" ? partner.descriptionFr : partner.descriptionEn;
        const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
        return <Link href={`/partners/${partner.slug}`} key={partner.id} className="group surface-card flex flex-col p-7 transition-all hover:-translate-y-1 hover:shadow-xl">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border bg-white">{partner.logo ? <Image src={partner.logo} alt={`${name} logo`} width={64} height={64} className="h-full w-full object-contain p-2"/> : <Building2 className="h-7 w-7 text-primary"/>}</div>
          <span className="mt-5 text-xs font-bold uppercase tracking-wider text-primary">{partner.category.replaceAll("_", " ")}</span>
          <h2 className="mt-2 text-xl font-bold leading-7 text-[#0b1f33]">{name}</h2>
          {description && <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{description}</p>}
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">{copy.website}<Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"/></span>
        </Link>;
      })}</div> : <div className="rounded-2xl border bg-white p-12 text-center"><Handshake className="mx-auto h-10 w-10 text-slate-400"/><p className="mt-4 text-slate-500">{copy.empty}</p></div>}
    </div></section>
  </div>;
}
