import nodemailer from "nodemailer";

export type AuthLocale = "ar" | "en" | "fr";

export function buildVerificationUrl(token: string, locale: AuthLocale) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) throw new Error("NEXT_PUBLIC_APP_URL must be configured for email verification.");
  const url = new URL("/api/auth/verify-email", appUrl);
  url.searchParams.set("token", token);
  url.searchParams.set("locale", locale);
  return url.toString();
}

export async function sendVerificationEmail({ email, name, token, locale }: { email: string; name: string; token: string; locale: AuthLocale }) {
  const host = process.env.SMTP_HOST;
  const from = process.env.SMTP_FROM;
  if (!host || !from) throw new Error("SMTP_HOST and SMTP_FROM must be configured for email verification.");
  const port = Number(process.env.SMTP_PORT || "587");
  const transporter = nodemailer.createTransport({
    host, port, secure: port === 465,
    ...(process.env.SMTP_USER && process.env.SMTP_PASSWORD ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } } : {}),
  });
  const url = buildVerificationUrl(token, locale);
  const subjects = { ar: "تأكيد بريدك الإلكتروني", en: "Verify your email address", fr: "Vérifiez votre adresse e-mail" };
  const text = locale === "ar"
    ? `مرحباً ${name}،\n\nأكد بريدك الإلكتروني لمتابعة طلب الانخراط: ${url}\n\nتنتهي صلاحية الرابط خلال 24 ساعة.`
    : locale === "fr"
      ? `Bonjour ${name},\n\nVérifiez votre adresse e-mail pour poursuivre votre inscription : ${url}\n\nCe lien expire dans 24 heures.`
      : `Hello ${name},\n\nVerify your email to continue your membership application: ${url}\n\nThis link expires in 24 hours.`;
  await transporter.sendMail({ from, to: email, subject: subjects[locale], text });
}
