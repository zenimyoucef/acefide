"use client";
import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const locale = useLocale(); const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(""); const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), password: data.get("password"), locale }), signal: AbortSignal.timeout(15_000) });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) return setError(result?.error || "Unable to sign in. Please try again.");
      router.replace("/admin"); router.refresh();
    } catch {
      setError(locale === "ar" ? "تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى." : locale === "fr" ? "Impossible de contacter le serveur. Veuillez réessayer." : "Unable to contact the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return <div className="min-h-[70vh] bg-[#f7f8f6] px-4 py-20" dir={locale === "ar" ? "rtl" : "ltr"}><form onSubmit={submit} className="mx-auto max-w-md rounded-2xl border bg-white p-8 shadow-sm"><div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white"><LockKeyhole /></div><h1 className="text-2xl font-bold">{locale === "ar" ? "دخول الإدارة" : locale === "fr" ? "Connexion à l’administration" : "Administration sign in"}</h1><p className="mt-2 text-sm text-muted-foreground">{locale === "ar" ? "هذه المساحة مخصصة للمستخدمين المخولين." : locale === "fr" ? "Cet espace est réservé aux utilisateurs autorisés." : "This area is restricted to authorized users."}</p><div className="mt-7 space-y-5"><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="username" required /></div><div className="space-y-2"><Label htmlFor="password">{locale === "ar" ? "كلمة المرور" : "Password"}</Label><Input id="password" name="password" type="password" autoComplete="current-password" minLength={8} required /></div></div>{error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}<Button disabled={loading} className="mt-6 w-full">{loading ? "…" : locale === "ar" ? "دخول" : locale === "fr" ? "Se connecter" : "Sign in"}</Button></form></div>;
}
