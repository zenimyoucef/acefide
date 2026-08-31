import Image from "next/image";
import { prisma } from "@/lib/prisma";

const copy = {
  title: "شركاؤنا",
  intro: "المؤسسات والشركات التي نتعاون معها لتحقيق أثر اقتصادي مشترك.",
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
    const isLarge = name.includes("المصدرين الجزائريين");

    return (
      <div key={key} className={`flex items-center justify-center rounded-xl border border-border/30 bg-white p-4 sm:p-5 ${isLarge ? "col-span-2 h-28 sm:h-36" : "h-24 sm:h-32"}`} aria-label={name} title={name}>
        <Image
          src={partner.logo}
          alt={`${name} logo`}
          width={isLarge ? 200 : 140}
          height={isLarge ? 100 : 80}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  };

  return (
    <section className="py-14 sm:py-20" dir="rtl">
      <div className="container-content">
        {/* Header */}
        <div className="mb-14">
          <h2 className="text-[1.75rem] sm:text-3xl font-black tracking-tight text-foreground">{copy.title}</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{copy.intro}</p>
          <div className="mt-5 h-[3px] w-16 rounded-full bg-gradient-to-l from-turquoise via-primary to-turquoise" />
        </div>

        {/* Partners static grid */}
        <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 sm:gap-8 lg:grid-cols-4">
          {partners.map((p, i) => renderLogo(p, `logo-${p.id ?? i}`))}
        </div>


      </div>
    </section>
  );
}
