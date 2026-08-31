import { prisma } from "@/lib/prisma";
import { MessagesInbox } from "@/components/admin/MessagesInbox";

export default async function MessagesPage() {
  const items = await prisma.contactMessage
    .findMany({ orderBy: { createdAt: "desc" }, take: 200 })
    .catch(() => []);

  const messages = items.map((x) => ({
    id: x.id,
    name: x.name,
    email: x.email,
    phone: x.phone,
    organization: x.organization,
    subject: x.subject,
    message: x.message,
    read: x.read,
    createdAt: x.createdAt.toISOString(),
  }));

  return <MessagesInbox messages={messages} />;
}
