import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string || null;
    const type = formData.get("type") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const file = formData.get("file") as File | null;

    if (!name || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let fileUrl: string | null = null;

    // Upload file to Vercel Blob if present
    if (file && file.size > 0) {
      try {
        const { put } = await import("@vercel/blob");
        const ext = file.name.split(".").pop() || "bin";
        const blobName = `suggestions/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const blob = await put(blobName, file, {
          access: "public",
          token: process.env.BLOB_READ_WRITE_TOKEN || undefined,
        });
        fileUrl = blob.url;
      } catch (blobError) {
        console.error("Blob upload failed:", blobError);
        // Continue without file — don't block the submission
      }
    }

    // Store the message with file URL appended
    const fullMessage = fileUrl
      ? `${message}\n\nالمرفق: ${fileUrl}`
      : message;

    await prisma.contactMessage.create({
      data: {
        name,
        email: email || null,
        subject: `[${type === "concern" ? "ملاحظة" : "اقتراح"}] ${subject}`,
        message: fullMessage,
      },
    });

    return NextResponse.json({ message: "Sent successfully" }, { status: 201 });
  } catch (error) {
    console.error("Suggestion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
