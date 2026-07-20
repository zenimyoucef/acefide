import { streamMembershipDocument } from "@/lib/membership-document-download";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; document: string }> }) {
  const { id, document } = await params;
  return streamMembershipDocument(id, document, "admin");
}
