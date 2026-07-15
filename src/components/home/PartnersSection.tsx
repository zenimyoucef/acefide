import Image from "next/image";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
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
            const description = locale === "ar" ? partner.descriptionAr : locale === "fr" ? partner.descriptionFr : partner.descriptionEn;
            return (
              <Link key={partner.id} href={`/partners/${partner.slug}`} className="group surface-card flex min-h-72 flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-28 items-center justify-center rounded-xl border bg-white p-4">
                  {partner.logo ? (
                    <Image src={partner.logo} alt={`${name} logo`} width={180} height={96} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <Building2 className="h-10 w-10 text-primary" />
                  )}
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#0b1f33]">{name}</h3>
                {description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{description}</p>}
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-primary">
                  {copy.details}<Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
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
