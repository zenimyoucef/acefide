"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
      }
    } catch {
      // silent error
    }
  };

  return (
    <section
      className="relative overflow-hidden py-20 font-arabic md:py-24"
      dir="rtl"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b7a53] via-[#0b1f33] to-[#071b20]" />

      {/* Decorative elements */}
      <div className="pointer-events-none absolute -start-20 top-10 h-64 w-64 rounded-full bg-turquoise/10 blur-[100px]" />
      <div className="pointer-events-none absolute -end-16 bottom-10 h-48 w-48 rounded-full bg-accent/10 blur-[80px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[.04] [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="container-content relative z-10 scroll-reveal">
        <div className="mx-auto max-w-2xl text-center">
          {/* Icon */}
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 shadow-[0_0_20px_rgba(32,205,181,0.15)] backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:shadow-[0_0_30px_rgba(32,205,181,0.25)]">
            <Mail className="h-7 w-7 text-turquoise-light" />
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg leading-8 text-white/65">
            {t("desc")}
          </p>

          {subscribed ? (
            <div className="mx-auto mt-10 flex max-w-sm items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
              <CheckCircle className="h-6 w-6 text-turquoise-light" />
              <span className="text-lg font-medium text-white">{t("success")}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder")}
                required
                className="h-12 flex-1 rounded-xl border border-white/15 bg-white/[0.07] px-4 text-white placeholder:text-white/40 backdrop-blur-sm transition-all duration-300 focus:border-white/30 focus:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-turquoise/30"
              />
              <Button
                type="submit"
                size="lg"
                className="rounded-xl bg-white px-6 font-semibold text-primary shadow-[0_4px_15px_rgba(255,255,255,0.15)] transition-all duration-300 hover:bg-turquoise-light hover:text-[#052e2b] hover:shadow-[0_8px_25px_rgba(32,205,181,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              >
                {t("button")}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
