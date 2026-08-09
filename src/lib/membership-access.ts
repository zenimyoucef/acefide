import type { MembershipStatus } from "@prisma/client";

export type MembershipViewState = "REGISTER" | "VERIFY_EMAIL" | "APPLICATION" | "PENDING" | "REJECTED" | "APPROVED";

export function getMembershipViewState(
  user: { emailVerifiedAt: Date | null } | null,
  request: { status: MembershipStatus } | null,
): MembershipViewState {
  if (!user) return "REGISTER";
  if (!user.emailVerifiedAt) return "VERIFY_EMAIL";
  if (!request) return "APPLICATION";
  if (request.status === "PENDING_REVIEW") return "PENDING";
  if (request.status === "REJECTED") return "REJECTED";
  return "APPROVED";
}
