import { AdminLayout } from "@/components/admin/AdminLayout";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminRootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const user = await requireAdmin(locale);
  const unreadMessages = await prisma.contactMessage.count({ where: { read: false } }).catch(() => 0);
  return <AdminLayout user={user} unreadMessages={unreadMessages}>{children}</AdminLayout>;
}
