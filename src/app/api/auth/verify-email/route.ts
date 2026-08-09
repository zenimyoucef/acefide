import { NextResponse, type NextRequest } from "next/server";
import { hashEmailVerificationToken, isVerificationExpired } from "@/lib/email-verification";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") || "";
  const rawLocale = request.nextUrl.searchParams.get("locale");
  const locale = rawLocale === "en" || rawLocale === "fr" ? rawLocale : "ar";
  const failure = new URL(`/${locale}/membership`, request.url); failure.searchParams.set("verification", "invalid");
  if (token.length < 32) return NextResponse.redirect(failure);
  const user = await prisma.user.findUnique({ where: { emailVerificationTokenHash: hashEmailVerificationToken(token) } });
  if (!user || !user.emailVerificationExpiresAt || isVerificationExpired(user.emailVerificationExpiresAt)) return NextResponse.redirect(failure);
  const verified = await prisma.user.update({ where: { id: user.id }, data: { active: true, emailVerifiedAt: new Date(), emailVerificationTokenHash: null, emailVerificationExpiresAt: null } });
  const response = NextResponse.redirect(new URL(`/${locale}/membership`, request.url));
  response.cookies.set(SESSION_COOKIE, createSessionToken(verified), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 8 * 60 * 60 });
  return response;
}
