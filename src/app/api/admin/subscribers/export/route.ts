import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSession();
  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  const csv = ["email,active,created_at", ...subscribers.map(item => `"${item.email.replaceAll('"','""')}",${item.active},${item.createdAt.toISOString()}`)].join("\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=acefide-subscribers.csv" } });
}
