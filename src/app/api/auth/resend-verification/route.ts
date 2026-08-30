import { NextResponse } from "next/server";
import { z } from "zod";
import { createEmailVerificationToken } from "@/lib/email-verification";
import { prisma } from "@/lib/prisma";
import { rateLimit, requestKey } from "@/lib/rate-limit";
import { sendVerificationEmail } from "@/lib/verification-email";

const schema = z.object({ email: z.string().trim().email(), locale: z.enum(["ar", "en", "fr"]).default("ar") });
export async function POST(request: Request) {
  if (!rateLimit(requestKey(request, "resend-verification"), 3, 30 * 60_000)) return NextResponse.json({ error: "تم تجاوز عدد المحاولات المسموح." }, { status: 429 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: true });
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || user.emailVerifiedAt) return NextResponse.json({ ok: true });
  const verification = createEmailVerificationToken();
  await prisma.user.update({ where: { id: user.id }, data: { emailVerificationTokenHash: verification.tokenHash, emailVerificationExpiresAt: verification.expiresAt } });
  await sendVerificationEmail({ email: user.email, name: user.name, token: verification.token, locale: parsed.data.locale });
  return NextResponse.json({ ok: true });
}
