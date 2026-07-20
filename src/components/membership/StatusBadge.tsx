import type { MembershipStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const labels: Record<MembershipStatus, string> = {
  PENDING_REVIEW: "Pending Review",
  APPROVED_WAITING_PAYMENT: "Waiting for Completion",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
};

const styles: Record<MembershipStatus, string> = {
  PENDING_REVIEW: "border-amber-200 bg-amber-50 text-amber-800",
  APPROVED_WAITING_PAYMENT: "border-blue-200 bg-blue-50 text-blue-800",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  REJECTED: "border-red-200 bg-red-50 text-red-800",
};

export function StatusBadge({ status }: { status: MembershipStatus }) {
  return <Badge className={`border ${styles[status]}`}>{status === "APPROVED_WAITING_PAYMENT" ? "Approved · " : ""}{labels[status]}</Badge>;
}
