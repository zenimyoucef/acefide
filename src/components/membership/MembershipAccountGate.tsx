"use client";

import { useState } from "react";
import { CheckCircle2, MailCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type State = "LOADING" | "REGISTER" | "VERIFY_EMAIL" | "PENDING" | "REJECTED" | "APPROVED";
export function MembershipAccountGate({ state: initialState, email: initialEmail, locale }: { state: State; email?: string; locale: string }) {
  const [state, setState] = useState(initialState);
  const [email, setEmail] = useState(initialEmail || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const data = new FormData(event.currentTarget);
    const nextEmail = String(data.get("email") || "");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.get("name"), email: nextEmail, password: data.get("password"), passwordConfirmation: data.get("passwordConfirmation"), locale }),
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok && response.status !== 503) return setMessage(result.error || "تعذر إنشاء الحساب.");
    setEmail(nextEmail);
    setState("VERIFY_EMAIL");
    if (!response.ok) setMessage(result.error);
  }

  async function resend() {
    setLoading(true);
    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale }),
    });
    setLoading(false);
    setMessage(response.ok ? "تم إرسال رابط جديد." : "تعذر إرسال الرابط.");
  }

  if (state === "REGISTER")
    return (
      <main className="bg-[#f5f8f4] px-4 py-16" dir="rtl">
        <form onSubmit={register} className="mx-auto max-w-md rounded-2xl border bg-white p-8 shadow-sm">
          <UserPlus className="h-10 w-10 text-primary" />
          <h1 className="mt-4 text-2xl font-bold">إنشاء حساب الانخراط</h1>
          <p className="mt-2 text-sm text-muted-foreground">أكد بريدك الإلكتروني قبل ملء الاستمارة وإرسال الوثائق.</p>
          <div className="mt-6 space-y-4">
            <Label>الاسم الكامل<Input name="name" required minLength={2} /></Label>
            <Label>البريد الإلكتروني<Input name="email" type="email" required /></Label>
            <Label>كلمة المرور<Input name="password" type="password" minLength={8} maxLength={128} required /></Label>
            <Label>تأكيد كلمة المرور<Input name="passwordConfirmation" type="password" minLength={8} maxLength={128} required /></Label>
          </div>
          {message && <p role="alert" className="mt-4 text-sm text-red-700">{message}</p>}
          <Button disabled={loading} className="mt-6 w-full">{loading ? "…" : "إنشاء الحساب"}</Button>
        </form>
      </main>
    );

  if (state === "VERIFY_EMAIL")
    return (
      <Status icon={<MailCheck />} title="تحقق من بريدك الإلكتروني" text={`أرسلنا رابط التحقق إلى ${email}. افتحه لمتابعة استمارة الانخراط.`}>
        <Button disabled={loading} onClick={resend} variant="outline">إعادة إرسال الرابط</Button>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </Status>
    );

  if (state === "PENDING")
    return <Status icon={<CheckCircle2 />} title="طلبك قيد المراجعة" text="تم استلام معلوماتك ووثائقك. ستظهر لوحة العضو بعد موافقة الإدارة." />;

  if (state === "REJECTED")
    return <Status icon={<MailCheck />} title="تمت مراجعة طلبك" text="يرجى التواصل مع الإدارة لمزيد من المعلومات." />;

  return <Status icon={<CheckCircle2 />} title="تمت الموافقة على طلبك" text="لوحة العضو قيد الإعداد وستتوفر هنا قريباً." />;
}

function Status({ icon, title, text, children }: { icon: React.ReactNode; title: string; text: string; children?: React.ReactNode }) {
  return (
    <main className="bg-[#f5f8f4] px-4 py-20" dir="rtl">
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-9 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">{icon}</div>
        <h1 className="mt-5 text-2xl font-bold">{title}</h1>
        <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </main>
  );
}
