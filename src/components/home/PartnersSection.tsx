import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/lib/navigation";
import { prisma } from "@/lib/prisma";

const copy = {
  title: "شركاؤنا",
  intro: "المؤسسات والشركات التي نتعاون معها لتحقيق أثر اقتصادي مشترك.",
  all: "عرض جميع الشركاء",
};

export async function PartnersSection() {
  const partners = await prisma.partner.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  }).catch(() => []);

  if (!partners.length) return null;

  const renderLogo = (partner: typeof partners[number], key: string) => {
    const name = partner.nameAr;
    if (!partner.logo) return null;

    const img = (
      <Image
        src={partner.logo}
        alt={`${name} logo`}
        width={160}
        height={80}
        className="h-16 w-40 object-contain sm:h-20 sm:w-48 transition-all duration-500 ease-out hover:scale-110"
      />
    );

    const wrapperClass = "partner-card group flex h-24 w-48 sm:h-28 sm:w-56 shrink-0 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

    return partner.website ? (
      <a key={key} href={partner.website} target="_blank" rel="noopener noreferrer" aria-label={name} title={name} className={wrapperClass}>
        {img}
      </a>
    ) : (
      <Link key={key} href={`/partners/${partner.slug}`} aria-label={name} title={name} className={wrapperClass}>
        {img}
      </Link>
    );
  };

  return (
    <section className="py-20 md:py-24" dir="rtl">
      <div className="container-content">
        {/* Header */}
        <div className="mb-14 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">{copy.title}</h2>
            <p className="mt-4 leading-7 text-muted-foreground">{copy.intro}</p>
            <div className="mt-5 h-[3px] w-16 rounded-full bg-gradient-to-l from-turquoise via-primary to-turquoise" />
          </div>
          <Link href="/partners" className="group hidden shrink-0 items-center gap-2 rounded-full border border-primary/15 px-5 py-2.5 text-sm font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-[0_8px_25px_rgba(11,122,83,0.25)] sm:flex">
            {copy.all}
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Partners marquee — always scroll, 4x duplication for seamless loop */}
        <div className="partners-marquee-mask overflow-hidden py-1">
          <div className="partners-marquee-track flex w-max items-center gap-10 py-2">
            {[0,1,2,3].map(set =>
              partners.map((p, i) => renderLogo(p, `${set}-${p.id ?? i}`))
            )}
          </div>
        </div>


      </div>
    </section>
  );
}
