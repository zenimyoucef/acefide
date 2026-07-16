"use client";

import { ArrowLeft, ArrowRight, UsersRound } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { leadershipMembers, structureCopy, type LeadershipMember, type Locale } from "@/lib/structure";
import { LeadershipAvatar } from "./LeadershipAvatar";
import { cn } from "@/lib/utils";

type LeadershipPreviewProps = {
  fullBleed?: boolean;
  members?: LeadershipMember[];
};

export function LeadershipPreview({ fullBleed = false, members: providedMembers }: LeadershipPreviewProps) {
  const locale = useLocale() as Locale;
  const isRtl = locale === "ar";
  const copy = structureCopy[locale];
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const members = (providedMembers || leadershipMembers).filter((member) => member.id !== "president");

  const renderMember = (member: LeadershipMember, key: string) => (
    <Link key={key} href={`/team/${member.id}`} className="team-member-card group flex w-72 shrink-0 flex-col items-center rounded-3xl text-center outline-none transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4" dir={isRtl ? "rtl" : "ltr"} aria-label={`${member.name[locale]} - ${member.role[locale]}`}>
      <LeadershipAvatar member={member} locale={locale} size="team" />
      <span className="mt-4 line-clamp-2 text-base font-bold leading-5 text-[#10241d] transition-colors group-hover:text-primary">{member.name[locale]}</span>
      <span className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-primary">{member.role[locale]}</span>
    </Link>
  );

  return (
    <div className={cn("leadership-section", !fullBleed && "overflow-hidden p-1")}>
      <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", fullBleed && "container-content")}>
        <span>
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <UsersRound className="h-4 w-4" />
            {copy.previewLabel}
          </span>
          <span className="mt-1 block text-base font-bold text-[#10241d]">{copy.previewTitle}</span>
        </span>
        <Link href="/structure" className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary-dark" aria-label={copy.previewCta}>
          {copy.previewCta}
          <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </Link>
      </div>

      <div
        className={cn(
          "team-marquee-mask mt-6 min-h-[20.5rem] overflow-hidden py-1",
          fullBleed && "team-marquee-full-bleed"
        )}
        dir="ltr"
      >
        <div className="team-marquee-track flex w-max gap-12 py-2">
          {members.map((member, index) => renderMember(member, `${member.id ?? index}`))}
        </div>
      </div>
    </div>
  );
}
