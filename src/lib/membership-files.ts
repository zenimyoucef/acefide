export const REQUIRED_MEMBERSHIP_FILES = [
  { field: "identityDocument", blobFolder: "identity-document", label: "نسخة بطاقة التعريف الوطنية أو جواز السفر", accept: "application/pdf,image/jpeg,image/png,image/webp" },
  { field: "personalPhoto", blobFolder: "personal-photo", label: "صورة شخصية", accept: "image/jpeg,image/png,image/webp" },
  { field: "cv", blobFolder: "cv", label: "السيرة الذاتية/CV", accept: "application/pdf,image/jpeg,image/png,image/webp,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  { field: "diploma", blobFolder: "diploma", label: "شهادة المؤهل العلمي أو المهني", accept: "application/pdf,image/jpeg,image/png,image/webp" },
  { field: "criminalRecord", blobFolder: "criminal-record", label: "صحيفة السوابق العدلية سارية الصلاحية", accept: "application/pdf,image/jpeg,image/png,image/webp" },
  { field: "duesReceipt", blobFolder: "dues-receipt", label: "وصل تسديد مستحقات الإنخراط", accept: "application/pdf,image/jpeg,image/png,image/webp" },
] as const;

export type RequiredMembershipFileField = (typeof REQUIRED_MEMBERSHIP_FILES)[number]["field"];
export type RequiredMembershipFiles = Record<RequiredMembershipFileField, File>;

export function readRequiredMembershipFiles(formData: FormData):
  | { success: true; files: RequiredMembershipFiles }
  | { success: false; missing: RequiredMembershipFileField[] } {
  const entries = REQUIRED_MEMBERSHIP_FILES.map(({ field }) => [field, formData.get(field)] as const);
  const missing = entries
    .filter((entry): entry is readonly [RequiredMembershipFileField, FormDataEntryValue | null] => !(entry[1] instanceof File) || entry[1].size === 0)
    .map(([field]) => field);

  if (missing.length) return { success: false, missing };
  return { success: true, files: Object.fromEntries(entries) as RequiredMembershipFiles };
}
