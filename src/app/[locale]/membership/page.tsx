"use client";

import { useState } from "react";
import { CheckCircle, Send, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const wilayas = [
  "ولاية أدرار", "ولاية الشلف", "ولاية الأغواط", "ولاية أم البواقي", "ولاية باتنة", "ولاية بجاية", "ولاية بسكرة", "ولاية بشار", "ولاية البليدة", "ولاية البويرة",
  "ولاية تمنراست", "ولاية تبسة", "ولاية تلمسان", "ولاية تيارت", "ولاية تيزي وزو", "ولاية الجزائر", "ولاية الجلفة", "ولاية جيجل", "ولاية سطيف", "ولاية سعيدة",
  "ولاية سكيكدة", "ولاية سيدي بلعباس", "ولاية عنابة", "ولاية قالمة", "ولاية قسنطينة", "ولاية المدية", "ولاية مستغانم", "ولاية المسيلة", "ولاية معسكر", "ولاية ورقلة",
  "ولاية وهران", "ولاية البيض", "ولاية إليزي", "ولاية برج بوعريريج", "ولاية بومرداس", "ولاية الطارف", "ولاية تندوف", "ولاية تيسمسيلت", "ولاية الوادي", "ولاية خنشلة",
  "ولاية سوق أهراس", "ولاية تيبازة", "ولاية ميلة", "ولاية عين الدفلى", "ولاية النعامة", "ولاية عين تموشنت", "ولاية غرداية", "ولاية غليزان", "ولاية تيميمون", "ولاية برج باجي مختار",
  "ولاية أولاد جلال", "ولاية بني عباس", "ولاية عين صالح", "ولاية عين قزام", "ولاية تقرت", "ولاية جانت", "ولاية المغير", "ولاية المنيعة",
];

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
      setError(cause instanceof Error ? cause.message : "تعذر إرسال الطلب. يرجى المحاولة مجددا.");
    } finally {
      setLoading(false);
    }
  }

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
          <SectionHeading number="01" title="إستمارة الإنخراط في المركز الجزائري للإستشراف الإقتصادي وتطوير الإستثمار والمقاولاتية" light />
          <div className="mt-6 space-y-5 text-sm leading-8 text-white/80">
            <p>المركز الجزائري للإستشراف الإقتصادي وتطوير الإستثمار والمقاولاتية هو مؤسسة جمعوية (منظمة غير حكومية) تأسست سنة 2022 في إطار أحكام القانون رقم 12-06 المتعلق بالجمعيات.</p>
            <p>يعد المركز فضاء للتفكير الإستراتيجي والتسيير الإقتصادي، ومنصة تجمع الكفاءات والخبرات الوطنية داخل الوطن وخارجه المواكبة لقضايا التنمية الإقتصادية والإستثمار والمقاولاتية.</p>
            <p>ويعمل المركز على المساهمة في دعم الجهود العمومية الرامية إلى تحقيق التنمية المستدامة وتنويع الإقتصاد الوطني وتحسين السياسات المرتبطة بالإستثمار وريادة الأعمال.</p>
            <p>كما يسعى المركز إلى تعزيز التحول الرقمي والإبتكار باعتبارهما ركيزتين أساسيتين للتنمية الإقتصادية الحديثة، من خلال تقديم رؤى إستشرافية ومقترحات عملية وخطوات إستباقية وتنظيم نشاطات وفعاليات إقتصادية من شأنها دعم صناع القرار ومختلف الفاعلين الإقتصاديين.</p>
          </div>
          <div className="mt-6 rounded-xl border border-white/15 bg-white/10 p-5 text-sm leading-8 text-white/85">
            <p className="font-bold">ملف الإنخراط:</p>
            <ul className="list-inside list-disc">
              <li>إستمارة الإنخراط في المركز.</li>
              <li>نسخة من بطاقة التعريف الوطنية أو جواز سفر.</li>
              <li>صور شخصية 3.</li>
              <li>سيرة ذاتية.</li>
              <li>نسخة من شهادة المؤهل العلمي أو المهني.</li>
              <li>نسخة من صحيفة السوابق العدلية سارية الصلاحية.</li>
              <li>وصل تسديد مستحقات الإنخراط.</li>
            </ul>
          </div>
        </section>

        <form onSubmit={submit} className="mt-7 space-y-7">
          <FormSection number="02" title="المعلومات الشخصية" icon={<UserRound className="h-5 w-5" />}>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="الإسم واللقب"><Input name="name" required /></Field>
              <Field label="تاريخ الميلاد"><Input name="dateOfBirth" type="date" required /></Field>
              <Field label="مكان الميلاد"><Input name="placeOfBirth" required /></Field>
              <Field label="رقم التعريف الوطني"><Input name="nationalId" inputMode="numeric" required /></Field>
              <label className="block text-sm font-bold md:col-span-2">العنوان <span className="text-red-600">*</span><Textarea name="address" rows={3} required className="mt-2" /></label>
              <label className="block text-sm font-bold">الولاية <span className="text-red-600">*</span><select name="wilaya" required className={fieldClass}><option value="">اختر الولاية</option>{wilayas.map((wilaya) => <option key={wilaya}>{wilaya}</option>)}</select></label>
              <Field label="رقم الهاتف"><Input name="phone" type="tel" required /></Field>
              <Field label="البريد الإلكتروني"><Input name="email" type="email" required /></Field>
            </div>
            <ChoiceGroup name="educationLevel" label="المستوى الدراسي" options={educationLevels} />
            <ChoiceGroup name="employmentStatus" label="الوضعية الإجتماعية والمهنية" options={employmentStatuses} />
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-bold">المهنة/الصفة <span className="text-red-600">*</span><Textarea name="position" rows={3} required className="mt-2" /></label>
              <label className="block text-sm font-bold">المؤسسة التكوينية أو المهنية التي تنتمي إليها أو تديرها <span className="text-red-600">*</span><Textarea name="organization" rows={3} required className="mt-2" /></label>
            </div>
          </FormSection>

          <FormSection number="03" title="يرجى إختيار فئة إنخراطك معنا" icon={<UserRound className="h-5 w-5" />}>
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
            <label className="rounded-xl border border-dashed border-primary/25 bg-white p-4 text-sm font-bold">تحميل السيرة الذاتية/CV <span className="text-red-600">*</span><input name="cv" type="file" accept="application/pdf,image/jpeg,image/png,image/webp,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required className="mt-3 block w-full text-xs font-normal file:me-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-bold file:text-primary" /></label>
            <label className="flex items-start gap-3 rounded-xl border bg-white p-4 text-sm font-bold"><input name="declarationAccepted" type="checkbox" required className="mt-1 h-4 w-4 accent-primary" />أصرح بصحة المعلومات الواردة في هذه الإستمارة</label>
          </FormSection>

          <FormSection number="04" title="خاص بإدارة المركز والمنخرط" icon={<ShieldCheck className="h-5 w-5" />}>
            <div className="rounded-xl border-s-4 border-primary bg-primary/[0.04] p-5 text-sm leading-8 text-muted-foreground">تتعهد إدارة المركز بالحفاظ على سرية وأمن المعلومات الشخصية الواردة في هذه الإستمارة وعدم استخدامها إلا في إطار تسيير شؤون العضوية والأنشطة المرتبطة بأهداف المركز وعدم الإفصاح عنها للغير إلا في الحالات التي يقتضيها القانون أو بموافقة صاحبها. يحق للمنخرط الإطلاع على بياناته الشخصية وطلب تحديثها عند الحاجة. تسلم نسخة من إستمارة الإنخراط للمنخرط في المركز.</div>
          </FormSection>

          {error && <p role="alert" aria-live="assertive" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
          <Button type="submit" size="xl" disabled={loading} className="w-full rounded-full md:w-auto md:min-w-56"><Send className="h-5 w-5" />{loading ? "جارٍ إرسال الطلب..." : "إرسال طلب الإنخراط"}</Button>
        </form>
      </div>
    </main>
  );
}

function SectionHeading({ number, title, light = false }: { number: string; title: string; light?: boolean }) {
  return (
    <header className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-black text-white">{number}</span>
      <h1 className={`${light ? "text-white" : "text-[#0b1f33]"} text-2xl font-black leading-tight md:text-3xl`}>{title}</h1>
    </header>
  );
}

function FormSection({ number, title, icon, children }: { number: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm md:p-7"><header className="mb-6 flex items-center gap-3 border-b pb-4"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-black text-white">{number}</span><span className="text-primary">{icon}</span><h2 className="text-xl font-black text-[#0b1f33]">{title}</h2></header><div className="space-y-6">{children}</div></section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <Label className="block text-sm font-bold">{label} <span className="text-red-600">*</span><span className="mt-2 block">{children}</span></Label>;
}

function ChoiceGroup({ name, label, options, values, columns = false }: { name: string; label: string; options: string[]; values?: string[]; columns?: boolean }) {
  return <fieldset><legend className="mb-3 text-sm font-bold">{label} <span className="text-red-600">*</span></legend><div className={`grid gap-3 ${columns ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>{options.map((option, index) => <label key={option} className="flex items-center gap-3 rounded-lg border bg-white p-3 text-sm"><input type={name === "interests" ? "checkbox" : "radio"} name={name} value={values?.[index] || option} required={name !== "interests"} className="h-4 w-4 accent-primary" />{option}</label>)}</div></fieldset>;
}
