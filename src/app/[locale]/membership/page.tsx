"use client";

import { useState } from "react";
import { CheckCircle, FileUp, Send, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const wilayas = [
  "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار", "البليدة", "البويرة",
  "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر", "الجلفة", "جيجل", "سطيف", "سعيدة",
  "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة", "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة",
  "وهران", "البيض", "إليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تيسمسيلت", "الوادي", "خنشلة",
  "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت", "غرداية", "غليزان", "تيميمون", "برج باجي مختار",
  "أولاد جلال", "بني عباس", "عين صالح", "عين قزام", "تقرت", "جانت", "المغير", "المنيعة",
];

const educationLevels = ["مستوى تعليمي", "مستوى مهني", "مستوى جامعي", "مستوى تكويني"];
const employmentStatuses = ["ممتهن", "طالب جامعي", "موظف", "عامل حر", "متقاعد"];
const membershipCategories = [
  "منخرط عادي", "منخرط ناشط", "منخرط أكاديمي/باحث/مستشار", "منخرط طالب", "منخرط مهني",
  "منخرط بطال حامل فكرة", "منخرط موظف/إطار", "منخرط رائد أعمال/مدير مؤسسة اقتصادية/صاحب مشروع",
  "منخرط حرفي/مقاول ذاتي", "منخرط متعامل اقتصادي", "منخرط من أبناء الجالية الوطنية", "منخرط متقاعد",
];
const interests = [
  "الاستشراف الاقتصادي", "تطوير الاستثمار", "المقاولاتية وريادة الأعمال", "الابتكار والتحول الرقمي",
  "التنمية المستدامة", "البحث والدراسات", "الشراكات والتعاون", "الإعلام والاتصال الاقتصادي",
];
const documents = [
  ["identityDocument", "نسخة من بطاقة التعريف الوطنية أو جواز السفر"],
  ["personalPhoto", "صورة شخصية"],
  ["cv", "السيرة الذاتية CV"],
  ["diploma", "نسخة من شهادة المؤهل العلمي أو المهني"],
  ["criminalRecord", "نسخة من صحيفة السوابق العدلية سارية الصلاحية"],
  ["duesReceipt", "وصل تسديد مستحقات الانخراط"],
] as const;

const fieldLabels: Record<string, string> = {
  name: "الاسم واللقب",
  email: "البريد الإلكتروني",
  phone: "رقم الهاتف",
  dateOfBirth: "تاريخ الميلاد",
  placeOfBirth: "مكان الميلاد",
  nationalId: "رقم التعريف الوطني",
  address: "العنوان الكامل",
  wilaya: "الولاية",
  educationLevel: "المستوى الدراسي",
  employmentStatus: "الوضعية الاجتماعية والمهنية",
  position: "المهنة أو الصفة",
  membershipCategory: "فئة الانخراط",
  interests: "مجالات الاهتمام",
  previousAssociation: "الانخراط السابق في جمعية أو نادٍ",
  reason: "دوافع الانضمام",
  declarationAccepted: "التصريح والموافقة على الخصوصية",
};

const fieldClass = "mt-2 h-11 w-full rounded-lg border border-primary/15 bg-white px-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

export default function MembershipPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/membership", { method: "POST", body: formData });
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
      setError(cause instanceof Error ? cause.message : "تعذر إرسال الطلب. يرجى المحاولة مجددًا.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return <main className="bg-[#f5f8f4] px-4 py-24" dir="rtl"><div className="mx-auto max-w-xl rounded-2xl border bg-white p-10 text-center shadow-sm"><CheckCircle className="mx-auto h-16 w-16 text-primary" /><h1 className="mt-5 text-2xl font-bold">تم إرسال طلب الانخراط بنجاح</h1><p className="mt-3 leading-7 text-muted-foreground">ستراجع إدارة المركز معلوماتك والوثائق المرفقة وتتواصل معك عند الحاجة.</p></div></main>;
  }

  return (
    <main className="bg-[#f5f8f4] py-12 md:py-16" dir="rtl">
      <div className="container-content max-w-5xl">
        <header className="overflow-hidden rounded-2xl bg-[#0b1f33] p-7 text-white shadow-xl md:p-10">
          <p className="text-sm font-bold text-[#e5c978]">المركز الجزائري للاستشراف الاقتصادي وتطوير الاستثمار والمقاولاتية</p>
          <h1 className="mt-3 text-3xl font-black leading-tight md:text-4xl">استمارة طلب الانخراط</h1>
          <p className="mt-5 max-w-4xl leading-8 text-white/75">المركز جمعية وطنية اقتصادية تأسست سنة 2022، ومنصة تجمع الكفاءات والخبرات الوطنية داخل الوطن وخارجه لدعم الاستشراف الاقتصادي والاستثمار والمقاولاتية والابتكار. يرجى ملء جميع المعلومات وإرفاق الوثائق المطلوبة.</p>
        </header>

        <form onSubmit={submit} className="mt-7 space-y-7">
          <FormSection number="01" title="المعلومات الشخصية" icon={<UserRound className="h-5 w-5" />}>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="الاسم واللقب"><Input name="name" required /></Field>
              <Field label="تاريخ الميلاد"><Input name="dateOfBirth" type="date" required /></Field>
              <Field label="مكان الميلاد"><Input name="placeOfBirth" required /></Field>
              <Field label="رقم التعريف الوطني"><Input name="nationalId" inputMode="numeric" required /></Field>
              <Field label="رقم الهاتف"><Input name="phone" type="tel" required /></Field>
              <Field label="البريد الإلكتروني"><Input name="email" type="email" required /></Field>
              <label className="block text-sm font-bold md:col-span-2">العنوان الكامل<Textarea name="address" rows={3} required className="mt-2" /></label>
              <label className="block text-sm font-bold">الولاية<select name="wilaya" required className={fieldClass}><option value="">اختر الولاية</option>{wilayas.map((wilaya) => <option key={wilaya}>{wilaya}</option>)}</select></label>
            </div>
          </FormSection>

          <FormSection number="02" title="المستوى الدراسي والوضعية المهنية" icon={<UserRound className="h-5 w-5" />}>
            <ChoiceGroup name="educationLevel" label="المستوى الدراسي" options={educationLevels} />
            <ChoiceGroup name="employmentStatus" label="الوضعية الاجتماعية والمهنية" options={employmentStatuses} />
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="المهنة أو الصفة"><Input name="position" required /></Field>
              <Field label="المؤسسة التكوينية أو المهنية التي تنتمي إليها أو تديرها"><Input name="organization" /></Field>
            </div>
          </FormSection>

          <FormSection number="03" title="فئة الانخراط ومجالات الاهتمام" icon={<UserRound className="h-5 w-5" />}>
            <ChoiceGroup name="membershipCategory" label="فئة الانخراط" options={membershipCategories} columns />
            <fieldset><legend className="mb-3 text-sm font-bold">مجالات الاهتمام <span className="text-red-600">*</span></legend><div className="grid gap-3 sm:grid-cols-2">{interests.map((interest) => <label key={interest} className="flex items-center gap-3 rounded-lg border bg-white p-3 text-sm"><input type="checkbox" name="interests" value={interest} className="h-4 w-4 accent-primary" />{interest}</label>)}</div></fieldset>
            <ChoiceGroup name="previousAssociation" label="هل سبق لك الانخراط في جمعية أو نادٍ؟" options={["نعم", "لا"]} values={["yes", "no"]} />
            <label className="block text-sm font-bold">إذا كانت إجابتك نعم، اذكر اسم النادي أو الجمعية والصفة التي تقلدتها<Textarea name="previousAssociationDetails" rows={3} className="mt-2" /></label>
            <Field label="روابط حساباتك على مواقع التواصل الاجتماعي (فيسبوك، لينكدإن، إنستغرام وغيرها)"><Input name="socialLinks" /></Field>
            <label className="block text-sm font-bold">اشرح في بضع كلمات دوافعك للانضمام إلى منظمتنا <span className="text-red-600">*</span><Textarea name="reason" rows={5} minLength={20} required className="mt-2" /></label>
          </FormSection>

          <FormSection number="04" title="ملف الانخراط والوثائق المطلوبة" icon={<FileUp className="h-5 w-5" />}>
            <p className="rounded-lg bg-[#fff8e7] p-4 text-sm leading-7 text-[#6e571c]">الملفات المقبولة: PDF أو JPG أو PNG أو WebP، وبحجم أقصى 8 ميغابايت لكل ملف.</p>
            <div className="grid gap-4 md:grid-cols-2">{documents.map(([name, label]) => <label key={name} className="rounded-xl border border-dashed border-primary/25 bg-white p-4 text-sm font-bold">{label} <span className="text-red-600">*</span><input name={name} type="file" accept="application/pdf,image/jpeg,image/png,image/webp" required className="mt-3 block w-full text-xs font-normal file:me-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-bold file:text-primary" /></label>)}</div>
          </FormSection>

          <FormSection number="05" title="التصريح والخصوصية" icon={<ShieldCheck className="h-5 w-5" />}>
            <div className="rounded-xl border-s-4 border-primary bg-primary/[0.04] p-5 text-sm leading-7 text-muted-foreground">تتعهد إدارة المركز بالحفاظ على سرية وأمن المعلومات الشخصية الواردة في هذه الاستمارة وعدم استخدامها إلا في إطار تسيير شؤون العضوية والأنشطة المرتبطة بأهداف المركز، وعدم الإفصاح عنها للغير إلا في الحالات التي يقتضيها القانون أو بموافقة صاحبها. يحق للمنخرط الاطلاع على بياناته الشخصية وطلب تحديثها عند الحاجة، وتتم تسوية أي نزاع وفق النظام الداخلي للمركز.</div>
            <label className="flex items-start gap-3 rounded-xl border bg-white p-4 text-sm font-bold"><input name="declarationAccepted" type="checkbox" required className="mt-1 h-4 w-4 accent-primary" />أصرح بصحة المعلومات الواردة في هذه الاستمارة وأوافق على معالجة بياناتي وفق بيان الخصوصية.</label>
          </FormSection>

          {error && <p role="alert" aria-live="assertive" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
          <Button type="submit" size="xl" disabled={loading} className="w-full rounded-full md:w-auto md:min-w-56"><Send className="h-5 w-5" />{loading ? "جارٍ إرسال الطلب..." : "إرسال طلب الانخراط"}</Button>
        </form>
      </div>
    </main>
  );
}

function FormSection({ number, title, icon, children }: { number: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm md:p-7"><header className="mb-6 flex items-center gap-3 border-b pb-4"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-black text-white">{number}</span><span className="text-primary">{icon}</span><h2 className="text-xl font-black text-[#0b1f33]">{title}</h2></header><div className="space-y-6">{children}</div></section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <Label className="block text-sm font-bold">{label} <span className="text-red-600">*</span><span className="mt-2 block">{children}</span></Label>;
}

function ChoiceGroup({ name, label, options, values, columns = false }: { name: string; label: string; options: string[]; values?: string[]; columns?: boolean }) {
  return <fieldset><legend className="mb-3 text-sm font-bold">{label} <span className="text-red-600">*</span></legend><div className={`grid gap-3 ${columns ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>{options.map((option, index) => <label key={option} className="flex items-center gap-3 rounded-lg border bg-white p-3 text-sm"><input type="radio" name={name} value={values?.[index] || option} required className="h-4 w-4 accent-primary" />{option}</label>)}</div></fieldset>;
}
