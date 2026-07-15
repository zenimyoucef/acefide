import { AdminLayout } from "@/components/admin/AdminLayout";
import { requireAdmin } from "@/lib/auth";

export default async function AdminRootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const user = await requireAdmin(locale);
  return <AdminLayout user={user}>{children}</AdminLayout>;
}
