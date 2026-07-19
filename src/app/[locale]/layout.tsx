import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { getDirection } from "@/lib/utils";
import { routing } from "@/routing";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { LocaleDocumentAttributes } from "@/components/layout/LocaleDocumentAttributes";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: { languages: { ar: "/ar", en: "/en", fr: "/fr" } },
    openGraph: { title: t("title"), description: t("description"), locale, siteName: "ACEFIDE", type: "website" },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = getDirection(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleDocumentAttributes locale={locale} dir={dir} />
      <div dir={dir} className="contents">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "ACEFIDE", alternateName: "Algerian Center for Economic Foresight, Investment Development and Entrepreneurship", foundingDate: "2022", email: "acefidedz@gmail.com", telephone: "+213 23 29 88 88", address: { "@type": "PostalAddress", streetAddress: "Building 60, Dely Ibrahim, El Achour, Draria", addressLocality: "Algiers", addressCountry: "DZ" }, sameAs: ["https://www.facebook.com/ACEFIDEAlgeria"] }).replace(/</g, "\\u003c") }} />
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
