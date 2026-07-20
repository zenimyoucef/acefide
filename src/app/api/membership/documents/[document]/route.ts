import { streamMembershipDocument } from "@/lib/membership-document-download";
import { getSession } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ document: string }> }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthenticated" }, { status: 401 });
  const { document } = await params;
  return streamMembershipDocument(session.id, document, "owner");
}
