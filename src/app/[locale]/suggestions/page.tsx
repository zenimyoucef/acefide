"use client";

import { useState, useRef } from "react";
import { Send, CheckCircle, Lightbulb, AlertTriangle, Paperclip, X } from "lucide-react";

export default function SuggestionsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState<"suggestion" | "concern">("suggestion");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        setError("الحد الأقصى لحجم الملف هو 10 ميغابايت");
        return;
      }
      setFile(selected);
      setError("");
    }
  }

  function removeFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setLoading(true);
    setError("");

    try {
      const body = new FormData();
      body.append("name", formData.get("name") as string);
      body.append("email", (formData.get("email") as string) || "");
      body.append("type", type);
      body.append("subject", formData.get("subject") as string);
      body.append("message", formData.get("message") as string);
      if (file) body.append("file", file);

      const res = await fetch("/api/suggestions", {
        method: "POST",
        body,
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error || "تعذر إرسال الرسالة. يرجى المحاولة مرة أخرى.");
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
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0b1f33] md:text-4xl">إقتراحاتكم و إنشغالاتكم</h1>
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

          {/* File upload */}
          <div>
            <p className="text-sm font-bold mb-2">مرفق (اختياري)</p>
            {file ? (
              <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/[0.03] px-4 py-3">
                <Paperclip className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm truncate flex-1">{file.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                <button type="button" onClick={removeFile} className="h-6 w-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition shrink-0">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-white px-6 py-8 text-center transition hover:border-primary/40 hover:bg-primary/[0.02]">
                <Paperclip className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold text-foreground">اضغط لاختيار ملف</p>
                  <p className="text-xs text-muted-foreground mt-1">صور أو PDF — الحد الأقصى 10 ميغابايت</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            )}
          </div>

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
