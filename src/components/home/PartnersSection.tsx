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

    return (
      <div key={key} className="flex h-20 w-32 sm:h-24 sm:w-40 shrink-0 items-center justify-center" aria-label={name} title={name}>
        <Image
          src={partner.logo}
          alt={`${name} logo`}
          width={120}
          height={60}
          className="h-full w-full object-contain"
        />
      </div>
    );
  };

  return (
    <section className="py-14 sm:py-20" dir="rtl">
      <div className="container-content">
        {/* Header */}
        <div className="mb-14 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-[1.75rem] sm:text-3xl font-black tracking-tight text-foreground">{copy.title}</h2>
            <p className="mt-4 leading-7 text-muted-foreground">{copy.intro}</p>
            <div className="mt-5 h-[3px] w-16 rounded-full bg-gradient-to-l from-turquoise via-primary to-turquoise" />
          </div>
          <Link href="/partners" className="group hidden shrink-0 items-center gap-2 rounded-full border border-primary/15 px-5 py-2.5 text-sm font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-[0_8px_25px_rgba(11,122,83,0.25)] sm:flex">
            {copy.all}
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Partners static grid */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10">
          {partners.map((p, i) => renderLogo(p, `logo-${p.id ?? i}`))}
        </div>


      </div>
    </section>
  );
}
