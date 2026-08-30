import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, type, subject, message } = body;

    if (!name || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email: email || null,
        subject: `[${type === "concern" ? "ملاحظة" : "اقتراح"}] ${subject}`,
        message,
      },
    });

    return NextResponse.json({ message: "Sent successfully" }, { status: 201 });
  } catch (error) {
    console.error("Suggestion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
