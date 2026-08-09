import { describe, expect, it } from "vitest";
import { readRequiredMembershipFiles, REQUIRED_MEMBERSHIP_FILES } from "./membership-files";
import { membershipDocumentKeys } from "./membership-document-download";

function completeFormData() {
  const formData = new FormData();
  for (const document of REQUIRED_MEMBERSHIP_FILES) {
    formData.set(document.field, new File(["content"], `${document.field}.pdf`, { type: "application/pdf" }));
  }
  return formData;
}

describe("readRequiredMembershipFiles", () => {
  it("returns all six non-empty membership documents", () => {
    const result = readRequiredMembershipFiles(completeFormData());

    expect(result.success).toBe(true);
    if (result.success) expect(Object.keys(result.files)).toHaveLength(6);
  });

  it.each([
    "identityDocument",
    "personalPhoto",
    "cv",
    "diploma",
    "criminalRecord",
    "duesReceipt",
  ] as const)("rejects a missing or empty %s file", (field) => {
    const missing = completeFormData();
    missing.delete(field);
    expect(readRequiredMembershipFiles(missing)).toEqual({ success: false, missing: [field] });

    const empty = completeFormData();
    empty.set(field, new File([], `${field}.pdf`, { type: "application/pdf" }));
    expect(readRequiredMembershipFiles(empty)).toEqual({ success: false, missing: [field] });
  });
});

describe("membership document downloads", () => {
  it("allows every required uploaded document to be downloaded", () => {
    expect(membershipDocumentKeys).toEqual([
      "cv",
      "identity-document",
      "personal-photo",
      "diploma",
      "criminal-record",
      "dues-receipt",
    ]);
  });
});
