"use client";

import { Trash2 } from "lucide-react";

export function DeleteApplicantButton({
  action,
  applicantName,
}: {
  action: () => Promise<void>;
  applicantName: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Remove the application from ${applicantName}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 transition hover:border-red-600 hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
      >
        <Trash2 className="h-4 w-4" />
        Remove
      </button>
    </form>
  );
}
