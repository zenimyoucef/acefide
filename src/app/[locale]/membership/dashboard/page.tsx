import { CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/membership/StatusBadge";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { completeMembershipRegistration } from "./actions";

const steps = ["تم تقديم المعلومات", "قيد المراجعة", "تمت الموافقة", "اكتمال التسجيل"];
const stepForStatus = { PENDING_REVIEW: 1, APPROVED_WAITING_PAYMENT: 2, COMPLETED: 3, REJECTED: 1 } as const;

export default async function MembershipDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await requireUser(locale);
  const request = await prisma.membershipRequest.findUnique({ where: { userId: session.id } });
  if (!request) return <main className="container-content py-16"><div className="rounded-2xl border bg-white p-8 text-center">لم يتم العثور على طلب إنخراط لهذا الحساب.</div></main>;
  const currentStep = stepForStatus[request.status as keyof typeof stepForStatus];
  const documents = [
    ["بطاقة التعريف الوطنية", "/api/membership/documents/identity-document", request.identityDocumentUrl],
    ["الصورة الشخصية", "/api/membership/documents/personal-photo", request.personalPhotoUrl],
    ["السيرة الذاتية", "/api/membership/documents/cv", request.cvUrl],
    ["شهادة المؤهل العلمي أو المهني", "/api/membership/documents/diploma", request.diplomaUrl],
    ["صحيفة السوابق العدلية", "/api/membership/documents/criminal-record", request.criminalRecordUrl],
    ["وصل تسديد مستحقات الإنخراط", "/api/membership/documents/dues-receipt", request.duesReceiptUrl],
  ].filter((item): item is [string, string, string] => Boolean(item[2]));
  const information = [
    ["الاسم", request.name],
    ["البريد الإلكتروني", request.email],
    ["رقم الهاتف", request.phone],
    ["تاريخ الميلاد", request.dateOfBirth?.toLocaleDateString("ar-DZ")],
    ["مكان الميلاد", request.placeOfBirth],
    ["العنوان", request.address],
    ["الولاية", request.wilaya],
    ["المستوى الدراسي", request.educationLevel],
    ["الوضعية المهنية", request.employmentStatus],
    ["المهنة", request.position],
    ["المؤسسة", request.organization],
    ["فئة الإنخراط", request.membershipCategory],
    ["مجالات الإهتمام", Array.isArray(request.interests) ? request.interests.join("، ") : String(request.interests)],
  ];
  return (
    <main className="bg-[#f5f8f4] py-12" dir="rtl">
      <div className="container-content max-w-5xl space-y-7">
        <header className="rounded-2xl bg-[#0b1f33] p-7 text-white">
          <p className="text-sm font-bold text-white/70">طلب الإنخراط</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold"> تسجيلك</h1>
            <StatusBadge status={request.status} />
          </div>
        </header>
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="font-bold text-[#0b1f33]">المراحل</h2>
          <ol className="mt-5 grid gap-3 sm:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step} className={`flex items-center gap-2 rounded-lg p-3 text-sm font-semibold ${index <= currentStep ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                <CheckCircle2 className="h-4 w-4" />{step}
              </li>
            ))}
          </ol>
          {request.status === "APPROVED_WAITING_PAYMENT" && (
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
              <p className="font-bold text-[#0b1f33]">تمت الموافقة على طلبك.</p>
              <p className="mt-1 text-sm text-muted-foreground">يرجى إكمال تسجيلك.</p>
              <form action={completeMembershipRegistration.bind(null, locale)} className="mt-4">
                <Button type="submit">إكمال التسجيل</Button>
              </form>
            </div>
          )}
        </section>
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="font-bold text-[#0b1f33]">المعلومات المقدمة</h2>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            {information.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</dt>
                <dd className="mt-1 break-words">{value || "—"}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="font-bold text-[#0b1f33]">الوثائق المرفقة</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {documents.map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg border p-3 text-sm font-semibold text-primary hover:bg-primary/[0.03]">
                <span>{label}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            ))}
            {!documents.length && <p className="text-sm text-muted-foreground">لم يتم رفع أي وثائق.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
