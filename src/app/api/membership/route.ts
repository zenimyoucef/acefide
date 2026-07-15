import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { membershipSchema, validationError } from "@/lib/validation";
import { rateLimit, requestKey } from "@/lib/rate-limit";

const uploadFields = ["identityDocument", "personalPhoto", "cv", "diploma", "criminalRecord", "duesReceipt"] as const;

async function saveUpload(data: FormData, field: (typeof uploadFields)[number]) {
  const file = data.get(field);
  if (!(file instanceof File) || file.size === 0) throw new Error(`Missing required file: ${field}`);
  if (file.size > 8 * 1024 * 1024) throw new Error(`${field} exceeds 8 MB`);
  const extensions: Record<string, string> = {
    "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
  };
  const extension = extensions[file.type];
  if (!extension) throw new Error(`${field} must be PDF, JPG, PNG, or WebP`);
  const directory = path.join(process.cwd(), "public", "uploads", "membership");
  await mkdir(directory, { recursive: true });
  const filename = `${randomUUID()}.${extension}`;
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/membership/${filename}`;
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

    const [identityDocumentUrl, personalPhotoUrl, cvUrl, diplomaUrl, criminalRecordUrl, duesReceiptUrl] =
      await Promise.all(uploadFields.map((field) => saveUpload(data, field)));
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
