import { Building2, Network } from "lucide-react";
import { LeadershipAvatar } from "@/components/structure/LeadershipAvatar";
import { structureCopy, type Locale } from "@/lib/structure";
import { getLeadershipMembers } from "@/lib/leadership-data";
import { cn } from "@/lib/utils";

export default async function StructurePage({params}:{params:Promise<{locale:string}>}) {
  const {locale:localeParam}=await params;
  const locale=(localeParam === "ar" || localeParam === "fr" ? localeParam : "en") as Locale;
  const isRtl = locale === "ar";
  const copy = structureCopy[locale];
  const [president, ...executives] = await getLeadershipMembers();

  return (
    <div className={cn("bg-[#f7f8f4]", isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <section className="relative overflow-hidden bg-[#0b1f33] py-20 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(11,122,83,.96),rgba(11,31,51,.98)_54%,rgba(200,162,74,.34))]" />
        <div className="container-content relative z-10">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.18em] text-turquoise-light">
              <Network className="h-4 w-4" />
              {copy.pageEyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white md:text-5xl">
              {copy.pageTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
              {copy.pageIntro}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-content">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="section-kicker">{copy.president}</p>
              <div className="mx-auto mt-6 flex max-w-sm flex-col items-center text-center">
                <LeadershipAvatar member={president} locale={locale} size="xl" />
                <h2 className="mt-5 text-2xl font-bold text-[#10241d] md:text-3xl">{president.name[locale]}</h2>
                <p className="mt-1 text-base font-semibold text-primary md:text-lg">{president.role[locale]}</p>
              </div>
            </div>

            <div className="mx-auto h-12 w-px bg-primary/25" />

            <div className="rounded-[2rem] border border-primary/10 bg-white/70 p-4 shadow-[0_18px_55px_rgba(11,31,51,0.06)] md:p-6">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold text-[#10241d]">{copy.executive}</h2>
              </div>

              <div className="grid justify-items-center gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {executives.map((member) => (
                  <article
                    key={member.id}
                    className="group flex w-full max-w-[15rem] flex-col items-center text-center"
                  >
                    <span className="rounded-full transition group-hover:-translate-y-1 group-hover:shadow-[0_18px_38px_rgba(11,31,51,0.10)]">
                      <LeadershipAvatar member={member} locale={locale} size="lg" />
                    </span>
                    <h3 className="mt-4 text-lg font-bold leading-tight text-[#10241d]">{member.name[locale]}</h3>
                    <p className="mt-1 text-sm font-semibold leading-6 text-primary">{member.role[locale]}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
