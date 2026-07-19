"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Menu, X } from "lucide-react";
import logo from "../../../assets/acefide.png";
import { Link, usePathname } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

const primaryLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "events", href: "/events" },
  { key: "news", href: "/news" },
] as const;

const resourceLinks = [
  { key: "president", href: "/president" },
  { key: "publications", href: "/publications" },
  { key: "partners", href: "/partners" },
] as const;

function isActivePath(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const t = useTranslations("nav");
  const tSite = useTranslations("site");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isRtl = locale === "ar";
  const resourcesActive = resourceLinks.some(({ href }) => isActivePath(pathname, href));

  useEffect(() => {
    setMobileOpen(false);
  }, [locale, pathname]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[4.5rem] w-full border-b border-border/60 bg-background shadow-[0_1px_14px_rgba(11,31,51,0.06)]",
        isRtl && "font-arabic"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="container-content flex h-full items-center gap-3">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={`${tSite("title")} — ${t("home")}`}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
            <Image src={logo} alt="ACEFIDE logo" width={44} height={44} className="object-cover" priority />
          </span>
          <span className="hidden min-w-0 max-w-[15rem] text-start text-xs font-bold leading-[1.35] text-[#0b1f33] xl:block 2xl:max-w-[21rem]">
            {tSite("title")}
          </span>
        </Link>

        <nav className="ms-auto hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {primaryLinks.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary",
                  active && "bg-primary/10 text-primary"
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              className={cn(
                "inline-flex min-w-32 items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary",
                resourcesActive && "bg-primary/10 text-primary"
              )}
            >
              {t("resources")}
              <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRtl ? "start" : "end"} className="min-w-52 p-2">
              {resourceLinks.map((item) => (
                <DropdownMenuItem key={item.key} asChild className="cursor-pointer py-2.5">
                  <Link href={item.href}>{t(item.key)}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-1.5 lg:ms-2">
          <LanguageSwitcher />
          <Button className="hidden rounded-full px-5 lg:inline-flex" size="sm" asChild>
            <Link href="/membership">{t("register")}</Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="public-mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="public-mobile-navigation"
          className="absolute inset-x-0 top-full border-b border-border/60 bg-background shadow-xl lg:hidden"
        >
          <nav
            className="container-content flex max-h-[calc(100vh-4.5rem)] flex-col gap-1 overflow-y-auto py-4"
            aria-label="Mobile navigation"
          >
            {primaryLinks.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-base font-semibold text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary",
                    active && "bg-primary/10 text-primary"
                  )}
                >
                  {t(item.key)}
                </Link>
              );
            })}

            <p className="px-4 pb-1 pt-4 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {t("resources")}
            </p>
            {resourceLinks.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-base font-semibold text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary",
                    active && "bg-primary/10 text-primary"
                  )}
                >
                  {t(item.key)}
                </Link>
              );
            })}

            <div className="mt-3 border-t border-border/50 pt-4">
              <Button size="lg" className="w-full rounded-full" asChild>
                <Link href="/membership" onClick={() => setMobileOpen(false)}>{t("register")}</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
