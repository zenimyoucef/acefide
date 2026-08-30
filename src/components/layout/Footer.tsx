"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/navigation";
import { MapPin, Phone, Mail, Facebook, ChevronUp, Send } from "lucide-react";
import Image from "next/image";
import logo from "../../../assets/acefide.png";

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
    <footer className="relative font-arabic" dir="rtl">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-l from-turquoise via-primary to-primary-dark" />

      {/* Main footer — light theme */}
      <div className="bg-white">
        <div className="container-content">
          <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr] lg:gap-8">

            {/* Brand + Description */}
            <div>
              <Link href="/" className="group mb-5 flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0">
                  <Image
                    src={logo}
                    alt="المركز الجزائري للتشبيك الاقتصادي و الاستثمار التنموي"
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="block text-base font-bold text-[#0b1f33] leading-snug group-hover:text-primary transition-colors duration-300">
                    المركز الجزائري
                  </span>
                  <span className="block text-[0.7rem] font-semibold text-muted-foreground leading-snug">
                    للتشبيك الاقتصادي والاستثمار التنموي
                  </span>
                </div>
              </Link>
              <p className="text-sm leading-7 text-muted-foreground max-w-xs">
                {t("footer.description")}
              </p>
              {/* Social */}
              <div className="mt-5 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group h-10 w-10 rounded-xl border border-border bg-muted/50 flex items-center justify-center text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="relative mb-5 text-sm font-bold text-[#0b1f33]">
                <span className="relative z-10">روابط سريعة</span>
                <span className="absolute -bottom-1 right-0 h-6 w-16 rounded bg-primary/10" />
              </h3>
              <ul className="space-y-0">
                {footerLinks.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      <span className="h-px w-0 bg-primary/50 group-hover:w-3 transition-all duration-300" />
                      {t(`nav.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="relative mb-5 text-sm font-bold text-[#0b1f33]">
                <span className="relative z-10">معلومات الاتصال</span>
                <span className="absolute -bottom-1 right-0 h-6 w-20 rounded bg-primary/10" />
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm text-muted-foreground leading-6 pt-1">
                    {address}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm text-muted-foreground" dir="ltr">
                    023 29 88 88
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm text-muted-foreground" dir="ltr">
                    acefidedz@gmail.com
                  </span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="relative mb-5 text-sm font-bold text-[#0b1f33]">
                <span className="relative z-10">النشرة البريدية</span>
                <span className="absolute -bottom-1 right-0 h-6 w-20 rounded bg-primary/10" />
              </h3>
              <p className="mb-4 text-sm text-muted-foreground leading-6">
                اشترك في نشرتنا البريدية لتحصل على آخر الأخبار والفعاليات.
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/60" />

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
            <p className="text-xs text-muted-foreground">
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.privacy")}
              </Link>
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
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
        className="fixed bottom-6 left-6 z-50 h-11 w-11 rounded-xl bg-primary text-white shadow-lg shadow-primary/25 flex items-center justify-center hover:bg-primary-dark hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5"
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
      <form onSubmit={handleSubmit} className="flex gap-0">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("placeholder")}
          required
          className="h-11 min-w-0 flex-1 rounded-r-xl border border-border border-r-0 bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
        <button
          type="submit"
          className="h-11 px-5 rounded-l-xl bg-primary text-white text-sm font-bold flex items-center gap-1.5 hover:bg-primary-dark transition-all duration-300 shrink-0"
        >
          <Send className="h-3.5 w-3.5" />
          {t("button")}
        </button>
      </form>
      {status !== "idle" && (
        <p
          role="status"
          className={`mt-2 text-xs ${
            status === "success" ? "text-primary" : "text-red-600"
          }`}
        >
          {status === "success" ? t("success") : t("error")}
        </p>
      )}
    </div>
  );
}
