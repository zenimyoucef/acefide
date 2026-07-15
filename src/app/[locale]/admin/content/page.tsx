import { prisma } from "@/lib/prisma";
import { SiteSettingsForm } from "@/components/admin/PublishingForms";

export default async function AdminContentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settings = await prisma.siteSetting.findMany();
  const values = Object.fromEntries(settings.map(x=>[x.key,x.value]));
  return <div className="mx-auto max-w-5xl"><header className="mb-8"><h1 className="text-3xl font-bold">Site content and contact details</h1><p className="mt-2 text-sm text-slate-500">Manage the organization identity, public contact information, social links, and map.</p></header><SiteSettingsForm locale={locale} values={values}/></div>;
}
