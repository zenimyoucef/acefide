import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
import { Link } from "@/lib/navigation";

type Locale = "ar" | "fr" | "en";

type AboutCenterProps = {
  locale: Locale;
};

const copy = {
  ar: {
    eyebrow: "عن المركز",
    title: "المركز الجزائري للتشبيك الاقتصادي و الاستثمار التنموي",
    name: "المركز الجزائري للاستشراف الاقتصادي و تطوير الاستثمار و المقاولاتية سابقاً",
    founded: "تأسس بتاريخ 22 مارس 2022",
    law: "في إطار قانون الجمعيات 12-06",
    description:
      "جاء التفكير في تأسيس هذا الفضاء بهدف مواكبة الإصلاحات الوطنية بما فيها الإصلاحات الاقتصادية من خلال التفكير الاقتصادي ورفع المقترحات التي من شأنها تعزيز المسار التنموي.",
    cta: "تعرّف على المركز",
  },
  fr: {
    eyebrow: "À propos du centre",
    title: "Centre algérien de réseautage économique et d'investissement pour le développement",
    name: "Centre algérien de prospective économique et de développement de l'investissement et de l'entrepreneuriat (anciennement)",
    founded: "Fondé le 22 mars 2022",
    law: "Dans le cadre de la loi sur les associations 12-06",
    description:
      "La création de cet espace vise à accompagner les réformes nationales, y compris les réformes économiques, par la réflexion économique et la formulation de propositions susceptibles de renforcer le parcours de développement.",
    cta: "Découvrir le centre",
  },
  en: {
    eyebrow: "About the center",
    title: "Algerian Center for Economic Networking and Developmental Investment",
    name: "Algerian Center for Economic Foresight and Development of Investment and Entrepreneurship (formerly)",
    founded: "Founded on March 22, 2022",
    law: "Under Association Law 12-06",
    description:
      "The center was established to keep pace with national reforms, including economic reforms, through economic thinking and raising proposals that would enhance the development path.",
    cta: "Learn more",
  },
} as const;

export function AboutCenterSection({ locale }: AboutCenterProps) {
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const text = copy[locale];

  return (
    <section
      className="relative overflow-hidden py-14 text-white sm:py-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b7a53] via-[#0b1f33] to-[#071b20]" />

      {/* Decorative elements */}
      <div className="pointer-events-none absolute -end-32 -top-32 h-96 w-96 rounded-full bg-turquoise/[0.08] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -start-24 h-72 w-72 rounded-full bg-accent/[0.08] blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[.03] [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="container-content relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-turquoise-light backdrop-blur-sm">
            <Building2 className="h-3.5 w-3.5" />
            {text.eyebrow}
          </span>

          {/* Title */}
          <h2 className="mt-8 text-[1.75rem] sm:text-3xl font-black leading-tight tracking-tight">
            {text.title}
          </h2>

          {/* Founding info */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-white/55">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 backdrop-blur-sm">
              {text.founded}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 backdrop-blur-sm">
              {text.law}
            </span>
          </div>

          {/* Previous name */}
          <p className="mt-5 text-sm leading-7 text-white/40 italic">
            {text.name}
          </p>

          {/* Divider */}
          <div className="mx-auto my-8 h-px w-24 bg-gradient-to-r from-transparent via-turquoise/40 to-transparent" />

          {/* Description */}
          <p className="mx-auto max-w-2xl text-lg leading-9 text-white/75 md:text-xl md:leading-10">
            {text.description}
          </p>

          {/* CTA */}
          <Link
            href="/about"
            className="group mt-10 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-turquoise/40 hover:bg-white/16 hover:shadow-[0_0_30px_rgba(32,205,181,0.15)] hover:scale-[1.02] active:scale-[0.98]"
          >
            {text.cta}
            <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
