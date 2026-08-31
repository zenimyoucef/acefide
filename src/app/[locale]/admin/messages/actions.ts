"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const ADMIN_ROLES = ["EDITOR", "ADMIN", "SUPER_ADMIN"];

// Mark a single contact message as read (called when an admin opens it).
export async function markContactMessageRead(id: string) {
  const session = await getSession();
  if (!session || !ADMIN_ROLES.includes(session.role)) return { ok: false };
  await prisma.contactMessage.update({ where: { id }, data: { read: true } }).catch(() => {});
  return { ok: true };
}

// Mark every unread contact message as read.
export async function markAllContactMessagesRead() {
  const session = await getSession();
  if (!session || !ADMIN_ROLES.includes(session.role)) return { ok: false };
  await prisma.contactMessage.updateMany({ where: { read: false }, data: { read: true } }).catch(() => {});
  return { ok: true };
}

// Delete a single contact message.
export async function deleteContactMessage(id: string) {
  const session = await getSession();
  if (!session || !ADMIN_ROLES.includes(session.role)) return { ok: false };
  await prisma.contactMessage.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/messages");
  return { ok: true };
}
