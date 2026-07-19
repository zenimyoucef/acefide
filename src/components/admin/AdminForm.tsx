"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useEffect, useRef, useState, useTransition } from "react";
import type { AdminActionResult } from "@/lib/admin-action";

type AdminFormProps = {
  action: (data: FormData) => Promise<AdminActionResult>;
  children: ReactNode;
  className?: string;
  locale: string;
  successRedirect?: string;
  confirmMessage?: string;
};

const copy = {
  ar: { invalid: "يرجى تصحيح الحقول المبيّنة أدناه.", pending: "جارٍ الحفظ…", invalidFile: "نوع الملف غير صالح.", largeFile: "حجم الملف يتجاوز الحد المسموح.", unexpected: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى." },
  fr: { invalid: "Veuillez corriger les champs indiqués ci-dessous.", pending: "Enregistrement…", invalidFile: "Le type de fichier n’est pas valide.", largeFile: "Le fichier dépasse la taille autorisée.", unexpected: "Une erreur inattendue s’est produite. Veuillez réessayer." },
  en: { invalid: "Please correct the highlighted fields below.", pending: "Saving…", invalidFile: "The file type is invalid.", largeFile: "The file exceeds the allowed size.", unexpected: "An unexpected error occurred. Please try again." },
} as const;

export function AdminForm({ action, children, className, locale, successRedirect, confirmMessage }: AdminFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [result, setResult] = useState<AdminActionResult>({ success: false });
  const [pending, startTransition] = useTransition();
  const t = copy[locale as keyof typeof copy] || copy.en;

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    form.querySelectorAll("[data-admin-field-error]").forEach((node) => node.remove());
    form.querySelectorAll<HTMLElement>("[aria-invalid='true']").forEach((field) => {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
      field.classList.remove("border-red-500", "ring-2", "ring-red-100");
    });

    const errors = result.fieldErrors || {};
    let firstInvalid: HTMLElement | null = null;
    for (const [name, message] of Object.entries(errors)) {
      const field = form.elements.namedItem(name);
      const element = field instanceof RadioNodeList ? field[0] : field;
      if (!(element instanceof HTMLElement)) continue;
      const errorId = `${name}-admin-error`;
      element.setAttribute("aria-invalid", "true");
      element.setAttribute("aria-describedby", errorId);
      element.classList.add("border-red-500", "ring-2", "ring-red-100");
      const error = document.createElement("p");
      error.id = errorId;
      error.dataset.adminFieldError = "true";
      error.className = "mt-1 text-xs font-medium text-red-700";
      error.textContent = message;
      element.insertAdjacentElement("afterend", error);
      firstInvalid ||= element;
    }
    firstInvalid?.focus();
    firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [result]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    const form = event.currentTarget;
    const fileErrors: Record<string, string> = {};
    form.querySelectorAll<HTMLInputElement>('input[type="file"]').forEach((input) => {
      const allowed = input.accept.split(",").map((value) => value.trim()).filter(Boolean);
      const maxBytes = Number(input.dataset.maxMb || "0") * 1024 * 1024;
      for (const file of Array.from(input.files || [])) {
        if (allowed.length && !allowed.includes(file.type)) fileErrors[input.name] = t.invalidFile;
        else if (maxBytes && file.size > maxBytes) fileErrors[input.name] = t.largeFile;
      }
    });
    if (Object.keys(fileErrors).length) {
      setResult({ success: false, error: t.invalid, fieldErrors: fileErrors });
      return;
    }
    if (!form.checkValidity()) {
      setResult({ success: false, error: t.invalid });
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    startTransition(async () => {
      try {
        const next = await action(data);
        setResult(next);
        if (next.success && successRedirect) router.push(successRedirect);
        else if (next.success) router.refresh();
      } catch (error) {
        console.error("Admin form submission failed:", error);
        setResult({ success: false, error: t.unexpected });
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={submit} className={className} noValidate={false} aria-busy={pending}>
      {(result.error || result.message) && (
        <div role="alert" className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium ${result.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>
          {result.error || result.message}
        </div>
      )}
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>
      {pending && <p role="status" className="mt-3 text-sm font-medium text-primary">{t.pending}</p>}
    </form>
  );
}
