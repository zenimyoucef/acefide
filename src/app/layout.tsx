import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
