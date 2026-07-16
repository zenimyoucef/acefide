import { ArrowLeft, ArrowRight, Award, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Link } from "@/lib/navigation";
import { getLeadershipMembers } from "@/lib/leadership-data";
import { LeadershipAvatar } from "@/components/structure/LeadershipAvatar";
import type { Locale } from "@/lib/structure";
import { cn } from "@/lib/utils";

export default async function TeamMemberPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: localeParam, id } = await params;
  const locale = (localeParam === "ar" || localeParam === "fr" ? localeParam : "en") as Locale;
  const member = (await getLeadershipMembers()).find((item) => item.id === id);
  if (!member) notFound();

  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowRight : ArrowLeft;
  const copy = isRtl
    ? { back: "العودة إلى فريق العمل", eyebrow: "قصة نجاح", title: "الإنجازات والمسيرة المهنية", empty: "سيتم نشر إنجازات هذا العضو قريبًا." }
    : locale === "fr"
      ? { back: "Retour à l’équipe", eyebrow: "Parcours de réussite", title: "Réalisations et parcours professionnel", empty: "Les réalisations de ce membre seront bientôt publiées." }
      : { back: "Back to the team", eyebrow: "Success story", title: "Achievements and professional journey", empty: "This member's achievements will be published soon." };
  const achievements = (member.achievements?.[locale] || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

  return (
    <main className={cn("min-h-[70vh] bg-[#f7f8f4]", isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <section className="relative overflow-hidden bg-[#0b1f33] py-12 text-white sm:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(11,122,83,.94),rgba(11,31,51,.98)_58%,rgba(200,162,74,.30))]" />
        <div className="container-content relative z-10">
          <Link href="/structure" className="inline-flex items-center gap-2 text-sm font-bold text-white/75 transition hover:text-white"><Arrow className="h-4 w-4" />{copy.back}</Link>
          <div className="mt-8 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-start">
            <div className="group"><LeadershipAvatar member={member} locale={locale} size="xl" /></div>
            <div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-turquoise-light">{copy.eyebrow}</p><h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">{member.name[locale]}</h1><p className="mt-2 text-lg font-semibold text-white/75">{member.role[locale]}</p></div>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="container-content max-w-4xl">
          <div className="rounded-3xl border border-primary/10 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Award className="h-6 w-6" /></span><h2 className="text-2xl font-bold text-[#10241d]">{copy.title}</h2></div>
            {achievements.length ? <ul className="mt-7 space-y-4">{achievements.map((achievement, index) => <li key={`${index}-${achievement}`} className="flex items-start gap-3 rounded-2xl bg-primary/[0.04] p-4 leading-7 text-slate-700"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" /><span>{achievement}</span></li>)}</ul> : <p className="mt-7 rounded-2xl bg-muted p-6 text-center text-muted-foreground">{copy.empty}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
