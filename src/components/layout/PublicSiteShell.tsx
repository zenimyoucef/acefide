"use client";

import { NextIntlClientProvider } from "next-intl";
import { usePathname } from "next/navigation";
import arMessages from "@/messages/ar.json";
import { Footer } from "./Footer";
import { Header } from "./Header";

const publicShellMessages = {
  site: arMessages.site,
  nav: arMessages.nav,
  footer: arMessages.footer,
  newsletter: arMessages.newsletter,
};

export function PublicSiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) return children;

  return (
    <NextIntlClientProvider locale="ar" messages={publicShellMessages}>
      <div dir="rtl" className="contents font-arabic">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
