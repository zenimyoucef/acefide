import "server-only";
import { prisma } from "@/lib/prisma";
import { leadershipMembers, type LeadershipMember } from "@/lib/structure";

export async function getLeadershipMembers(): Promise<LeadershipMember[]> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "leadership_members" } }).catch(() => null);
  if (!setting?.value) return leadershipMembers;
  try {
    const saved = JSON.parse(setting.value) as LeadershipMember[];
    return Array.isArray(saved) ? saved.map((member) => ({
      ...member,
      achievements: member.achievements || { ar: "", fr: "", en: "" },
    })) : leadershipMembers;
  } catch {
    return leadershipMembers;
  }
}
