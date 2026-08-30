import { prisma } from "@/lib/prisma";
import { Link } from "@/lib/navigation";
import { CalendarDays, Handshake, Mail, MessageSquare, Newspaper, Users, FileText, Inbox } from "lucide-react";

async function dashboardData() {
  try {
    const [news, events, publications, partners, contacts, members, consultations, subscribers, recentContacts, recentMembers] = await prisma.$transaction([
      prisma.news.count(), prisma.event.count(), prisma.publication.count(), prisma.partner.count(), prisma.contactMessage.count(), prisma.membershipRequest.count(), prisma.consultationRequest.count(), prisma.newsletterSubscriber.count({ where: { active: true } }), prisma.contactMessage.findMany({ take: 5, orderBy: { createdAt: "desc" } }), prisma.membershipRequest.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    ]);
    return { counts: { news, events, publications, partners, contacts, members, consultations, subscribers }, recentContacts, recentMembers };
  } catch {
    return { counts: { news: 0, events: 0, publications: 0, partners: 0, contacts: 0, members: 0, consultations: 0, subscribers: 0 }, recentContacts: [], recentMembers: [] };
  }
}

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await dashboardData();
  const cards = [
    ["الأخبار", data.counts.news, Newspaper, "/admin/news"],
    ["الفعاليات", data.counts.events, CalendarDays, "/admin/events"],
    ["المنشورات", data.counts.publications, FileText, "/admin/publications"],
    ["الشركاء", data.counts.partners, Handshake, "/admin/partners"],
    ["رسائل الاتصال", data.counts.contacts, Inbox, "/admin/messages"],
    ["طلبات العضوية", data.counts.members, Users, "/admin/members"],
    ["الاستشارات", data.counts.consultations, MessageSquare, "/admin/consultations"],
    ["المشتركون", data.counts.subscribers, Mail, "/admin/subscribers"],
  ] as const;

  return (
    <div dir="rtl">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wider text-primary">المركز الجزائري للتشبيك الاقتصادي و الاستثمار التنموي</p>
        <h1 className="mt-2 text-3xl font-bold text-[#0b1f33]">لوحة التحكم</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, count, Icon, href]) => (
          <Link href={href} key={label} className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
              <span className="text-3xl font-bold text-[#0b1f33]">{count}</span>
            </div>
            <p className="mt-5 text-sm font-semibold text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-6">
          <h2 className="font-bold">أحدث رسائل الاتصال</h2>
          <div className="mt-4 divide-y">
            {data.recentContacts.map((item) => (
              <div key={item.id} className="py-3">
                <p className="font-semibold">{item.name}</p>
                <p className="truncate text-sm text-muted-foreground">{item.subject}</p>
              </div>
            ))}
            {!data.recentContacts.length && <p className="py-8 text-sm text-muted-foreground">لا توجد رسائل بعد.</p>}
          </div>
        </section>
        <section className="rounded-xl border bg-white p-6">
          <h2 className="font-bold">أحدث طلبات العضوية</h2>
          <div className="mt-4 divide-y">
            {data.recentMembers.map((item) => (
              <div key={item.id} className="py-3">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.email}</p>
              </div>
            ))}
            {!data.recentMembers.length && <p className="py-8 text-sm text-muted-foreground">لا توجد طلبات بعد.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
