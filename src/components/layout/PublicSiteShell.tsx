"use client";

import { NextIntlClientProvider } from "next-intl";
import { usePathname } from "next/navigation";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";
import frMessages from "@/messages/fr.json";
import { Footer } from "./Footer";
import { Header } from "./Header";

type Locale = "ar" | "en" | "fr";

const locales = new Set<Locale>(["ar", "en", "fr"]);

const publicShellMessages = {
  ar: {
    site: arMessages.site,
    nav: arMessages.nav,
    footer: arMessages.footer,
    newsletter: arMessages.newsletter,
  },
  en: {
    site: enMessages.site,
    nav: enMessages.nav,
    footer: enMessages.footer,
    newsletter: enMessages.newsletter,
  },
  fr: {
    site: frMessages.site,
    nav: frMessages.nav,
    footer: frMessages.footer,
    newsletter: frMessages.newsletter,
  },
} satisfies Record<Locale, object>;

function getLocale(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return locales.has(segment as Locale) ? (segment as Locale) : "ar";
}

export function PublicSiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = getLocale(pathname);
  const pathWithoutLocale = pathname.replace(/^\/(ar|en|fr)(?=\/|$)/, "") || "/";
  const isAdminRoute = pathWithoutLocale === "/admin" || pathWithoutLocale.startsWith("/admin/");

  if (isAdminRoute) return children;

  return (
    <NextIntlClientProvider locale={locale} messages={publicShellMessages[locale]}>
      <div dir={locale === "ar" ? "rtl" : "ltr"} className="contents">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
