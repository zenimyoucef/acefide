"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const isRtl = locale === "ar";
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
      className={cn(
        "py-20 gradient-primary relative overflow-hidden",
        isRtl && "font-arabic"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Decorative elements */}
      <div className="absolute top-10 -left-20 w-40 h-40 bg-turquoise/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 -right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" />

      <div className="container-content relative z-10 scroll-reveal">
        <div className="max-w-2xl mx-auto text-center">
          <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-white/70 text-lg mb-8">
            {t("desc")}
          </p>

          {subscribed ? (
            <div className="flex items-center justify-center gap-3 text-white bg-white/10 rounded-xl p-6">
              <CheckCircle className="h-6 w-6 text-turquoise-light" />
              <span className="text-lg font-medium">{t("success")}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder")}
                required
                className="flex-1 h-12 rounded-xl border-0 bg-white/10 text-white placeholder:text-white/50 px-4 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-xl font-semibold"
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
