import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, ExternalLink, Handshake } from "lucide-react";
import { Link } from "@/lib/navigation";
import { prisma } from "@/lib/prisma";

export default async function PartnerDetailsPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const partner = await prisma.partner.findFirst({ where: { slug, published: true } }).catch(() => null);
  if (!partner) notFound();

  const isRtl = locale === "ar";
  const name = isRtl ? partner.nameAr : locale === "fr" ? partner.nameFr : partner.nameEn;
  const description = isRtl ? partner.descriptionAr : locale === "fr" ? partner.descriptionFr : partner.descriptionEn;
  const copy = isRtl
    ? { back: "العودة إلى الشركاء", kicker: "تعاون وشراكة", aim: "ما الذي نهدف إلى تحقيقه معًا؟", details: "تفاصيل التعاون", website: "زيارة موقع الشريك", fallback: "نعمل معًا على تطوير مبادرات وفرص ذات أثر اقتصادي مستدام، وسيتم نشر المزيد من تفاصيل هذا التعاون قريبًا." }
    : locale === "fr"
      ? { back: "Retour aux partenaires", kicker: "Collaboration et partenariat", aim: "Que voulons-nous accomplir ensemble ?", details: "Détails de la collaboration", website: "Visiter le site du partenaire", fallback: "Nous collaborons pour développer des initiatives et des opportunités ayant un impact économique durable. D'autres détails seront publiés prochainement." }
      : { back: "Back to partners", kicker: "Collaboration and partnership", aim: "What do we aim to achieve together?", details: "Collaboration details", website: "Visit partner website", fallback: "We collaborate to develop initiatives and opportunities with sustainable economic impact. More details about this collaboration will be published soon." };
  const Arrow = isRtl ? ArrowRight : ArrowLeft;

  return (
    <main dir={isRtl ? "rtl" : "ltr"}>
      <header className="bg-[#0b1f33] py-16 text-white md:py-20">
        <div className="container-content max-w-5xl">
          <Link href="/partners" className="inline-flex items-center gap-2 text-sm font-bold text-white/75 hover:text-white"><Arrow className="h-4 w-4" />{copy.back}</Link>
          <div className="mt-10 grid items-center gap-8 md:grid-cols-[12rem_1fr]">
            <div className="flex h-44 items-center justify-center rounded-2xl bg-white p-5 shadow-xl">
              {partner.logo ? <Image src={partner.logo} alt={`${name} logo`} width={190} height={150} className="h-full w-full object-contain" /> : <Building2 className="h-14 w-14 text-primary" />}
            </div>
            <div><p className="section-kicker !text-[#e5c978]">{copy.kicker}</p><h1 className="mt-4 text-4xl font-bold md:text-5xl">{name}</h1><p className="mt-4 text-sm font-bold uppercase tracking-wider text-white/60">{partner.category.replaceAll("_", " ")}</p></div>
          </div>
        </div>
      </header>

      <section className="bg-[#f3f6f1] py-16 md:py-20">
        <div className="container-content max-w-4xl">
          <article className="surface-card p-8 md:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><Handshake className="h-6 w-6 text-primary" /></div>
            <h2 className="mt-6 text-2xl font-bold text-[#0b1f33] md:text-3xl">{copy.aim}</h2>
            <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-primary">{copy.details}</h3>
            <p className="mt-3 whitespace-pre-line text-base leading-8 text-muted-foreground md:text-lg">{description || copy.fallback}</p>
            {partner.website && <a href={partner.website} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-dark">{copy.website}<ExternalLink className="h-4 w-4" /></a>}
          </article>
        </div>
      </section>
    </main>
  );
}
