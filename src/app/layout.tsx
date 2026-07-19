import type { Metadata } from "next";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { PublicSiteShell } from "@/components/layout/PublicSiteShell";
import { routing } from "@/routing";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "ACEFIDE | Algerian Center for Economic Foresight",
    template: "%s | ACEFIDE",
  },
  description:
    "Shaping Algeria's Economic Future Through Foresight, Investment and Entrepreneurship",
  keywords: [
    "ACEFIDE",
    "Algeria",
    "Economic Foresight",
    "Investment",
    "Entrepreneurship",
    "Think Tank",
    "Algerian Economy",
  ],
  authors: [{ name: "ACEFIDE" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ACEFIDE",
    images: ["/images/algiers-hero.png"],
  },
  twitter: { card: "summary_large_image", images: ["/images/algiers-hero.png"] },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const requestLocale = requestHeaders.get("X-NEXT-INTL-LOCALE");
  const locale = hasLocale(routing.locales, requestLocale) ? requestLocale : routing.defaultLocale;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className="h-full">
      <body suppressHydrationWarning className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <PublicSiteShell>{children}</PublicSiteShell>
      </body>
    </html>
  );
}
