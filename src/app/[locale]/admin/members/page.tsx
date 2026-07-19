import { ExternalLink, Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteApplicantButton } from "@/components/admin/DeleteApplicantButton";
import { deleteMembershipRequest } from "../actions";

export default async function MembersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = await prisma.membershipRequest.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  const isArabic = locale === "ar";
  const copy = isArabic
    ? {
        title: "طلبات الإنخراط",
        submitted: "أرسل في",
        applicant: "معلومات طالب الإنخراط",
        documents: "الوثائق المرفقة",
        noDocuments: "لم يتم إرفاق وثائق إضافية",
        declaration: "التصريح",
        accepted: "مقبول",
        notAccepted: "غير مقبول",
        notes: "ملاحظات الإدارة",
        empty: "لا توجد طلبات إنخراط بعد.",
      }
    : {
        title: "Membership applications",
        submitted: "Submitted",
        applicant: "Applicant information",
        documents: "Attached documents",
        noDocuments: "No extra documents attached",
        declaration: "Declaration",
        accepted: "Accepted",
        notAccepted: "Not accepted",
        notes: "Admin notes",
        empty: "No membership applications yet.",
      };

  return (
    <div>
      <div className="mb-6"><p className="text-sm font-bold text-primary">ACEFIDE</p><h1 className="mt-1 text-2xl font-bold">{copy.title}</h1></div>
      <div className="space-y-6">
        {items.map((item) => {
          const details: Array<[string, string | null | undefined]> = [
            [isArabic ? "تاريخ الميلاد" : "Date of birth", item.dateOfBirth?.toLocaleDateString(locale)],
            [isArabic ? "مكان الميلاد" : "Place of birth", item.placeOfBirth],
            [isArabic ? "رقم التعريف الوطني" : "National ID", item.nationalId],
            [isArabic ? "العنوان" : "Address", item.address],
            [isArabic ? "الولاية" : "Wilaya", item.wilaya],
            [isArabic ? "المستوى الدراسي" : "Education level", item.educationLevel],
            [isArabic ? "الوضعية الإجتماعية والمهنية" : "Employment status", item.employmentStatus],
            [isArabic ? "المهنة/الصفة" : "Profession / position", item.position],
            [isArabic ? "المؤسسة التكوينية أو المهنية" : "Training or professional organization", item.organization],
            [isArabic ? "فئة الإنخراط" : "Membership category", item.membershipCategory],
            [isArabic ? "عضوية سابقة" : "Previous association", item.previousAssociation === null ? null : item.previousAssociation ? (isArabic ? "نعم" : "Yes") : (isArabic ? "لا" : "No")],
          ];
          const optionalDocuments: Array<[string, string | null]> = [
            [isArabic ? "نسخة بطاقة التعريف أو جواز السفر" : "Identity document", item.identityDocumentUrl],
            [isArabic ? "صورة شخصية" : "Personal photo", item.personalPhotoUrl],
            [isArabic ? "شهادة المؤهل العلمي أو المهني" : "Diploma / qualification", item.diplomaUrl],
            [isArabic ? "صحيفة السوابق العدلية" : "Criminal record", item.criminalRecordUrl],
            [isArabic ? "وصل تسديد مستحقات الإنخراط" : "Dues receipt", item.duesReceiptUrl],
          ];
          const extraDocuments = optionalDocuments.filter((document): document is [string, string] => Boolean(document[1]));
          return (
            <article key={item.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <header className="flex flex-wrap items-start justify-between gap-4 border-b bg-[#f8faf7] p-5">
                <div><h2 className="text-xl font-bold text-[#0b1f33]">{item.name}</h2><p className="mt-1 text-xs text-muted-foreground">{copy.submitted} {item.createdAt.toLocaleString(locale)}</p></div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{item.status}</span>
                  <DeleteApplicantButton action={deleteMembershipRequest.bind(null, locale, item.id)} applicantName={item.name} locale={locale} />
                </div>
              </header>
              <div className="grid gap-7 p-5 xl:grid-cols-[1fr_1fr]">
                <section>
                  <h3 className="mb-4 border-b pb-2 font-bold text-[#0b1f33]">{copy.applicant}</h3>
                  <div className="grid gap-4 text-sm sm:grid-cols-2">
                    <Info label={isArabic ? "البريد الإلكتروني" : "Email"}><a href={`mailto:${item.email}`} className="inline-flex items-center gap-2 text-primary hover:underline"><Mail className="h-4 w-4" />{item.email}</a></Info>
                    <Info label={isArabic ? "رقم الهاتف" : "Phone"}>{item.phone ? <a href={`tel:${item.phone}`} className="inline-flex items-center gap-2 text-primary hover:underline"><Phone className="h-4 w-4" />{item.phone}</a> : "—"}</Info>
                    {details.map(([label, value]) => <Info key={label} label={label}>{value || "—"}</Info>)}
                    <Info label={isArabic ? "مجالات الإهتمام" : "Interests"}>{item.interests.length ? item.interests.join("، ") : "—"}</Info>
                  </div>
                  <LongInfo label={isArabic ? "تفاصيل العضوية السابقة" : "Previous association details"} value={item.previousAssociationDetails} />
                  <LongInfo label={isArabic ? "روابط التواصل الاجتماعي" : "Social media links"} value={item.socialLinks} />
                  <LongInfo label={isArabic ? "دوافع الإنضمام" : "Reason for joining"} value={item.reason} />
                </section>
                <section>
                  <h3 className="mb-4 border-b pb-2 font-bold text-[#0b1f33]">{copy.documents}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {item.cvUrl ? <DocumentLink label={isArabic ? "السيرة الذاتية/CV" : "CV"} url={item.cvUrl} /> : <div className="rounded-lg border border-dashed p-3 text-sm text-red-700">{isArabic ? "السيرة الذاتية/CV: غير مرفقة" : "CV: missing"}</div>}
                    {extraDocuments.map(([label, url]) => url && <DocumentLink key={label} label={label} url={url} />)}
                  </div>
                  {!item.cvUrl && !extraDocuments.length && <p className="mt-3 text-sm text-muted-foreground">{copy.noDocuments}</p>}
                  <p className="mt-5 rounded-lg bg-primary/[0.04] p-4 text-sm"><strong>{copy.declaration}:</strong> {item.declarationAccepted ? copy.accepted : copy.notAccepted}</p>
                  {item.notes && <LongInfo label={copy.notes} value={item.notes} />}
                </section>
              </div>
            </article>
          );
        })}
      </div>
      {!items.length && <p className="rounded-xl border bg-white p-10 text-center text-muted-foreground">{copy.empty}</p>}
    </div>
  );
}

function DocumentLink({ label, url }: { label: string; url: string }) {
  return <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg border p-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/[0.03]"><span>{label}</span><ExternalLink className="h-4 w-4" /></a>;
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p><div className="mt-1 break-words text-[#0b1f33]">{children}</div></div>;
}
function LongInfo({ label, value }: { label: string; value?: string | null }) {
  return <div className="mt-5"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#0b1f33]">{value || "—"}</p></div>;
}
