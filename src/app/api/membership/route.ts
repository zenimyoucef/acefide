import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { membershipBlobAuth } from "@/lib/membership-blob";
import { membershipSchema, validationError } from "@/lib/validation";
import { rateLimit, requestKey } from "@/lib/rate-limit";
import { getSession } from "@/lib/auth";
import { readRequiredMembershipFiles, REQUIRED_MEMBERSHIP_FILES } from "@/lib/membership-files";

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
      ...membershipBlobAuth(),
    }
  );

  return blob.url;
}

export async function POST(request: Request) {
  try {
    if (!rateLimit(requestKey(request, "membership"))) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Sign in before submitting your application." }, { status: 401 });
    const applicant = await prisma.user.findUnique({ where: { id: session.id }, select: { id: true, email: true, emailVerifiedAt: true } });
    if (!applicant?.emailVerifiedAt) return NextResponse.json({ error: "Verify your email before submitting your application." }, { status: 403 });
    const duplicate = await prisma.membershipRequest.findUnique({ where: { userId: applicant.id }, select: { id: true } });
    if (duplicate) return NextResponse.json({ error: "You have already submitted a membership application." }, { status: 409 });
    const data = await request.formData();
    const requiredFiles = readRequiredMembershipFiles(data);
    if (!requiredFiles.success) {
      return NextResponse.json({
        error: "All membership documents are required.",
        fields: Object.fromEntries(requiredFiles.missing.map((field) => [field, ["Required"]])),
      }, { status: 400 });
    }
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

    const uploadedEntries = await Promise.all(REQUIRED_MEMBERSHIP_FILES.map(async ({ field, blobFolder }) => [
      field,
      await saveFile(requiredFiles.files[field], blobFolder),
    ] as const));
    const uploadedFiles = Object.fromEntries(uploadedEntries);
    const value = parsed.data;
    const membership = await prisma.membershipRequest.create({
      data: {
        ...value,
        userId: applicant.id,
        email: applicant.email,
        dateOfBirth: new Date(`${value.dateOfBirth}T12:00:00Z`),
        identityDocumentUrl: uploadedFiles.identityDocument,
        personalPhotoUrl: uploadedFiles.personalPhoto,
        cvUrl: uploadedFiles.cv,
        diplomaUrl: uploadedFiles.diploma,
        criminalRecordUrl: uploadedFiles.criminalRecord,
        duesReceiptUrl: uploadedFiles.duesReceipt,
      },
    });
    return NextResponse.json({ message: "Membership request submitted", id: membership.id }, { status: 201 });
  } catch (error) {
    console.error("Membership request error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
