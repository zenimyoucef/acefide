"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "../../../assets/acefide.png";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "events", href: "/events" },
  { key: "news", href: "/news" },
] as const;

const resourceItems = [
  { key: "president", href: "/president" },
  { key: "publications", href: "/publications" },
  { key: "partners", href: "/partners" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isRtl = locale === "ar";
  const resourcesLabel = isRtl ? "المزيد" : locale === "fr" ? "Ressources" : "Resources";
  const inscriptionLabel = isRtl ? "التسجيل" : locale === "fr" ? "Inscription" : "Register";

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 shadow-[0_1px_18px_rgba(11,31,51,0.04)] backdrop-blur-xl", isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <div className="container-content flex h-[4.5rem] items-center justify-between">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <Link href="/" className="group shrink-0" aria-label="ACEFIDE home">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-[1.03]">
              <Image src={logo} alt="ACEFIDE logo" width={44} height={44} className="object-cover" priority />
            </span>
          </Link>
          <Link
            href="/"
            dir="rtl"
            className="min-w-0 max-w-[13rem] text-right text-[0.68rem] font-bold leading-[1.35] text-[#0b1f33] transition-colors hover:text-primary sm:max-w-[18rem] sm:text-xs xl:max-w-[23rem]"
            title="المركز الجزائري للإستشراف الاقتصادي و تطوير الإستثمار و المقاولاتية"
          >
            المركز الجزائري للإستشراف الاقتصادي و تطوير الإستثمار و المقاولاتية
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.key} href={item.href} className={cn("pressable whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors", pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
              {t(item.key)}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="pressable inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground">
              {resourcesLabel}<ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRtl ? "start" : "end"} className="min-w-52 p-2">
              {resourceItems.map((item) => (
                <DropdownMenuItem key={item.key} asChild className="cursor-pointer py-2.5">
                  <Link href={item.href}>{t(item.key)}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <Button size="sm" className="hidden rounded-full px-5 md:inline-flex" asChild><Link href="/membership">{inscriptionLabel}</Link></Button>
          <Button variant="ghost" size="icon" className="rounded-full lg:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle menu" aria-expanded={mobileOpen}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="animate-menu-down border-t border-border/50 bg-background/98 shadow-xl backdrop-blur-xl lg:hidden">
          <nav className="container-content flex max-h-[calc(100vh-4.5rem)] flex-col gap-1 overflow-y-auto py-4" aria-label="Mobile navigation">
            {navItems.map((item) => <Link key={item.key} href={item.href} onClick={() => setMobileOpen(false)} className="pressable rounded-xl px-4 py-3 text-base font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{t(item.key)}</Link>)}
            <p className="px-4 pb-1 pt-4 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{resourcesLabel}</p>
            {resourceItems.map((item) => <Link key={item.key} href={item.href} onClick={() => setMobileOpen(false)} className="pressable rounded-xl px-4 py-3 text-base font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{t(item.key)}</Link>)}
            <div className="mt-3 border-t border-border/50 pt-4"><Button size="lg" className="w-full rounded-full" asChild><Link href="/membership" onClick={() => setMobileOpen(false)}>{inscriptionLabel}</Link></Button></div>
          </nav>
        </div>
      )}
    </header>
  );
}
