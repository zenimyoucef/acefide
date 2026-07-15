import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema, validationError } from "@/lib/validation";
import { rateLimit, requestKey } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    if (!rateLimit(requestKey(request, "contact"))) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    const parsed = contactSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json(validationError(parsed.error), { status: 400 });
    const { name, email, phone, organization, subject, message } = parsed.data;

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        organization,
        subject,
        message,
      },
    });

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
