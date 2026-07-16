import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { rateLimit, requestKey } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), password: z.string().min(8), locale: z.enum(["ar", "en", "fr"]).default("ar") });
export async function POST(request: Request) {
  if (!rateLimit(requestKey(request, "login"), 5, 15 * 60_000)) return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
  try {
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    if (!user || !user.active || !["EDITOR", "ADMIN", "SUPER_ADMIN"].includes(user.role) || !(await compare(parsed.data.password, user.password))) return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, createSessionToken(user), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 8 * 60 * 60 });
    return response;
  } catch (error) {
    console.error("Login service unavailable", error);
    return NextResponse.json({ error: "Login service is temporarily unavailable. Please try again." }, { status: 503 });
  }
}
