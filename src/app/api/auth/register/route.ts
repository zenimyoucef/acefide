import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createEmailVerificationToken } from "@/lib/email-verification";
import { prisma } from "@/lib/prisma";
import { rateLimit, requestKey } from "@/lib/rate-limit";
import { sendVerificationEmail } from "@/lib/verification-email";

const schema = z.object({
  name: z.string().trim().min(2).max(120), email: z.string().trim().email(),
  password: z.string().min(8).max(128), passwordConfirmation: z.string(),
  locale: z.enum(["ar", "en", "fr"]).default("ar"),
}).refine((value) => value.password === value.passwordConfirmation, { path: ["passwordConfirmation"] });

export async function POST(request: Request) {
  if (!rateLimit(requestKey(request, "register"), 5, 15 * 60_000)) return NextResponse.json({ error: "تم تجاوز عدد المحاولات المسموح." }, { status: 429 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "يرجى التحقق من بيانات التسجيل." }, { status: 400 });
  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ ok: true });
  const verification = createEmailVerificationToken();
  const user = await prisma.user.create({ data: { name: parsed.data.name, email, password: await hash(parsed.data.password, 12), active: false, emailVerificationTokenHash: verification.tokenHash, emailVerificationExpiresAt: verification.expiresAt } });
  try {
    await sendVerificationEmail({ email, name: user.name, token: verification.token, locale: parsed.data.locale });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Verification email delivery failed", error);
    return NextResponse.json({ error: "تم إنشاء الحساب لكن لم نتمكن من إرسال رسالة التأكيد. يرجى إعادة الإرسال." }, { status: 503 });
  }
}
