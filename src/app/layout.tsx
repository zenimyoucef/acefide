import type { Metadata } from "next";
import { PublicSiteShell } from "@/components/layout/PublicSiteShell";
import logo from "../../assets/acefide.png";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "CARED | المركز الجزائري للتشبيك الاقتصادي و الاستثمار التنموي",
    template: "%s | CARED",
  },
  description:
    "نساهم في تطوير الاقتصاد من خلال التفكير والاقتراح وإبراز الفرص و تثمينها",
  keywords: [
    "CARED",
    "الجزائر",
    "الاستشراف الاقتصادي",
    "الاستثمار",
    "المقاولاتية",
    " Think Tank",
    "الاقتصاد الجزائري",
  ],
  authors: [{ name: "CARED" }],
  icons: {
    icon: logo.src,
    shortcut: logo.src,
    apple: logo.src,
  },
  openGraph: {
    type: "website",
    locale: "ar",
    siteName: "CARED",
    images: ["/images/algiers-hero.png"],
  },
  twitter: { card: "summary_large_image", images: ["/images/algiers-hero.png"] },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="h-full">
      <body suppressHydrationWarning className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <PublicSiteShell>{children}</PublicSiteShell>
      </body>
    </html>
  );
}
