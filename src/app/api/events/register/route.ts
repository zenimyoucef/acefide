import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventRegistrationSchema, validationError } from "@/lib/validation";
import { rateLimit, requestKey } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    if (!rateLimit(requestKey(request, "event-registration"))) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    const parsed = eventRegistrationSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json(validationError(parsed.error), { status: 400 });
    const { eventId, name, email, phone, organization, notes } = parsed.data;

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
