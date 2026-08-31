import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema, validationError } from "@/lib/validation";
import { rateLimit, requestKey } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    if (!rateLimit(requestKey(request, "contact"))) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const contentType = request.headers.get("content-type") || "";
    let name = "";
    let email = "";
    let phone = "";
    let organization = "";
    let subject = "";
    let message = "";
    let file: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      // FormData submission (with optional file)
      const formData = await request.formData();
      name = (formData.get("name") as string) || "";
      email = (formData.get("email") as string) || "";
      phone = (formData.get("phone") as string) || "";
      organization = (formData.get("organization") as string) || "";
      subject = (formData.get("subject") as string) || "";
      message = (formData.get("message") as string) || "";
      file = formData.get("file") as File | null;
    } else {
      // JSON submission (legacy, no file support)
      const parsed = contactSchema.safeParse(await request.json());
      if (!parsed.success) return NextResponse.json(validationError(parsed.error), { status: 400 });
      ({ name, email, subject, message } = parsed.data);
      phone = parsed.data.phone || "";
      organization = parsed.data.organization || "";
    }

    if (!name || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upload file to Vercel Blob if present
    let fileUrl: string | null = null;
    if (file && file.size > 0) {
      try {
        const { put } = await import("@vercel/blob");
        const ext = file.name.split(".").pop() || "bin";
        const blobName = `contact/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
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

    const fullMessage = fileUrl
      ? `${message}\n\nالمرفق: ${fileUrl}`
      : message;

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        organization: organization || null,
        subject,
        message: fullMessage,
      },
    });

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
