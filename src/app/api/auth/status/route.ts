import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ state: "REGISTER" });
  const user = await prisma.user.findUnique({ where: { id: session.id }, select: { email: true, emailVerifiedAt: true, membershipRequest: { select: { status: true } } } });
  if (!user) return NextResponse.json({ state: "REGISTER" });
  if (!user.emailVerifiedAt) return NextResponse.json({ state: "VERIFY_EMAIL", email: user.email });
  if (!user.membershipRequest) return NextResponse.json({ state: "APPLICATION", email: user.email });
  return NextResponse.json({ state: user.membershipRequest.status === "PENDING_REVIEW" ? "PENDING" : user.membershipRequest.status === "REJECTED" ? "REJECTED" : "APPROVED", email: user.email });
}
