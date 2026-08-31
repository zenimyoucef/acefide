"use client";

import { UsersRound } from "lucide-react";
import { Link } from "@/lib/navigation";
import { leadershipMembers, structureCopy, type LeadershipMember } from "@/lib/structure";
import { LeadershipAvatar } from "./LeadershipAvatar";
import { cn } from "@/lib/utils";

type LeadershipPreviewProps = {
  fullBleed?: boolean;
  members?: LeadershipMember[];
};

export function LeadershipPreview({ fullBleed = false, members: providedMembers }: LeadershipPreviewProps) {
  const locale = "ar" as const;
  const copy = structureCopy.ar;
  const members = (providedMembers || leadershipMembers).filter((member) => member.id !== "president");

  const renderMember = (member: LeadershipMember, key: string) => (      <Link key={key} href={`/team/${member.id}`} className="team-member-card group flex w-56 shrink-0 flex-col items-center rounded-3xl text-center outline-none transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 sm:w-72" dir="rtl" aria-label={`${member.name.ar} - ${member.role.ar}`}>
      <LeadershipAvatar member={member} locale="ar" size="team" />
      <span className="mt-4 line-clamp-2 text-base font-bold leading-5 text-[#10241d] transition-colors group-hover:text-primary">{member.name.ar}</span>
      <span className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-primary">{member.role.ar}</span>
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

      </div>

      <div
        className={cn(
          "team-marquee-mask mt-6 min-h-[14.5rem] overflow-hidden py-1 sm:min-h-[20.5rem]",
          fullBleed && "team-marquee-full-bleed"
        )}
        dir="ltr"
      >
        <div className="team-marquee-track flex w-max gap-12 py-2">
          {members.map((member, index) => renderMember(member, `a-${member.id ?? index}`))}
          {members.map((member, index) => renderMember(member, `b-${member.id ?? index}`))}
        </div>
      </div>
    </div>
  );
}
