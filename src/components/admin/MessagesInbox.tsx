"use client";

import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { markContactMessageRead, markAllContactMessagesRead, deleteContactMessage } from "@/app/[locale]/admin/messages/actions";
import { Paperclip, Download, ChevronDown, Mail, Phone, Building2, Inbox, Trash2 } from "lucide-react";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const IMAGE_EXT = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "avif"];

function fmtDate(iso: string) {
  const d = new Date(iso);
  const day = d.toLocaleDateString("ar-DZ", { day: "2-digit", month: "long", year: "numeric" });
  const time = d.toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" });
  return `${day} · ${time}`;
}

// The suggestions form appends the uploaded file as a line "المرفق: <url>".
// Pull those out so we can render them as real attachment buttons.
function parseMessage(message: string) {
  const attachments: string[] = [];
  const bodyLines: string[] = [];
  for (const line of message.split("\n")) {
    const m = line.match(/^\s*المرفق:\s*(https?:\/\/\S+)\s*$/);
    if (m) attachments.push(m[1]);
    else bodyLines.push(line);
  }
  return { body: bodyLines.join("\n").trim(), attachments };
}

// Suggestions/concerns arrive with a "[اقتراح]" / "[ملاحظة]" prefix in the subject.
function parseSubject(subject: string) {
  const m = subject.match(/^\[([^\]]+)\]\s*(.*)$/);
  if (m) return { tag: m[1], text: m[2] || m[1] };
  return { tag: null as string | null, text: subject };
}

function Body({ text }: { text: string }) {
  if (!text) return <p className="text-sm italic text-muted-foreground">لا يوجد نص في هذه الرسالة.</p>;
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-foreground">
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a key={i} href={p} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
            {p}
          </a>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </p>
  );
}

function Attachment({ url }: { url: string }) {
  const clean = url.split("?")[0];
  const name = decodeURIComponent(clean.split("/").pop() || "الملف المرفق");
  const ext = (name.split(".").pop() || "").toLowerCase();
  const isImage = IMAGE_EXT.includes(ext);
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-3">
      {isImage && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="mb-3 block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={name} className="max-h-72 w-auto rounded-lg border border-border object-contain" />
        </a>
      )}
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Paperclip className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold" title={name}>
          {name}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition hover:bg-primary-dark"
        >
          <Download className="h-3.5 w-3.5" /> فتح المرفق
        </a>
      </div>
    </div>
  );
}

export function MessagesInbox({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set(messages.filter((m) => m.read).map((m) => m.id)));

  const unreadCount = messages.filter((m) => !readIds.has(m.id)).length;

  async function toggle(id: string) {
    const willOpen = openId !== id;
    setOpenId(willOpen ? id : null);
    if (willOpen && !readIds.has(id)) {
      setReadIds((prev) => new Set(prev).add(id));
      await markContactMessageRead(id);
      router.refresh();
    }
  }

  async function markAll() {
    setReadIds(new Set(messages.map((m) => m.id)));
    await markAllContactMessagesRead();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    await deleteContactMessage(id);
    router.refresh();
  }

  return (
    <div dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">رسائل الاتصال</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {messages.length} رسالة{unreadCount > 0 ? ` · ${unreadCount} غير مقروءة` : ""}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAll}
            className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center text-muted-foreground">
          <Inbox className="mx-auto mb-3 h-10 w-10 opacity-40" />
          لا توجد رسائل بعد.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => {
            const unread = !readIds.has(m.id);
            const open = openId === m.id;
            const { tag, text } = parseSubject(m.subject);
            const { body, attachments } = parseMessage(m.message);
            const isConcern = tag?.includes("ملاحظة") || tag?.includes("مشكلة");
            return (
              <div
                key={m.id}
                className={cn(
                  "overflow-hidden rounded-xl border bg-white transition-colors",
                  unread ? "border-primary/40 shadow-[0_1px_3px_rgba(26,122,94,0.08)]" : "border-border"
                )}
              >
                <button type="button" onClick={() => toggle(m.id)} className="flex w-full items-start gap-3 p-4 text-start">
                  <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", unread ? "bg-red-500" : "bg-transparent")} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      {tag && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[0.7rem] font-bold",
                            isConcern ? "bg-red-50 text-red-700" : "bg-primary/10 text-primary"
                          )}
                        >
                          {tag}
                        </span>
                      )}
                      <span className={cn("text-sm text-foreground", unread ? "font-black" : "font-semibold")}>{text}</span>
                    </span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {m.name} · {m.email}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="whitespace-nowrap text-[0.7rem] text-muted-foreground">{fmtDate(m.createdAt)}</span>
                    <div className="flex items-center gap-1">
                      {attachments.length > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Paperclip className="h-3 w-3" />
                        </span>
                      )}
                      <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
                    </div>
                  </span>
                </button>

                {open && (
                  <div className="border-t border-border px-4 pb-4 pt-3">
                    <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 text-primary hover:underline">
                        <Mail className="h-3.5 w-3.5" /> {m.email}
                      </a>
                      {m.phone && (
                        <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1.5 hover:text-primary">
                          <Phone className="h-3.5 w-3.5" /> {m.phone}
                        </a>
                      )}
                      {m.organization && (
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5" /> {m.organization}
                        </span>
                      )}
                    </div>

                    <Body text={body} />

                    {attachments.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <p className="text-xs font-bold text-muted-foreground">المرفقات</p>
                        {attachments.map((url, i) => (
                          <Attachment key={i} url={url} />
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> حذف
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
