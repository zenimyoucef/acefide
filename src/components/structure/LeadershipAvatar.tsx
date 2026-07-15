"use client";

import Image from "next/image";
import akram from "../../../assets/akram.png";
import type { LeadershipMember, Locale } from "@/lib/structure";
import { cn } from "@/lib/utils";

type LeadershipAvatarProps = {
  member: LeadershipMember;
  locale: Locale;
  size?: "sm" | "md" | "lg" | "team" | "xl";
};

export function LeadershipAvatar({ member, locale, size = "sm" }: LeadershipAvatarProps) {
  const imageSrc = member.imageUrl ?? (member.image === "akram" ? akram : null);
  const sizeClass = {
    sm: "h-12 w-12",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    team: "h-[13.875rem] w-[13.875rem]",
    xl: "h-40 w-40",
  }[size];
  const imageSize = {
    sm: "48px",
    md: "96px",
    lg: "128px",
    team: "222px",
    xl: "160px",
  }[size];

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full border-4 border-white bg-muted shadow-md ring-1 ring-black/5",
        sizeClass
      )}
      title={`${member.name[locale]} - ${member.role[locale]}`}
    >
      {imageSrc ? (
        <Image src={imageSrc} alt={member.name[locale]} fill sizes={imageSize} className="object-cover object-center" />
      ) : (
        <span className={cn("flex h-full w-full items-center justify-center bg-gradient-to-br text-lg font-extrabold text-white", member.accent)}>
          {member.initials}
        </span>
      )}
    </span>
  );
}
