import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/lib/navigation";
import { prisma } from "@/lib/prisma";

type Locale = "ar" | "fr" | "en";

export async function PartnersSection({ locale }: { locale: Locale }) {
  const partners = await prisma.partner.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  }).catch(() => []);
  const isRtl = locale === "ar";
  const copy = isRtl
    ? { title: "شركاؤنا", intro: "المؤسسات والشركات التي نتعاون معها لتحقيق أثر اقتصادي مشترك.", details: "اكتشف أهداف تعاوننا", all: "عرض جميع الشركاء" }
    : locale === "fr"
      ? { title: "Nos partenaires", intro: "Les institutions et entreprises avec lesquelles nous collaborons pour créer un impact économique commun.", details: "Découvrir notre collaboration", all: "Voir tous les partenaires" }
      : { title: "Our partners", intro: "Organizations and companies we collaborate with to create shared economic impact.", details: "Explore our collaboration", all: "View all partners" };
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  if (!partners.length) return null;

  return (
    <section className="bg-muted/50 py-20" dir={isRtl ? "rtl" : "ltr"}>
      <div className="container-content scroll-reveal">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">{copy.title}</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{copy.intro}</p>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-turquoise" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {partners.map((partner) => {
            const name = locale === "ar" ? partner.nameAr : locale === "fr" ? partner.nameFr : partner.nameEn;
            if (!partner.logo) return null;

            const logo = (
              <Image
                src={partner.logo}
                alt={`${name} logo`}
                width={220}
                height={120}
                className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-125 group-focus-visible:scale-125 group-active:scale-110"
              />
            );
            const className = "group flex h-32 items-center justify-center p-3 focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

            return partner.website ? (
              <a key={partner.id} href={partner.website} target="_blank" rel="noopener noreferrer" aria-label={name} title={name} className={className}>
                {logo}
              </a>
            ) : (
              <Link key={partner.id} href={`/partners/${partner.slug}`} aria-label={name} title={name} className={className}>
                {logo}
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/partners" className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white">
            {copy.all}<Arrow className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
