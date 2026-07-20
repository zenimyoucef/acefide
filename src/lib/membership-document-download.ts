import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { membershipBlobToken } from "@/lib/membership-blob";

export const membershipDocumentKeys = ["cv", "identity-document", "personal-photo", "diploma", "criminal-record"] as const;
export type MembershipDocumentKey = (typeof membershipDocumentKeys)[number];

const documentFields: Record<MembershipDocumentKey, "cvUrl" | "identityDocumentUrl" | "personalPhotoUrl" | "diplomaUrl" | "criminalRecordUrl"> = {
  cv: "cvUrl",
  "identity-document": "identityDocumentUrl",
  "personal-photo": "personalPhotoUrl",
  diploma: "diplomaUrl",
  "criminal-record": "criminalRecordUrl",
};

type DownloadAccess = "admin" | "owner";

export async function streamMembershipDocument(id: string, document: string, access: DownloadAccess) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  if (access === "admin" && !["EDITOR", "ADMIN", "SUPER_ADMIN"].includes(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!membershipDocumentKeys.includes(document as MembershipDocumentKey)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    const request = await prisma.membershipRequest.findUnique({
      where: access === "owner" ? { userId: session.id } : { id },
      select: { userId: true, cvUrl: true, identityDocumentUrl: true, personalPhotoUrl: true, diplomaUrl: true, criminalRecordUrl: true },
    });
    if (!request) return NextResponse.json({ error: "File not found" }, { status: 404 });
    if (access === "owner" && request.userId !== session.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const url = request[documentFields[document as MembershipDocumentKey]];
    if (!url) return NextResponse.json({ error: "File not found" }, { status: 404 });

    const blob = await get(url, { access: "private", token: membershipBlobToken() });
    if (!blob?.stream) return NextResponse.json({ error: "File not found" }, { status: 404 });

    return new NextResponse(blob.stream, {
      headers: {
        "Content-Type": blob.headers.get("content-type") || blob.blob.contentType || "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Membership document download failed", error);
    return NextResponse.json({ error: "Unable to retrieve document" }, { status: 500 });
  }
}
