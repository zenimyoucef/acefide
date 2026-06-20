import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, phone, organization, subject, message } =
      await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const consultation = await prisma.consultationRequest.create({
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
      { message: "Consultation request submitted", consultation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Consultation request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
