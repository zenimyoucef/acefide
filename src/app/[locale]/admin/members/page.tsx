import { ExternalLink, Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteApplicantButton } from "@/components/admin/DeleteApplicantButton";
import { AdminForm } from "@/components/admin/AdminForm";
import { StatusBadge } from "@/components/membership/StatusBadge";
import { approveMembershipRequest, deleteMembershipRequest } from "../actions";

export default async function MembersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = await prisma.membershipRequest.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-bold text-primary">كارد</p>
        <h1 className="mt-1 text-2xl font-bold">طلبات الإنخراط</h1>
      </div>

      {!items.length && <p className="rounded-xl border bg-white p-10 text-center text-muted-foreground">لا توجد طلبات إنخراط بعد.</p>}

      <div className="space-y-3">
        {items.map((item) => (
          <MemberCard key={item.id} item={item} locale={locale} />
        ))}
      </div>
    </div>
  );
}

function MemberCard({ item, locale }: { item: Awaited<ReturnType<typeof prisma.membershipRequest.findMany>>[number]; locale: string }) {
  const details: Array<[string, string | null | undefined]> = [
    ["تاريخ الميلاد", item.dateOfBirth?.toLocaleDateString("ar")],
    ["مكان الميلاد", item.placeOfBirth],
    ["رقم التعريف الوطني", item.nationalId],
    ["العنوان", item.address],
    ["الولاية", item.wilaya],
    ["المستوى الدراسي", item.educationLevel],
    ["الوضعية الإجتماعية والمهنية", item.employmentStatus],
    ["المهنة/الصفة", item.position],
    ["المؤسسة التكوينية أو المهنية", item.organization],
    ["فئة الإنخراط", item.membershipCategory],
    ["عضوية سابقة", item.previousAssociation === null ? null : item.previousAssociation ? "نعم" : "لا"],
  ];

  const documents: Array<[string, string | null]> = [
    ["السيرة الذاتية/CV", item.cvUrl],
    ["نسخة بطاقة التعريف أو جواز السفر", item.identityDocumentUrl],
    ["صورة شخصية", item.personalPhotoUrl],
    ["شهادة المؤهل العلمي أو المهني", item.diplomaUrl],
    ["صحيفة السوابق العدلية", item.criminalRecordUrl],
    ["وصل تسديد مستحقات الإنخراط", item.duesReceiptUrl],
  ].filter((d): d is [string, string] => Boolean(d[1]));

  const docPaths = new Map<string, string>([
    [item.identityDocumentUrl, `/api/admin/membership/${item.id}/identity-document`],
    [item.personalPhotoUrl, `/api/admin/membership/${item.id}/personal-photo`],
    [item.diplomaUrl, `/api/admin/membership/${item.id}/diploma`],
    [item.criminalRecordUrl, `/api/admin/membership/${item.id}/criminal-record`],
    [item.duesReceiptUrl, `/api/admin/membership/${item.id}/dues-receipt`],
    [item.cvUrl, `/api/admin/membership/${item.id}/cv`],
  ].filter((e): e is [string, string] => Boolean(e[0])));

  return (
    <details className="overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* Header row — always visible */}
      <summary className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-start transition hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-4">
          <StatusBadge status={item.status} />
          <div>
            <p className="font-bold text-[#0b1f33]">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.email} · {item.phone || "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:block">{item.createdAt.toLocaleDateString("ar")}</span>
          <svg className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </summary>

      {/* Actions row — always visible */}
      <div className="flex items-center gap-2 border-t px-4 py-3">
        {item.status === "PENDING_REVIEW" && (
          <>
            <AdminForm action={approveMembershipRequest.bind(null, locale, item.id)} locale={locale}>
              <button className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20">قبول</button>
            </AdminForm>
            <AdminForm action={deleteMembershipRequest.bind(null, locale, item.id)} locale={locale} confirmMessage={`حذف طلب ${item.name}؟`}>
              <DeleteApplicantButton action={deleteMembershipRequest.bind(null, locale, item.id)} applicantName={item.name} locale={locale} />
            </AdminForm>
          </>
        )}
        {item.status !== "PENDING_REVIEW" && (
          <AdminForm action={deleteMembershipRequest.bind(null, locale, item.id)} locale={locale} confirmMessage={`حذف طلب ${item.name}؟`}>
            <DeleteApplicantButton action={deleteMembershipRequest.bind(null, locale, item.id)} applicantName={item.name} locale={locale} />
          </AdminForm>
        )}
      </div>

      {/* Expanded details */}
        <div className="border-t bg-[#f8faf7] p-5">
          <div className="grid gap-7 lg:grid-cols-2">
            <section>
              <h3 className="mb-4 border-b pb-2 font-bold text-[#0b1f33]">معلومات طالب الإنخراط</h3>
              <div className="grid gap-4 text-sm sm:grid-cols-2">
                <Info label="البريد الإلكتروني"><a href={`mailto:${item.email}`} className="inline-flex items-center gap-2 text-primary hover:underline"><Mail className="h-4 w-4" />{item.email}</a></Info>
                <Info label="رقم الهاتف">{item.phone ? <a href={`tel:${item.phone}`} className="inline-flex items-center gap-2 text-primary hover:underline"><Phone className="h-4 w-4" />{item.phone}</a> : "—"}</Info>
                {details.map(([label, value]) => <Info key={label} label={label}>{value || "—"}</Info>)}
                <Info label="مجالات الإهتمام">{item.interests.length ? item.interests.join("، ") : "—"}</Info>
              </div>
              {item.previousAssociationDetails && <LongInfo label="تفاصيل العضوية السابقة" value={item.previousAssociationDetails} />}
              {item.socialLinks && <LongInfo label="روابط التواصل الاجتماعي" value={item.socialLinks} />}
              {item.reason && <LongInfo label="دوافع الإنضمام" value={item.reason} />}
            </section>
            <section>
              <h3 className="mb-4 border-b pb-2 font-bold text-[#0b1f33]">الوثائق المرفقة</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {documents.map(([label, url]) => (
                  <a key={label} href={docPaths.get(String(url)) || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg border p-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/[0.03]">
                    <span>{label}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <p className="mt-5 rounded-lg bg-primary/[0.04] p-4 text-sm"><strong>التصريح:</strong> {item.declarationAccepted ? "مقبول" : "غير مقبول"}</p>
              {item.notes && <LongInfo label="ملاحظات الإدارة" value={item.notes} />}
            </section>
          </div>
        </div>
    </details>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p><div className="mt-1 break-words text-[#0b1f33]">{children}</div></div>;
}
function LongInfo({ label, value }: { label: string; value?: string | null }) {
  return <div className="mt-5"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#0b1f33]">{value || "—"}</p></div>;
}
