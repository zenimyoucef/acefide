"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function completeMembershipRegistration(locale: string) {
  const session = await requireUser(locale);
  await prisma.membershipRequest.updateMany({
    where: { userId: session.id, status: "APPROVED_WAITING_PAYMENT" },
    data: { status: "COMPLETED" },
  });
  revalidatePath(`/${locale}/membership/dashboard`);
  revalidatePath(`/${locale}/admin/members`);
}
