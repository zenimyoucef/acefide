"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "../../../assets/acefide.png";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
// ThemeToggle removed — site is light-only
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "president", href: "/president" },
  { key: "projects", href: "/projects" },
  { key: "news", href: "/news" },
  { key: "contact", href: "/contact" },
];

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isRtl = locale === "ar";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isRtl && "font-arabic"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="container-content flex h-16 items-center justify-between">
        {/* Logo & Site Name */}
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3 group">
          <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 sm:h-12 sm:w-12">
            <Image src={logo} alt="ACEFIDE logo" width={48} height={48} className="object-cover" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-bold text-foreground leading-tight">
              ACEFIDE
            </span>
            <span className="hidden max-w-[150px] truncate text-[10px] text-muted-foreground leading-tight sm:block md:max-w-none">
              {t("home") === "الرئيسية"
                ? "المركز الجزائري للاستشراف الاقتصادي"
                : "Algerian Center for Economic Foresight"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="pressable whitespace-nowrap px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full hidden md:flex" aria-label={t("home") === "الرئيسية" ? "بحث" : "Search"}>
            <Search className="h-5 w-5" />
          </Button>
          <LanguageSwitcher />
          {/* theme toggle removed - light mode only */}
          <Button
            variant="default"
            size="sm"
            className="hidden md:inline-flex rounded-full"
            asChild
          >
            <Link href="/contact">
              {t("home") === "الرئيسية" ? "اتصل بنا" : "Contact Us"}
            </Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/98 shadow-xl backdrop-blur animate-menu-down">
          <nav className="container-content max-h-[calc(100vh-4rem)] overflow-y-auto py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="pressable px-4 py-3.5 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-border/40">
              <Button variant="default" size="lg" className="w-full rounded-full" asChild>
                <Link href="/contact">
                  {t("home") === "الرئيسية" ? "اتصل بنا" : "Contact Us"}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
