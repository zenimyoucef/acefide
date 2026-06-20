import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, phone, organization, position, reason } =
      await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const membership = await prisma.membershipRequest.create({
      data: {
        name,
        email,
        phone,
        organization,
        position,
        reason,
      },
    });

    return NextResponse.json(
      { message: "Membership request submitted", membership },
      { status: 201 }
    );
  } catch (error) {
    console.error("Membership request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
