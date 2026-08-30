"use client";

import { useState } from "react";
import { Send, CheckCircle, MessageSquare, Lightbulb, AlertTriangle } from "lucide-react";

export default function SuggestionsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState<"suggestion" | "concern">("suggestion");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          type: formData.get("type"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("تعذر إرسال الرسالة. يرجى المحاولة مرة أخرى.");
      }
    } catch {
      setError("تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-[70vh] bg-[#f7f8f4] px-4 py-24" dir="rtl">
        <div className="mx-auto max-w-xl rounded-2xl border bg-white p-10 text-center shadow-sm">
          <CheckCircle className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-5 text-2xl font-bold">تم إرسال رسالتك بنجاح</h1>
          <p className="mt-3 leading-7 text-muted-foreground">شكراً لاهتمامك. سنتمكن من مراجعة رسالتك والرد عليك في أقرب وقت ممكن.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#f7f8f4] py-12 md:py-16" dir="rtl">
      <div className="container-content max-w-3xl">
        <header className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">تواصل معنا</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0b1f33] md:text-4xl">اقتراحات وملاحظات</h1>
          <p className="mt-4 text-muted-foreground">شاركنا اقتراحاتك أو ملاحظاتك أو مشاكلك. نحرص على الاستماع إليك وتحسين خدماتنا.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type selector */}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${type === "suggestion" ? "border-primary bg-primary/[0.04]" : "border-border bg-white hover:border-primary/30"}`}>
              <input type="radio" name="type" value="suggestion" checked={type === "suggestion"} onChange={() => setType("suggestion")} className="sr-only" />
              <Lightbulb className={`h-5 w-5 ${type === "suggestion" ? "text-primary" : "text-muted-foreground"}`} />
              <div>
                <p className="font-bold">اقتراح</p>
                <p className="text-xs text-muted-foreground">فكرة جديدة لتحسين العمل</p>
              </div>
            </label>
            <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${type === "concern" ? "border-red-400 bg-red-50" : "border-border bg-white hover:border-red-200"}`}>
              <input type="radio" name="type" value="concern" checked={type === "concern"} onChange={() => setType("concern")} className="sr-only" />
              <AlertTriangle className={`h-5 w-5 ${type === "concern" ? "text-red-600" : "text-muted-foreground"}`} />
              <div>
                <p className="font-bold">ملاحظة أو مشكلة</p>
                <p className="text-xs text-muted-foreground">إبلاغ عن مشكلة أو إبداء ملاحظة</p>
              </div>
            </label>
          </div>

          {/* Form fields */}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-bold">
              الاسم <span className="text-red-600">*</span>
              <input name="name" required className="mt-2 h-11 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </label>
            <label className="block text-sm font-bold">
              البريد الإلكتروني
              <input name="email" type="email" className="mt-2 h-11 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </label>
          </div>

          <label className="block text-sm font-bold">
            الموضوع <span className="text-red-600">*</span>
            <input name="subject" required className="mt-2 h-11 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" placeholder="عن ماذا تريد التحدث؟" />
          </label>

          <label className="block text-sm font-bold">
            الرسالة <span className="text-red-600">*</span>
            <textarea name="message" required rows={6} className="mt-2 w-full rounded-lg border border-border bg-white p-3 text-sm leading-7 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" placeholder="اكتب رسالتك هنا..." />
          </label>

          {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}

          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-60 sm:w-auto">
            <Send className="h-4 w-4" />
            {loading ? "جارٍ الإرسال..." : "إرسال"}
          </button>
        </form>
      </div>
    </main>
  );
}
