import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, requestKey } from "@/lib/rate-limit";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    if (!rateLimit(requestKey(request, "newsletter"))) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    const parsed = z.object({ email: z.string().trim().email().max(254) }).safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }
    const { email } = parsed.data;

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (!existing.active) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { active: true },
        });
      }
      return NextResponse.json({ message: "Already subscribed" });
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json(
      { message: "Successfully subscribed" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
