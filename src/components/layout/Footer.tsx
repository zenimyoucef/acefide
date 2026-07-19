"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { MapPin, Phone, Mail, Facebook } from "lucide-react";
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
  const locale = useLocale();
  const pathname = usePathname();
  const isRtl = locale === "ar";
  const address = isRtl ? "المبنى رقم 60، الدابوس، العاشور، درارية، الجزائر العاصمة" : locale === "fr" ? "Bâtiment 60, Dely Ibrahim, El Achour, Draria, Alger" : "Building 60, Dely Ibrahim, El Achour, Draria, Algiers";

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer
      className={cn(
        "border-t border-border/40 bg-muted/50",
        isRtl && "font-arabic"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="container-content py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg overflow-hidden flex items-center justify-center">
                <Image src={logo} alt="ACEFIDE logo" width={48} height={48} className="object-cover" />
              </div>
              <span className="text-lg font-bold">ACEFIDE</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {t("footer.description")}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  {address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  023 29 88 88
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  acefidedz@gmail.com
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t("newsletter.title")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("newsletter.desc")}
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/40 py-6">
        <div className="container-content flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 min-[420px]:flex-row">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("placeholder")}
        required
        className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise"
      />
      <button
        type="submit"
        className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors shrink-0"
      >
        {t("button")}
      </button>
    </form>
    {status !== "idle" && <p role="status" className={`mt-2 text-xs ${status === "success" ? "text-primary" : "text-red-700"}`}>{status === "success" ? t("success") : t("error")}</p>}
    </div>
  );
}
