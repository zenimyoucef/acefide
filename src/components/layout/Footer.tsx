"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/navigation";
import { MapPin, Phone, Mail, Facebook, ChevronUp, Send } from "lucide-react";
import Image from "next/image";
import logo from "../../../assets/acendinobkg.png";

const footerLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "president", href: "/president" },
  { key: "events", href: "/events" },
  { key: "news", href: "/news" },
  { key: "partners", href: "/partners" },
  { key: "contact", href: "/contact" },
];

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/ACEFIDEAlgeria", label: "Facebook" },
];

export function Footer() {
  const t = useTranslations();
  const pathname = usePathname();
  const address = "المبنى رقم 60، الدابوس، العاشور، درارية، الجزائر العاصمة";

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative font-arabic overflow-hidden" dir="rtl">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-l from-turquoise via-primary to-primary-dark" />

      {/* Main footer — rich gradient background */}
      <div className="relative bg-gradient-to-br from-[#0b2a20] via-[#0d1f33] to-[#0a1628]">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-primary/8 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-turquoise/6 blur-[80px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/3 blur-[120px]" />
        </div>

        <div className="relative container-content py-14">
          {/* Mobile: centered logo. Desktop: 4-col grid */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-start lg:grid lg:grid-cols-[1.2fr_1fr_1fr_1.1fr] lg:gap-8">

            {/* Brand — centered on mobile */}
            <div className="mb-10 lg:mb-0">
              <Link href="/" className="group mb-5 flex flex-col items-center lg:items-start gap-3">
                <div className="relative h-24 w-24 shrink-0 lg:h-16 lg:w-16">
                  <Image
                    src={logo}
                    alt="المركز الجزائري للتشبيك الاقتصادي و الاستثمار التنموي"
                    fill
                    sizes="96px"
                    className="object-contain drop-shadow-[0_0_20px_rgba(58,191,165,0.15)]"
                  />
                </div>
                <div className="text-center lg:text-start">
                  <span className="block text-lg font-bold text-white leading-snug group-hover:text-turquoise transition-colors duration-300">
                    المركز الجزائري
                  </span>
                  <span className="block text-xs font-semibold text-white/50 leading-snug">
                    للتشبيك الاقتصادي والاستثمار التنموي
                  </span>
                </div>
              </Link>
              <p className="text-sm leading-7 text-white/35 max-w-xs mx-auto lg:mx-0">
                {t("footer.description")}
              </p>
              {/* Social */}
              <div className="mt-5 flex items-center justify-center lg:justify-start gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/50 hover:border-turquoise/40 hover:text-turquoise hover:bg-turquoise/[0.08] transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links — hidden on mobile */}
            <div className="hidden lg:block">
              <h3 className="relative mb-5 text-sm font-bold text-white">
                <span className="relative z-10">روابط سريعة</span>
                <span className="absolute -bottom-1 right-0 h-6 w-16 rounded bg-turquoise/10" />
              </h3>
              <ul className="space-y-0">
                {footerLinks.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 py-2 text-sm text-white/40 hover:text-turquoise transition-colors duration-200"
                    >
                      <span className="h-px w-0 bg-turquoise/50 group-hover:w-3 transition-all duration-300" />
                      {t(`nav.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div className="text-center lg:text-start">
              <h3 className="relative mb-5 text-sm font-bold">
                <span className="relative z-10 text-turquoise">معلومات الاتصال</span>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 justify-center lg:justify-start">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-turquoise/20 bg-turquoise/[0.06]">
                    <MapPin className="h-3.5 w-3.5 text-turquoise/70" />
                  </span>
                  <span className="text-sm text-white/45 leading-6 pt-1">
                    {address}
                  </span>
                </li>
                <li className="flex items-center gap-3 justify-center lg:justify-start">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-turquoise/20 bg-turquoise/[0.06]">
                    <Phone className="h-3.5 w-3.5 text-turquoise/70" />
                  </span>
                  <span className="text-sm text-white/45" dir="ltr">
                    023 29 88 88
                  </span>
                </li>
                <li className="flex items-center gap-3 justify-center lg:justify-start">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-turquoise/20 bg-turquoise/[0.06]">
                    <Mail className="h-3.5 w-3.5 text-turquoise/70" />
                  </span>
                  <span className="text-sm text-white/45" dir="ltr">
                    acefidedz@gmail.com
                  </span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="text-center lg:text-start">
              <h3 className="relative mb-5 text-sm font-bold">
                <span className="relative z-10 text-turquoise">النشرة البريدية</span>
              </h3>
              <p className="mb-4 text-sm text-white/35 leading-6">
                اشترك في نشرتنا البريدية لتحصل على آخر الأخبار والفعاليات.
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-gradient-to-l from-transparent via-white/10 to-transparent" />

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-white/25">
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-xs text-white/25 hover:text-turquoise/60 transition-colors"
              >
                {t("footer.privacy")}
              </Link>
              <Link
                href="#"
                className="text-xs text-white/25 hover:text-turquoise/60 transition-colors"
              >
                {t("footer.terms")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 left-6 z-50 h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-turquoise text-white shadow-lg shadow-primary/25 flex items-center justify-center hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5"
        aria-label="العودة للأعلى"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </footer>
  );
}

function NewsletterForm() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

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
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-0 max-w-xs mx-auto lg:mx-0">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("placeholder")}
          required
          className="h-11 min-w-0 flex-1 rounded-r-xl border border-white/10 border-r-0 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-turquoise/40 focus:bg-white/[0.06] transition-all"
        />
        <button
          type="submit"
          className="h-11 px-5 rounded-l-xl bg-gradient-to-l from-turquoise to-primary text-white text-sm font-bold flex items-center gap-1.5 hover:from-turquoise-light hover:to-primary-light transition-all duration-300 shrink-0"
        >
          <Send className="h-3.5 w-3.5" />
          {t("button")}
        </button>
      </form>
      {status !== "idle" && (
        <p
          role="status"
          className={`mt-2 text-xs ${
            status === "success" ? "text-turquoise" : "text-red-400"
          }`}
        >
          {status === "success" ? t("success") : t("error")}
        </p>
      )}
    </div>
  );
}
