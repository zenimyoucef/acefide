"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, Send, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MembershipAccountGate } from "@/components/membership/MembershipAccountGate";
import { ALGERIA_WILAYAS } from "@/lib/algeria-wilayas";
import { REQUIRED_MEMBERSHIP_FILES } from "@/lib/membership-files";

const educationLevels = ["مستوى تأهيلي", "مستوى مهني", "مستوى جامعي", "مستوى تكويني"];
const employmentStatuses = ["ممتهن", "طالب جامعي", "موظف", "عامل حر", "متقاعد"];
const membershipCategories = [
  "منخرط عادي",
  "منخرط ناشط",
  "منخرط أكاديمي/خبير/مستشار",
  "منخرط طالب",
  "منخرط ممتهن",
  "منخرط بطال حامل فكرة",
  "منخرط موظف/إطار",
  "منخرط رائد أعمال/مسير مؤسسة إقتصادية/صاحب مشروع",
  "منخرط حرفي/مقاول ذاتي",
  "منخرط متعامل إقتصادي",
  "منخرط من أبناء الجالية الوطنية",
  "منخرط متقاعد",
];
const interests = [
  "الدراسات التنموية (إقتصادية وكل ما تعلق بالشأن التنموي)",
  "ريادة الأعمال والمقاولاتية",
  "الإستثمار",
  "الإبتكار",
  "التكوين، التدريب والتأهيل",
  "الدراسات الأكاديمية",
  "مجالات بحثية",
  "مجال آخر",
];

const fieldLabels: Record<string, string> = {
  name: "الإسم واللقب",
  email: "البريد الإلكتروني",
  phone: "رقم الهاتف",
  dateOfBirth: "تاريخ الميلاد",
  placeOfBirth: "مكان الميلاد",
  nationalId: "رقم التعريف الوطني",
  address: "العنوان",
  wilaya: "الولاية",
  educationLevel: "المستوى الدراسي",
  employmentStatus: "الوضعية الإجتماعية والمهنية",
  position: "المهنة/الصفة",
  organization: "المؤسسة التكوينية أو المهنية",
  membershipCategory: "فئة الإنخراط",
  interests: "مجالات الإهتمام",
  previousAssociation: "عضوية سابقة في نادٍ أو جمعية",
  reason: "دوافع الإنضمام",
  declarationAccepted: "تصريح خاص بطالب الإنخراط",
  identityDocument: "نسخة بطاقة التعريف الوطنية أو جواز السفر",
  personalPhoto: "صورة شخصية",
  cv: "السيرة الذاتية",
  diploma: "شهادة المؤهل العلمي أو المهني",
  criminalRecord: "صحيفة السوابق العدلية",
  duesReceipt: "وصل تسديد مستحقات الإنخراط",
};

const fieldClass = "mt-2 h-11 w-full rounded-lg border border-primary/15 bg-white px-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

export default function MembershipPage() {
  const locale = String(useParams<{ locale: string }>().locale || "ar");
  const [account, setAccount] = useState<{ state: "LOADING" | "REGISTER" | "VERIFY_EMAIL" | "APPLICATION" | "PENDING" | "REJECTED" | "APPROVED"; email?: string }>({ state: "LOADING" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/status").then((response) => response.json()).then(setAccount).catch(() => setAccount({ state: "REGISTER" }));
  }, []);

  async function compressImage(file: File, maxKB = 800): Promise<File> {
    if (!file.type.startsWith("image/") || file.size / 1024 < maxKB) return file;
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, Math.sqrt((maxKB * 1024) / file.size));
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.7));
    return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setLoading(true);
    setError("");

    // Compress image files before upload
    for (const [key, value] of Array.from(formData.entries())) {
      if (value instanceof File && value.size > 0) {
        const compressed = await compressImage(value);
        formData.set(key, compressed);
      }
    }

    try {
      const response = await fetch("/api/membership", { method: "POST", body: formData });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("تعذر الاتصال بالخادم. يرجى تقليل حجم الملفات والمحاولة مرة أخرى.");
      }
      const result = await response.json();

      if (!response.ok) {
        const invalidFields = result.fields && typeof result.fields === "object"
          ? Object.keys(result.fields).filter((field) => Array.isArray(result.fields[field]) && result.fields[field].length)
          : [];

        if (invalidFields.length) {
          const firstField = invalidFields[0];
          const labels = invalidFields.map((field) => fieldLabels[field] || field);
          const input = form.elements.namedItem(firstField);
          if (input instanceof HTMLElement) {
            input.focus();
            input.scrollIntoView({ behavior: "smooth", block: "center" });
          } else if (input instanceof RadioNodeList && input[0] instanceof HTMLElement) {
            input[0].focus();
            input[0].scrollIntoView({ behavior: "smooth", block: "center" });
          }
          throw new Error(`يرجى مراجعة الحقول التالية: ${labels.join("، ")}.`);
        }

        throw new Error(result.error || "تعذر إرسال الطلب");
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "تعذر إرسال الطلب. يرجى المحاولة مجددا.");
    } finally {
      setLoading(false);
    }
  }

  // Skip account gate — go directly to the form
  // if (account.state === "LOADING") return <main className="min-h-[60vh] bg-[#f5f8f4]" />;
  // if (account.state !== "APPLICATION") return <MembershipAccountGate state={account.state} email={account.email} locale={locale} />;

  if (submitted) {
    return (
      <main className="bg-[#f5f8f4] px-4 py-24" dir="rtl">
        <div className="mx-auto max-w-xl rounded-2xl border bg-white p-10 text-center shadow-sm">
          <CheckCircle className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-5 text-2xl font-bold">تم إرسال طلب الإنخراط بنجاح</h1>
          <p className="mt-3 leading-7 text-muted-foreground">ستراجع إدارة المركز معلوماتك والوثائق المرفقة وتتواصل معك عند الحاجة.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f5f8f4] py-12 md:py-16" dir="rtl">
      <div className="container-content max-w-5xl">
        <section className="overflow-hidden rounded-2xl bg-[#0b1f33] p-7 text-white shadow-xl md:p-10">
          <SectionHeading title="إستمارة الإنخراط في المركز الجزائري للتشبيك الاقتصادي و الاستثمار التنموي" light />

        </section>

        <form onSubmit={submit} className="mt-7 space-y-7">
          <FormSection title="المعلومات الشخصية" icon={<UserRound className="h-5 w-5" />}>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="الإسم واللقب"><Input name="name" required /></Field>
              <Field label="تاريخ الميلاد"><Input name="dateOfBirth" type="date" required /></Field>
              <Field label="مكان الميلاد"><Input name="placeOfBirth" required /></Field>
              <Field label="رقم التعريف الوطني"><Input name="nationalId" inputMode="numeric" required /></Field>
              <label className="block text-sm font-bold md:col-span-2">العنوان <span className="text-red-600">*</span><Textarea name="address" rows={3} required className="mt-2" /></label>
              <label className="block text-sm font-bold">الولاية <span className="text-red-600">*</span><select name="wilaya" required className={fieldClass}><option value="">اختر الولاية</option>{ALGERIA_WILAYAS.map((wilaya) => <option key={wilaya}>{wilaya}</option>)}</select></label>
              <Field label="رقم الهاتف"><Input name="phone" type="tel" required /></Field>
              <Field label="البريد الإلكتروني"><Input name="email" type="email" defaultValue={account.email || ""} required /></Field>
            </div>
            <ChoiceGroup name="educationLevel" label="المستوى الدراسي" options={educationLevels} />
            <ChoiceGroup name="employmentStatus" label="الوضعية الإجتماعية والمهنية" options={employmentStatuses} />
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-bold">المهنة/الصفة <span className="text-red-600">*</span><Textarea name="position" rows={3} required className="mt-2" /></label>
              <label className="block text-sm font-bold">المؤسسة التكوينية أو المهنية التي تنتمي إليها أو تديرها <span className="text-red-600">*</span><Textarea name="organization" rows={3} required className="mt-2" /></label>
            </div>
          </FormSection>

          <FormSection title="يرجى إختيار فئة إنخراطك معنا" icon={<UserRound className="h-5 w-5" />}>
            <ChoiceGroup name="membershipCategory" label="فئة الإنخراط" options={membershipCategories} columns />
            <fieldset>
              <legend className="mb-3 text-sm font-bold">مجالات الإهتمام <span className="text-red-600">*</span></legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {interests.map((interest) => <label key={interest} className="flex items-center gap-3 rounded-lg border bg-white p-3 text-sm"><input type="checkbox" name="interests" value={interest} className="h-4 w-4 accent-primary" />{interest}</label>)}
              </div>
            </fieldset>
            <ChoiceGroup name="previousAssociation" label="هل سبق لك أن كنت عضوا في نادٍ أو جمعية؟" options={["نعم", "لا"]} values={["yes", "no"]} />
            <label className="block text-sm font-bold">إذا كانت إجابتك نعم يرجى ذكر إسم النادي أو الجمعية التي كنت عضوا فيها أو الصفة التي تقلدتها<Textarea name="previousAssociationDetails" rows={3} className="mt-2" /></label>
            <Field label="يرجى تزويدنا بروابط حساباتك على مواقع التواصل الاجتماعي (فيسبوك، لينكدإن، إنستغرام، وغيرها)"><Input name="socialLinks" /></Field>
            <label className="block text-sm font-bold">يرجى، أن تشرح لنا في بضع كلمات دوافعك للانضمام إلى منظمتنا <span className="text-red-600">*</span><Textarea name="reason" rows={5} minLength={20} required className="mt-2" /></label>
            <p className="text-xs text-muted-foreground">الحد الأقصى لحجم كل ملف هو 4 ميغابايت. الصيغ المقبولة: PDF, JPG, PNG</p>
            <div className="grid gap-4 md:grid-cols-2">
              {REQUIRED_MEMBERSHIP_FILES.map((document) => (
                <label key={document.field} className="rounded-xl border border-dashed border-primary/25 bg-white p-4 text-sm font-bold">
                  تحميل {document.label} <span className="text-red-600">*</span>
                  <input name={document.field} type="file" accept={document.accept} required className="mt-3 block w-full text-xs font-normal file:me-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-bold file:text-primary" />
                </label>
              ))}
            </div>
            <label className="flex items-start gap-3 rounded-xl border bg-white p-4 text-sm font-bold"><input name="declarationAccepted" type="checkbox" required className="mt-1 h-4 w-4 accent-primary" />أصرح بصحة المعلومات الواردة في هذه الإستمارة</label>
          </FormSection>

          <FormSection title="خاص بإدارة المركز والمنخرط" icon={<ShieldCheck className="h-5 w-5" />}>
            <div className="rounded-xl border-s-4 border-primary bg-primary/[0.04] p-5 text-sm leading-8 text-muted-foreground">تتعهد إدارة المركز بالحفاظ على سرية وأمن المعلومات الشخصية الواردة في هذه الإستمارة وعدم استخدامها إلا في إطار تسيير شؤون العضوية والأنشطة المرتبطة بأهداف المركز وعدم الإفصاح عنها للغير إلا في الحالات التي يقتضيها القانون أو بموافقة صاحبها. يحق للمنخرط الإطلاع على بياناته الشخصية وطلب تحديثها عند الحاجة. تسلم نسخة من إستمارة الإنخراط للمنخرط في المركز.</div>
          </FormSection>

          {error && <p role="alert" aria-live="assertive" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}

          {/* Payment Summary */}
          <section className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm md:p-7">
            <header className="mb-6 flex items-center gap-3 border-b pb-4">
              <h2 className="text-xl font-black text-[#0b1f33]">دفع حقوق الاشتراك</h2>
            </header>

            <div className="space-y-4">
              {/* Subscription info */}
              <div className="rounded-xl border border-border/50 bg-[#fafbfa] p-4">
                <span className="text-sm font-bold text-[#0b1f33]">اشتراك سنوي — منخرط عادي</span>
              </div>

              {/* Payment method */}
              <div className="rounded-xl border border-border/50 bg-[#fafbfa] p-4">
                <p className="mb-3 text-sm font-bold text-[#0b1f33]">طريقة الدفع</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 rounded-lg border-2 border-primary/30 bg-white p-3 text-sm cursor-pointer">
                    <input type="radio" name="paymentMethod" value="cib" defaultChecked className="h-4 w-4 accent-primary" />
                    <span className="flex items-center gap-2">
                      <span className="rounded bg-[#0054a6] px-2 py-0.5 text-[0.65rem] font-black text-white tracking-wider">CIB</span>
                      <span className="font-bold text-[#0b1f33]">/</span>
                      <span className="rounded bg-[#d4a843] px-2 py-0.5 text-[0.65rem] font-black text-white tracking-wider">EDAHABIA</span>
                    </span>
                    <span className="text-xs text-muted-foreground">(Slick-Pay)</span>
                  </label>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">سيتم توجيهك لصفحة الدفع الآمن بعد إرسال الطلب.</p>
              </div>
            </div>
          </section>

          <Button type="submit" size="xl" disabled={loading} className="w-full rounded-full md:w-auto md:min-w-56"><Send className="h-5 w-5" />{loading ? "جارٍ إرسال الطلب..." : "إرسال طلب الإنخراط"}</Button>
        </form>
      </div>
    </main>
  );
}

function SectionHeading({ title, light = false }: { title: string; light?: boolean }) {
  return (
    <header>
      <h1 className={`${light ? "text-white" : "text-[#0b1f33]"} text-2xl font-black leading-tight md:text-3xl`}>{title}</h1>
    </header>
  );
}

function FormSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm md:p-7"><header className="mb-6 flex items-center gap-3 border-b pb-4"><span className="text-primary">{icon}</span><h2 className="text-xl font-black text-[#0b1f33]">{title}</h2></header><div className="space-y-6">{children}</div></section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <Label className="block text-sm font-bold">{label} <span className="text-red-600">*</span><span className="mt-2 block">{children}</span></Label>;
}

function ChoiceGroup({ name, label, options, values, columns = false }: { name: string; label: string; options: string[]; values?: string[]; columns?: boolean }) {
  return <fieldset><legend className="mb-3 text-sm font-bold">{label} <span className="text-red-600">*</span></legend><div className={`grid gap-3 ${columns ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>{options.map((option, index) => <label key={option} className="flex items-center gap-3 rounded-lg border bg-white p-3 text-sm"><input type={name === "interests" ? "checkbox" : "radio"} name={name} value={values?.[index] || option} required={name !== "interests"} className="h-4 w-4 accent-primary" />{option}</label>)}</div></fieldset>;
}
