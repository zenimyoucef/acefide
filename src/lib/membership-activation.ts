import { createHash, randomBytes } from "node:crypto";
import nodemailer from "nodemailer";

const activationLifetimeMs = 72 * 60 * 60 * 1000;

export function createMembershipActivation() {
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    tokenHash: createHash("sha256").update(token).digest("hex"),
    expiresAt: new Date(Date.now() + activationLifetimeMs),
  };
}

export function hashMembershipActivation(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function sendMembershipActivationEmail({ email, name, token, locale }: { email: string; name: string; token: string; locale: string }) {
  const host = process.env.SMTP_HOST;
  const from = process.env.SMTP_FROM;
  if (!host || !from) throw new Error("SMTP_HOST and SMTP_FROM must be configured before approving membership applications.");

  const port = Number(process.env.SMTP_PORT || "587");
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    ...(process.env.SMTP_USER && process.env.SMTP_PASSWORD ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } } : {}),
  });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) throw new Error("NEXT_PUBLIC_APP_URL must be configured before approving membership applications.");
  const activationUrl = new URL(`/${locale}/membership/activate`, appUrl);
  activationUrl.searchParams.set("token", token);

  await transporter.sendMail({
    from,
    to: email,
    subject: "Activate your ACEFIDE membership account",
    text: `Hello ${name},\n\nYour membership application has been approved. Set your password and activate your account here: ${activationUrl}\n\nThis link expires in 72 hours.`,
  });
}
