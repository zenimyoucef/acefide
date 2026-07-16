import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { membershipSchema, validationError } from "@/lib/validation";
import { rateLimit, requestKey } from "@/lib/rate-limit";

async function saveFile(file: File, fieldName: string) {
  if (!file || file.size === 0) {
    return null;
  }

  const extension = file.name.includes(".")
    ? file.name.substring(file.name.lastIndexOf("."))
    : "";

  const filename = `${crypto.randomUUID()}${extension}`;

  const blob = await put(
    `membership/${fieldName}/${filename}`,
    file,
    {
      access: "private",
      addRandomSuffix: false,
      contentType: file.type || undefined,
    }
  );

  return blob.url;
}

export async function POST(request: Request) {
  try {
    if (!rateLimit(requestKey(request, "membership"))) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    const data = await request.formData();
    const parsed = membershipSchema.safeParse({
      name: data.get("name"), email: data.get("email"), phone: data.get("phone"),
      dateOfBirth: data.get("dateOfBirth"), placeOfBirth: data.get("placeOfBirth"), nationalId: data.get("nationalId"),
      address: data.get("address"), wilaya: data.get("wilaya"), educationLevel: data.get("educationLevel"),
      employmentStatus: data.get("employmentStatus"), organization: data.get("organization"), position: data.get("position"),
      membershipCategory: data.get("membershipCategory"), interests: data.getAll("interests"),
      previousAssociation: data.get("previousAssociation") === "yes",
      previousAssociationDetails: data.get("previousAssociationDetails"), socialLinks: data.get("socialLinks"),
      reason: data.get("reason"), declarationAccepted: data.get("declarationAccepted") === "on",
    });
    if (!parsed.success) return NextResponse.json(validationError(parsed.error), { status: 400 });

    const identityDocumentUrl = await saveFile(
      data.get("identityDocument") as File,
      "identity-document"
    );
    const personalPhotoUrl = await saveFile(
      data.get("personalPhoto") as File,
      "personal-photo"
    );
    const cvUrl = await saveFile(
      data.get("cv") as File,
      "cv"
    );
    const diplomaUrl = await saveFile(
      data.get("diploma") as File,
      "diploma"
    );
    const criminalRecordUrl = await saveFile(
      data.get("criminalRecord") as File,
      "criminal-record"
    );
    const duesReceiptUrl = await saveFile(
      data.get("duesReceipt") as File,
      "dues-receipt"
    );
    const value = parsed.data;
    const membership = await prisma.membershipRequest.create({
      data: {
        ...value,
        dateOfBirth: new Date(`${value.dateOfBirth}T12:00:00Z`),
        identityDocumentUrl, personalPhotoUrl, cvUrl, diplomaUrl, criminalRecordUrl, duesReceiptUrl,
      },
    });
    return NextResponse.json({ message: "Membership request submitted", id: membership.id }, { status: 201 });
  } catch (error) {
    console.error("Membership request error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
