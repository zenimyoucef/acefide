import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hashMembershipActivation } from "@/lib/membership-activation";
import { prisma } from "@/lib/prisma";
import { rateLimit, requestKey } from "@/lib/rate-limit";

const schema = z.object({ token: z.string().min(32), password: z.string().min(8).max(128) });

export async function POST(request: Request) {
  if (!rateLimit(requestKey(request, "membership-activation"), 5, 15 * 60_000)) return NextResponse.json({ error: "تم تجاوز عدد المحاولات المسموح. يرجى المحاولة لاحقاً." }, { status: 429 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "طلب تفعيل غير صالح." }, { status: 400 });

  const activationTokenHash = hashMembershipActivation(parsed.data.token);
  const user = await prisma.user.findFirst({ where: { activationTokenHash, activationExpiresAt: { gt: new Date() } }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "رابط التفعيل غير صالح أو منتهي الصلاحية." }, { status: 400 });

  await prisma.user.update({ where: { id: user.id }, data: { password: await hash(parsed.data.password, 12), active: true, activationTokenHash: null, activationExpiresAt: null } });
  return NextResponse.json({ ok: true });
}
