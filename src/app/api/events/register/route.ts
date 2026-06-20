import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { eventId, name, email, phone, organization, notes } =
      await request.json();

    if (!eventId || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const registration = await prisma.registration.create({
      data: {
        eventId,
        name,
        email,
        phone,
        organization,
        notes,
      },
    });

    return NextResponse.json(
      { message: "Registration successful", registration },
      { status: 201 }
    );
  } catch (error) {
    console.error("Event registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
