"use server";

import { randomUUID } from "crypto";
import { del, put } from "@vercel/blob";
import { Prisma, type EventCategory, type PartnerCategory, type PublicationCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getLeadershipMembers } from "@/lib/leadership-data";
import { prisma } from "@/lib/prisma";
import type { AdminActionResult } from "@/lib/admin-action";

async function editor() {
  const user = await getSession();
  if (!user || !["EDITOR", "ADMIN", "SUPER_ADMIN"].includes(user.role)) throw new Error("Unauthorized");
  return user;
}

const text = (data: FormData, key: string) => {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
};
const slugify = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const automaticSlug = (data: FormData, source: string) => text(data, "slug") || slugify(text(data, source));

const actionCopy = {
  ar: { invalid: "يرجى تصحيح الحقول المبيّنة.", saved: "تم الحفظ بنجاح.", deleted: "تم الحذف بنجاح.", unexpected: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.", duplicate: "اسم الرابط مستخدم بالفعل.", schema: "قاعدة البيانات غير جاهزة لهذه الميزة. يرجى الاتصال بالمسؤول.", blob: "تعذر رفع الملف. يرجى التحقق منه والمحاولة مجددًا.", url: "يرجى إدخال رابط صالح.", image: "يرجى رفع صورة صالحة.", document: "يرجى رفع ملف PDF أو مستند صالح.", date: "يرجى اختيار تاريخ صالح للفعالية.", endDate: "يجب أن يكون تاريخ النهاية بعد تاريخ البداية.", required: "مطلوب" },
  fr: { invalid: "Veuillez corriger les champs indiqués.", saved: "Enregistrement réussi.", deleted: "Suppression réussie.", unexpected: "Une erreur inattendue s’est produite. Veuillez réessayer.", duplicate: "Ce nom de lien est déjà utilisé.", schema: "La base de données n’est pas prête pour cette fonctionnalité. Contactez l’administrateur.", blob: "Le fichier n’a pas pu être téléversé. Vérifiez-le et réessayez.", url: "Veuillez saisir une URL valide.", image: "Veuillez téléverser une image valide.", document: "Veuillez téléverser un PDF ou document valide.", date: "Veuillez choisir une date valide pour l’événement.", endDate: "La date de fin doit être postérieure à la date de début.", required: "est requis" },
  en: { invalid: "Please correct the highlighted fields.", saved: "Saved successfully.", deleted: "Deleted successfully.", unexpected: "An unexpected error occurred. Please try again.", duplicate: "This slug is already in use.", schema: "The database schema is not ready for this feature. Please contact the administrator.", blob: "The file could not be uploaded. Please check it and try again.", url: "Please enter a valid URL.", image: "Please upload a valid image.", document: "Please upload a valid PDF or document.", date: "Please choose a valid event date.", endDate: "End date must be after the start date.", required: "is required" },
} as const;

function messages(locale: string) { return actionCopy[locale as keyof typeof actionCopy] || actionCopy.en; }
function invalid(locale: string, fieldErrors: Record<string, string>): AdminActionResult { return { success: false, error: messages(locale).invalid, fieldErrors }; }
function requiredMessage(locale: string, label: string) { return locale === "ar" ? `${label} ${messages(locale).required}` : `${label} ${messages(locale).required}`; }
function requiredFields(locale: string, data: FormData, fields: Array<[string, string]>) {
  const errors: Record<string, string> = {};
  for (const [name, label] of fields) if (!text(data, name)) errors[name] = requiredMessage(locale, label);
  return errors;
}
function validUrl(value: string) { try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:"; } catch { return false; } }
function mergeErrors(...groups: Record<string, string>[]) { return Object.assign({}, ...groups); }
const fieldLabels = {
  ar: { titleAr: "العنوان العربي", titleEn: "العنوان الإنجليزي", titleFr: "العنوان الفرنسي", contentAr: "المحتوى العربي", contentEn: "المحتوى الإنجليزي", contentFr: "المحتوى الفرنسي", summaryAr: "الملخص العربي", summaryEn: "الملخص الإنجليزي", summaryFr: "الملخص الفرنسي", nameAr: "الاسم العربي", nameEn: "الاسم الإنجليزي", nameFr: "الاسم الفرنسي", roleAr: "المنصب العربي", roleEn: "المنصب الإنجليزي", roleFr: "المنصب الفرنسي", date: "تاريخ الفعالية", category: "التصنيف", site_name_ar: "اسم المنظمة بالعربية", site_name_en: "اسم المنظمة بالإنجليزية", site_name_fr: "اسم المنظمة بالفرنسية" },
  fr: { titleAr: "Le titre arabe", titleEn: "Le titre anglais", titleFr: "Le titre français", contentAr: "Le contenu arabe", contentEn: "Le contenu anglais", contentFr: "Le contenu français", summaryAr: "Le résumé arabe", summaryEn: "Le résumé anglais", summaryFr: "Le résumé français", nameAr: "Le nom arabe", nameEn: "Le nom anglais", nameFr: "Le nom français", roleAr: "La fonction arabe", roleEn: "La fonction anglaise", roleFr: "La fonction française", date: "La date de l’événement", category: "La catégorie", site_name_ar: "Le nom arabe de l’organisation", site_name_en: "Le nom anglais de l’organisation", site_name_fr: "Le nom français de l’organisation" },
  en: { titleAr: "Arabic title", titleEn: "English title", titleFr: "French title", contentAr: "Arabic content", contentEn: "English content", contentFr: "French content", summaryAr: "Arabic summary", summaryEn: "English summary", summaryFr: "French summary", nameAr: "Arabic name", nameEn: "English name", nameFr: "French name", roleAr: "Arabic role", roleEn: "English role", roleFr: "French role", date: "Event date", category: "Category", site_name_ar: "Arabic organization name", site_name_en: "English organization name", site_name_fr: "French organization name" },
} as const;
function label(locale: string, key: keyof typeof fieldLabels.en) { return (fieldLabels[locale as keyof typeof fieldLabels] || fieldLabels.en)[key]; }

const imageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const documentTypes: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.oasis.opendocument.text": "odt",
};

type UploadResult = { url: string | null; uploadedUrl: string | null };

function cleanPathPart(value: string, fallback: string) {
  const cleaned = value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}

async function uploadFile(file: File | null, folder: string, allowed: Record<string, string>, maxMb = 8): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > maxMb * 1024 * 1024) return null;
  const fallbackExtension = allowed[file.type];
  if (!fallbackExtension) return null;

  const extensionMatch = file.name.match(/\.([a-zA-Z0-9]{1,10})$/);
  const originalExtension = extensionMatch?.[1].toLowerCase();
  const validExtensions = new Set([...Object.values(allowed), ...(fallbackExtension === "jpg" ? ["jpeg"] : [])]);
  const extension = `.${originalExtension && validExtensions.has(originalExtension) ? originalExtension : fallbackExtension}`;
  const stem = cleanPathPart(file.name.replace(/\.[^.]+$/, ""), "file").slice(0, 80);
  const prefix = folder.split("/").map((part) => cleanPathPart(part, "files")).join("/");
  const pathname = `${prefix}/${randomUUID()}-${stem}${extension}`;
  const token = process.env.PUBLIC_BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error("PUBLIC_BLOB_READ_WRITE_TOKEN is not configured");
  }

  try {
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
      token,
    });
    return blob.url;
  } catch (error) {
    console.error(`Vercel Blob upload failed for ${pathname}:`, error);
    throw error;
  }
}

async function uploadedFile(data: FormData, fileKey: string, urlKey: string, folder: string, allowed: Record<string, string>, maxMb = 8): Promise<UploadResult> {
  const value = data.get(fileKey);
  const file = value instanceof File && value.size > 0 ? value : null;
  if (!file) return { url: text(data, urlKey) || null, uploadedUrl: null };
  const url = await uploadFile(file, folder, allowed, maxMb);
  return { url, uploadedUrl: url };
}

function isVercelBlobUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "blob.vercel-storage.com" || url.hostname.endsWith(".blob.vercel-storage.com"));
  } catch {
    return false;
  }
}

async function deleteBlobSafely(url: string | null | undefined, token = process.env.PUBLIC_BLOB_READ_WRITE_TOKEN) {
  if (!isVercelBlobUrl(url)) return;
  if (!token) {
    console.error("Vercel Blob deletion skipped: the required store token is not configured");
    return;
  }
  try {
    await del(url, { token });
  } catch (error) {
    console.error(`Vercel Blob deletion failed for ${url}:`, error);
  }
}

async function deleteBlobsSafely(urls: Array<string | null | undefined>, token = process.env.PUBLIC_BLOB_READ_WRITE_TOKEN) {
  await Promise.all([...new Set(urls.filter(isVercelBlobUrl))].map((url) => deleteBlobSafely(url, token)));
}

function toAdminActionError(locale: string, error: unknown): AdminActionResult {
  console.error("Admin action technical failure:", error);
  const t = messages(locale);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return { success: false, error: t.duplicate, fieldErrors: { slug: t.duplicate } };
    if (error.code === "P2021" || error.code === "P2022") return { success: false, error: t.schema };
    if (error.code === "P2003") return { success: false, error: t.unexpected };
  }
  if (error instanceof Prisma.PrismaClientValidationError) return { success: false, error: t.invalid };
  if (error instanceof Error && /blob|upload|token|file/i.test(error.message)) return { success: false, error: t.blob };
  return { success: false, error: t.unexpected };
}

async function authorizationError(locale: string): Promise<AdminActionResult | null> {
  try { await editor(); return null; }
  catch (error) { return toAdminActionError(locale, error); }
}

async function runAdminAction(locale: string, name: string, action: () => Promise<void>, successMessage: string = messages(locale).saved): Promise<AdminActionResult> {
  try {
    await action();
    return { success: true, message: successMessage };
  } catch (error) {
    console.error(`Admin action ${name} failed:`, error);
    return toAdminActionError(locale, error);
  }
}

const dateValue = (data: FormData, key: string) => {
  const value = text(data, key);
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

function validateFile(locale: string, data: FormData, key: string, allowed: Record<string, string>, maxMb: number, required: boolean, existingKey?: string) {
  const value = data.get(key);
  const file = value instanceof File && value.size > 0 ? value : null;
  const existing = existingKey ? text(data, existingKey) : "";
  if (!file) return required && !existing ? requiredMessage(locale, key) : null;
  if (!allowed[file.type]) return key.toLowerCase().includes("pdf") ? messages(locale).document : messages(locale).image;
  if (file.size > maxMb * 1024 * 1024) return locale === "ar" ? `يجب أن يكون حجم الملف أقل من ${maxMb} ميغابايت.` : locale === "fr" ? `Le fichier doit faire moins de ${maxMb} Mo.` : `File must be smaller than ${maxMb} MB.`;
  return null;
}

function validateGallery(locale: string, data: FormData, required: boolean) {
  const errors: Record<string, string> = {};
  const files = data.getAll("galleryFiles").filter((value): value is File => value instanceof File && value.size > 0);
  let existing: string[] = [];
  try { const parsed: unknown = JSON.parse(text(data, "existingGalleryImages") || "[]"); if (Array.isArray(parsed)) existing = parsed.filter((value): value is string => typeof value === "string" && value.length > 0); } catch { /* reported as missing below */ }
  if (required && files.length === 0 && existing.length === 0) errors.galleryFiles = messages(locale).image;
  for (const file of files) {
    if (!imageTypes[file.type]) { errors.galleryFiles = messages(locale).image; break; }
    if (file.size > 8 * 1024 * 1024) { errors.galleryFiles = locale === "ar" ? "يجب أن يكون حجم كل صورة أقل من 8 ميغابايت." : locale === "fr" ? "Chaque image doit faire moins de 8 Mo." : "Each image must be smaller than 8 MB."; break; }
  }
  return errors;
}

async function contentGallery(data: FormData, folder: string) {
  let existing: string[] = [];
  try {
    const parsed: unknown = JSON.parse(text(data, "existingGalleryImages") || "[]");
    if (Array.isArray(parsed)) existing = parsed.filter((value): value is string => typeof value === "string" && value.trim().length > 0);
  } catch (error) {
    console.warn("Ignoring invalid existingGalleryImages value:", error);
  }

  const files = data.getAll("galleryFiles").filter((value): value is File => value instanceof File && value.size > 0);
  const uploaded: string[] = [];
  try {
    for (const file of files) {
      const url = await uploadFile(file, folder, imageTypes, 8);
      if (url) uploaded.push(url);
    }
  } catch (error) {
    await deleteBlobsSafely(uploaded);
    throw error;
  }

  const images = [...new Set([...existing, ...uploaded])];
  const choice = text(data, "mainImageChoice");
  let coverImage: string | null = null;
  if (choice.startsWith("existing:")) coverImage = choice.slice(9);
  else if (choice.startsWith("new:")) coverImage = uploaded[Number(choice.slice(4))] || null;
  coverImage = coverImage || images[0] || null;
  return { images, coverImage, uploaded };
}

function staleUrls(previous: Array<string | null | undefined>, current: Array<string | null | undefined>) {
  const retained = new Set(current.filter((value): value is string => Boolean(value)));
  return previous.filter((value): value is string => typeof value === "string" && value.length > 0 && !retained.has(value));
}

export async function saveNews(locale: string, data: FormData) {
  const authorization = await authorizationError(locale); if (authorization) return authorization;
  const errors = mergeErrors(requiredFields(locale, data, [["titleAr", label(locale, "titleAr")], ["titleEn", label(locale, "titleEn")], ["titleFr", label(locale, "titleFr")], ["contentAr", label(locale, "contentAr")], ["contentEn", label(locale, "contentEn")], ["contentFr", label(locale, "contentFr")]]), validateGallery(locale, data, true));
  if (Object.keys(errors).length) return invalid(locale, errors);
  return runAdminAction(locale, "saveNews", async () => {
    const user = await editor();
    const slug = automaticSlug(data, "titleEn");
    const previous = await prisma.news.findUnique({ where: { slug }, select: { coverImage: true, galleryImages: true } });
    const gallery = await contentGallery(data, "news");
    try {
      await prisma.news.upsert({ where: { slug }, update: { titleAr: text(data, "titleAr"), titleEn: text(data, "titleEn"), titleFr: text(data, "titleFr"), excerptAr: text(data, "excerptAr"), excerptEn: text(data, "excerptEn"), excerptFr: text(data, "excerptFr"), contentAr: text(data, "contentAr"), contentEn: text(data, "contentEn"), contentFr: text(data, "contentFr"), coverImage: gallery.coverImage, galleryImages: gallery.images, published: data.get("published") === "on", publishedAt: data.get("published") === "on" ? new Date() : null }, create: { slug, titleAr: text(data, "titleAr"), titleEn: text(data, "titleEn"), titleFr: text(data, "titleFr"), excerptAr: text(data, "excerptAr"), excerptEn: text(data, "excerptEn"), excerptFr: text(data, "excerptFr"), contentAr: text(data, "contentAr"), contentEn: text(data, "contentEn"), contentFr: text(data, "contentFr"), coverImage: gallery.coverImage, galleryImages: gallery.images, published: data.get("published") === "on", publishedAt: data.get("published") === "on" ? new Date() : null, authorId: user.id } });
    } catch (error) {
      await deleteBlobsSafely(gallery.uploaded);
      throw error;
    }
    if (previous) await deleteBlobsSafely(staleUrls([previous.coverImage, ...previous.galleryImages], [gallery.coverImage, ...gallery.images]));
    revalidatePath(`/${locale}`); revalidatePath(`/${locale}/news`); revalidatePath(`/${locale}/admin/news`);
  });
}

export async function updateNews(locale: string, id: string, data: FormData) {
  const authorization = await authorizationError(locale); if (authorization) return authorization;
  const errors = mergeErrors(requiredFields(locale, data, [["titleAr", label(locale, "titleAr")], ["titleEn", label(locale, "titleEn")], ["titleFr", label(locale, "titleFr")], ["contentAr", label(locale, "contentAr")], ["contentEn", label(locale, "contentEn")], ["contentFr", label(locale, "contentFr")]]), validateGallery(locale, data, true));
  if (Object.keys(errors).length) return invalid(locale, errors);
  return runAdminAction(locale, "updateNews", async () => {
    await editor();
    const previous = await prisma.news.findUniqueOrThrow({ where: { id }, select: { coverImage: true, galleryImages: true } });
    const gallery = await contentGallery(data, "news");
    const published = data.get("published") === "on";
    try {
      await prisma.news.update({ where: { id }, data: { titleAr: text(data, "titleAr"), titleEn: text(data, "titleEn"), titleFr: text(data, "titleFr"), excerptAr: text(data, "excerptAr"), excerptEn: text(data, "excerptEn"), excerptFr: text(data, "excerptFr"), contentAr: text(data, "contentAr"), contentEn: text(data, "contentEn"), contentFr: text(data, "contentFr"), coverImage: gallery.coverImage, galleryImages: gallery.images, published, publishedAt: published ? new Date() : null } });
    } catch (error) {
      await deleteBlobsSafely(gallery.uploaded);
      throw error;
    }
    await deleteBlobsSafely(staleUrls([previous.coverImage, ...previous.galleryImages], [gallery.coverImage, ...gallery.images]));
    revalidatePath(`/${locale}`); revalidatePath(`/${locale}/news`); revalidatePath(`/${locale}/admin/news`);
  });
}

export async function deleteNews(locale: string, id: string, _data?: FormData) {
  return runAdminAction(locale, "deleteNews", async () => {
    await editor();
    const item = await prisma.news.findUniqueOrThrow({ where: { id }, select: { coverImage: true, galleryImages: true } });
    await prisma.news.delete({ where: { id } });
    await deleteBlobsSafely([item.coverImage, ...item.galleryImages]);
    revalidatePath(`/${locale}`); revalidatePath(`/${locale}/news`); revalidatePath(`/${locale}/admin/news`);
  }, messages(locale).deleted);
}

export async function deleteEvent(locale: string, id: string, _data?: FormData) {
  return runAdminAction(locale, "deleteEvent", async () => {
    await editor();
    const item = await prisma.event.findUniqueOrThrow({ where: { id }, select: { coverImage: true, galleryImages: true } });
    await prisma.event.delete({ where: { id } });
    await deleteBlobsSafely([item.coverImage, ...item.galleryImages]);
    revalidatePath(`/${locale}/events`); revalidatePath(`/${locale}/admin/events`);
  }, messages(locale).deleted);
}

export async function saveEvent(locale: string, data: FormData) {
  const authorization = await authorizationError(locale); if (authorization) return authorization;
  const errors = mergeErrors(requiredFields(locale, data, [["titleAr", label(locale, "titleAr")], ["titleEn", label(locale, "titleEn")], ["titleFr", label(locale, "titleFr")], ["category", label(locale, "category")], ["date", label(locale, "date")]]), validateGallery(locale, data, true));
  if (!(["ORGANIZED", "PARTICIPATION", "MEETING", "MEDIA"] as string[]).includes(text(data, "category"))) errors.category = requiredMessage(locale, label(locale, "category"));
  const date = dateValue(data, "date"); const endDate = dateValue(data, "endDate");
  if (!date) errors.date = messages(locale).date;
  if (endDate && date && endDate < date) errors.endDate = messages(locale).endDate;
  const registrationLink = text(data, "registrationLink"); if (registrationLink && !validUrl(registrationLink)) errors.registrationLink = messages(locale).url;
  if (Object.keys(errors).length) return invalid(locale, errors);
  return runAdminAction(locale, "saveEvent", async () => {
    await editor();
    const slug = automaticSlug(data, "titleEn");
    const previous = await prisma.event.findUnique({ where: { slug }, select: { coverImage: true, galleryImages: true } });
    const published = data.get("published") === "on";
    const gallery = await contentGallery(data, "events");
    const values = { titleAr: text(data, "titleAr"), titleFr: text(data, "titleFr"), titleEn: text(data, "titleEn"), descriptionAr: text(data, "descriptionAr") || null, descriptionFr: text(data, "descriptionFr") || null, descriptionEn: text(data, "descriptionEn") || null, locationAr: text(data, "locationAr") || null, locationFr: text(data, "locationFr") || null, locationEn: text(data, "locationEn") || null, category: text(data, "category") as EventCategory, date: date!, endDate, speakers: text(data, "speakers") || null, registrationLink: registrationLink || null, coverImage: gallery.coverImage, galleryImages: gallery.images, published };
    try {
      await prisma.event.upsert({ where: { slug }, update: values, create: { slug, ...values } });
    } catch (error) {
      await deleteBlobsSafely(gallery.uploaded);
      throw error;
    }
    if (previous) await deleteBlobsSafely(staleUrls([previous.coverImage, ...previous.galleryImages], [gallery.coverImage, ...gallery.images]));
    revalidatePath(`/${locale}/events`); revalidatePath(`/${locale}/admin/events`);
  });
}

export async function updateEvent(locale: string, id: string, data: FormData) {
  const authorization = await authorizationError(locale); if (authorization) return authorization;
  const errors = mergeErrors(requiredFields(locale, data, [["titleAr", label(locale, "titleAr")], ["titleEn", label(locale, "titleEn")], ["titleFr", label(locale, "titleFr")], ["category", label(locale, "category")], ["date", label(locale, "date")]]), validateGallery(locale, data, true));
  if (!(["ORGANIZED", "PARTICIPATION", "MEETING", "MEDIA"] as string[]).includes(text(data, "category"))) errors.category = requiredMessage(locale, label(locale, "category"));
  const date = dateValue(data, "date"); const endDate = dateValue(data, "endDate");
  if (!date) errors.date = messages(locale).date;
  if (endDate && date && endDate < date) errors.endDate = messages(locale).endDate;
  const registrationLink = text(data, "registrationLink"); if (registrationLink && !validUrl(registrationLink)) errors.registrationLink = messages(locale).url;
  if (Object.keys(errors).length) return invalid(locale, errors);
  return runAdminAction(locale, "updateEvent", async () => {
    await editor();
    const previous = await prisma.event.findUniqueOrThrow({ where: { id }, select: { coverImage: true, galleryImages: true } });
    const gallery = await contentGallery(data, "events");
    const published = data.get("published") === "on";
    try {
      await prisma.event.update({ where: { id }, data: { titleAr: text(data, "titleAr"), titleFr: text(data, "titleFr"), titleEn: text(data, "titleEn"), descriptionAr: text(data, "descriptionAr") || null, descriptionFr: text(data, "descriptionFr") || null, descriptionEn: text(data, "descriptionEn") || null, locationAr: text(data, "locationAr") || null, locationFr: text(data, "locationFr") || null, locationEn: text(data, "locationEn") || null, category: text(data, "category") as EventCategory, date: date!, endDate, speakers: text(data, "speakers") || null, registrationLink: registrationLink || null, coverImage: gallery.coverImage, galleryImages: gallery.images, published } });
    } catch (error) {
      await deleteBlobsSafely(gallery.uploaded);
      throw error;
    }
    await deleteBlobsSafely(staleUrls([previous.coverImage, ...previous.galleryImages], [gallery.coverImage, ...gallery.images]));
    revalidatePath(`/${locale}/events`); revalidatePath(`/${locale}/admin/events`);
  });
}

export async function savePublication(locale: string, fixedCategory: PublicationCategory | null, data: FormData) {
  const authorization = await authorizationError(locale); if (authorization) return authorization;
  const category = fixedCategory || text(data, "category") as PublicationCategory;
  const errors = requiredFields(locale, data, [["titleAr", label(locale, "titleAr")], ["titleEn", label(locale, "titleEn")], ["titleFr", label(locale, "titleFr")], ["summaryAr", label(locale, "summaryAr")], ["summaryEn", label(locale, "summaryEn")], ["summaryFr", label(locale, "summaryFr")]]);
  if (!fixedCategory && !category) errors.category = requiredMessage(locale, label(locale, "category"));
  if (!(["REPORT", "STUDY", "ANALYSIS", "POLICY_BRIEF"] as string[]).includes(category)) errors.category = requiredMessage(locale, label(locale, "category"));
  const coverError = validateFile(locale, data, "coverImageFile", imageTypes, 8, true, "coverImage"); if (coverError) errors.coverImageFile = coverError;
  const documentError = validateFile(locale, data, "pdfFile", documentTypes, 25, !text(data, "pdfUrl"), "pdfUrl"); if (documentError) errors.pdfFile = documentError;
  const pdfUrl = text(data, "pdfUrl"); if (pdfUrl && !validUrl(pdfUrl)) errors.pdfUrl = messages(locale).url;
  if (Object.keys(errors).length) return invalid(locale, errors);
  return runAdminAction(locale, "savePublication", async () => {
    const user = await editor();
    const slug = automaticSlug(data, "titleEn");
    const previous = await prisma.publication.findUnique({ where: { slug }, select: { coverImage: true, pdfUrl: true } });
    const uploads: string[] = [];
    try {
      const cover = await uploadedFile(data, "coverImageFile", "coverImage", "publications/covers", imageTypes);
      if (cover.uploadedUrl) uploads.push(cover.uploadedUrl);
      const file = await uploadedFile(data, "pdfFile", "pdfUrl", "publications/files", documentTypes, 25);
      if (file.uploadedUrl) uploads.push(file.uploadedUrl);
      const published = data.get("published") === "on";
      const values = { titleAr: text(data, "titleAr"), titleFr: text(data, "titleFr"), titleEn: text(data, "titleEn"), summaryAr: text(data, "summaryAr") || null, summaryFr: text(data, "summaryFr") || null, summaryEn: text(data, "summaryEn") || null, category, coverImage: cover.url, pdfUrl: file.url, published, publishedAt: published ? new Date() : null };
      await prisma.publication.upsert({ where: { slug }, update: values, create: { slug, ...values, authorId: user.id } });
      if (previous) await deleteBlobsSafely(staleUrls([previous.coverImage, previous.pdfUrl], [cover.url, file.url]));
    } catch (error) {
      await deleteBlobsSafely(uploads);
      throw error;
    }
    revalidatePath(`/${locale}/publications`); revalidatePath(`/${locale}/admin/publications`); revalidatePath(`/${locale}/admin/studies`);
  });
}

export async function deletePublication(locale: string, id: string, _data?: FormData) {
  return runAdminAction(locale, "deletePublication", async () => {
    await editor();
    const item = await prisma.publication.findUniqueOrThrow({ where: { id }, select: { coverImage: true, pdfUrl: true } });
    await prisma.publication.delete({ where: { id } });
    await deleteBlobsSafely([item.coverImage, item.pdfUrl]);
    revalidatePath(`/${locale}/publications`); revalidatePath(`/${locale}/admin/publications`); revalidatePath(`/${locale}/admin/studies`);
  }, messages(locale).deleted);
}

export async function savePartner(locale: string, data: FormData) {
  const authorization = await authorizationError(locale); if (authorization) return authorization;
  const errors = requiredFields(locale, data, [["nameAr", label(locale, "nameAr")], ["nameEn", label(locale, "nameEn")], ["nameFr", label(locale, "nameFr")], ["category", label(locale, "category")]]);
  if (!(["INSTITUTIONAL", "GOVERNMENT", "INTERNATIONAL", "UNIVERSITY", "PRIVATE"] as string[]).includes(text(data, "category"))) errors.category = requiredMessage(locale, label(locale, "category"));
  const logoError = validateFile(locale, data, "logoFile", imageTypes, 4, true, "logo"); if (logoError) errors.logoFile = logoError;
  const website = text(data, "website"); if (website && !validUrl(website)) errors.website = messages(locale).url;
  const order = text(data, "order"); if (order && (!/^\d+$/.test(order) || Number(order) < 0)) errors.order = locale === "ar" ? "يجب أن يكون الترتيب رقمًا موجبًا." : locale === "fr" ? "L’ordre doit être un nombre positif." : "Order must be a positive number.";
  if (Object.keys(errors).length) return invalid(locale, errors);
  return runAdminAction(locale, "savePartner", async () => {
    await editor();
    const slug = automaticSlug(data, "nameEn");
    const previous = await prisma.partner.findUnique({ where: { slug }, select: { logo: true } });
    const logo = await uploadedFile(data, "logoFile", "logo", "partners", imageTypes, 4);
    try {
      const values = { nameAr: text(data, "nameAr"), nameFr: text(data, "nameFr"), nameEn: text(data, "nameEn"), descriptionAr: text(data, "descriptionAr") || null, descriptionFr: text(data, "descriptionFr") || null, descriptionEn: text(data, "descriptionEn") || null, category: text(data, "category") as PartnerCategory, website: text(data, "website") || null, logo: logo.url, order: Number.parseInt(text(data, "order") || "0", 10) || 0, published: data.get("published") === "on" };
      await prisma.partner.upsert({ where: { slug }, update: values, create: { slug, ...values } });
    } catch (error) {
      await deleteBlobSafely(logo.uploadedUrl);
      throw error;
    }
    if (previous?.logo !== logo.url) await deleteBlobSafely(previous?.logo);
    revalidatePath(`/${locale}`); revalidatePath(`/${locale}/partners`); revalidatePath(`/${locale}/partners/${slug}`); revalidatePath(`/${locale}/admin/partners`);
  });
}

export async function deletePartner(locale: string, id: string, _data?: FormData) {
  return runAdminAction(locale, "deletePartner", async () => {
    await editor();
    const item = await prisma.partner.findUniqueOrThrow({ where: { id }, select: { logo: true } });
    await prisma.partner.delete({ where: { id } });
    await deleteBlobSafely(item.logo);
    revalidatePath(`/${locale}`); revalidatePath(`/${locale}/partners`); revalidatePath(`/${locale}/admin/partners`);
  }, messages(locale).deleted);
}

export async function deleteMembershipRequest(locale: string, id: string, _data?: FormData) {
  return runAdminAction(locale, "deleteMembershipRequest", async () => {
    await editor();
    const applicant = await prisma.membershipRequest.findUnique({ where: { id } });
    if (!applicant) return;
    await prisma.membershipRequest.delete({ where: { id } });
    await deleteBlobsSafely(
      [applicant.identityDocumentUrl, applicant.personalPhotoUrl, applicant.cvUrl, applicant.diplomaUrl, applicant.criminalRecordUrl, applicant.duesReceiptUrl],
      process.env.BLOB_READ_WRITE_TOKEN,
    );
    revalidatePath(`/${locale}/admin/members`);
  }, messages(locale).deleted);
}

export async function saveSiteSettings(locale: string, data: FormData) {
  const authorization = await authorizationError(locale); if (authorization) return authorization;
  const errors = requiredFields(locale, data, [["site_name_ar", label(locale, "site_name_ar")], ["site_name_en", label(locale, "site_name_en")], ["site_name_fr", label(locale, "site_name_fr")]]);
  const email = text(data, "contact_email"); if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.contact_email = locale === "ar" ? "عنوان البريد الإلكتروني غير صالح." : locale === "fr" ? "L’adresse e-mail est invalide." : "Email address is invalid.";
  const phone = text(data, "contact_phone"); if (phone && !/^[+()\d\s.-]{6,30}$/.test(phone)) errors.contact_phone = locale === "ar" ? "رقم الهاتف غير صالح." : locale === "fr" ? "Le numéro de téléphone est invalide." : "Phone number is invalid.";
  for (const key of ["facebook_url", "linkedin_url", "youtube_url", "map_embed_url"]) { const value = text(data, key); if (value && !validUrl(value)) errors[key] = messages(locale).url; }
  if (Object.keys(errors).length) return invalid(locale, errors);
  return runAdminAction(locale, "saveSiteSettings", async () => {
    await editor();
    const keys = ["site_name_ar", "site_name_fr", "site_name_en", "contact_email", "contact_phone", "contact_address_ar", "contact_address_fr", "contact_address_en", "facebook_url", "linkedin_url", "youtube_url", "map_embed_url"];
    await prisma.$transaction(keys.map((key) => prisma.siteSetting.upsert({ where: { key }, update: { value: text(data, key) }, create: { key, value: text(data, key) } })));
    revalidatePath(`/${locale}`); revalidatePath(`/${locale}/contact`); revalidatePath(`/${locale}/admin/content`);
  });
}

export async function saveLeadershipMember(locale: string, memberId: string, data: FormData) {
  const authorization = await authorizationError(locale); if (authorization) return authorization;
  const errors = requiredFields(locale, data, [["nameAr", label(locale, "nameAr")], ["nameEn", label(locale, "nameEn")], ["nameFr", label(locale, "nameFr")], ["roleAr", label(locale, "roleAr")], ["roleEn", label(locale, "roleEn")], ["roleFr", label(locale, "roleFr")]]);
  const imageError = validateFile(locale, data, "imageFile", imageTypes, 8, true, "imageUrl"); if (imageError) errors.imageFile = imageError;
  if (Object.keys(errors).length) return invalid(locale, errors);
  return runAdminAction(locale, "saveLeadershipMember", async () => {
    await editor();
    const members = await getLeadershipMembers();
    const previous = members.find((member) => member.id === memberId)?.imageUrl;
    const image = await uploadedFile(data, "imageFile", "imageUrl", "members", { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }, 8);
    const updated = members.map((member) => member.id === memberId ? { ...member, imageUrl: image.url || undefined, name: { ar: text(data, "nameAr"), fr: text(data, "nameFr"), en: text(data, "nameEn") }, role: { ar: text(data, "roleAr"), fr: text(data, "roleFr"), en: text(data, "roleEn") }, achievements: { ar: text(data, "achievementsAr"), fr: text(data, "achievementsFr"), en: text(data, "achievementsEn") } } : member);
    try {
      await prisma.siteSetting.upsert({ where: { key: "leadership_members" }, update: { value: JSON.stringify(updated) }, create: { key: "leadership_members", value: JSON.stringify(updated) } });
    } catch (error) {
      await deleteBlobSafely(image.uploadedUrl);
      throw error;
    }
    if (previous !== image.url) await deleteBlobSafely(previous);
    revalidatePath(`/${locale}`); revalidatePath(`/${locale}/structure`); revalidatePath(`/${locale}/president`); revalidatePath(`/${locale}/team/${memberId}`); revalidatePath(`/${locale}/admin/team`);
  });
}

export async function addLeadershipMember(locale: string, data: FormData) {
  const authorization = await authorizationError(locale); if (authorization) return authorization;
  const errors = requiredFields(locale, data, [["nameAr", label(locale, "nameAr")], ["nameEn", label(locale, "nameEn")], ["nameFr", label(locale, "nameFr")], ["roleAr", label(locale, "roleAr")], ["roleEn", label(locale, "roleEn")], ["roleFr", label(locale, "roleFr")]]);
  const imageError = validateFile(locale, data, "imageFile", imageTypes, 8, true, "imageUrl"); if (imageError) errors.imageFile = imageError;
  if (Object.keys(errors).length) return invalid(locale, errors);
  return runAdminAction(locale, "addLeadershipMember", async () => {
    await editor();
    const nameEn = text(data, "nameEn");
    const members = await getLeadershipMembers();
    const image = await uploadedFile(data, "imageFile", "imageUrl", "members", { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }, 8);
    const initials = nameEn.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    members.push({ id: randomUUID(), initials: initials || "TM", accent: "from-primary to-turquoise", imageUrl: image.url || undefined, name: { ar: text(data, "nameAr"), fr: text(data, "nameFr"), en: nameEn }, role: { ar: text(data, "roleAr"), fr: text(data, "roleFr"), en: text(data, "roleEn") }, summary: { ar: "", fr: "", en: "" }, achievements: { ar: text(data, "achievementsAr"), fr: text(data, "achievementsFr"), en: text(data, "achievementsEn") }, reportsTo: "president" });
    try {
      await prisma.siteSetting.upsert({ where: { key: "leadership_members" }, update: { value: JSON.stringify(members) }, create: { key: "leadership_members", value: JSON.stringify(members) } });
    } catch (error) {
      await deleteBlobSafely(image.uploadedUrl);
      throw error;
    }
    revalidatePath(`/${locale}`); revalidatePath(`/${locale}/structure`); revalidatePath(`/${locale}/president`); revalidatePath(`/${locale}/admin/team`);
  });
}

export async function removeLeadershipMember(locale: string, memberId: string, _data?: FormData) {
  if (memberId === "president") return { success: false, error: locale === "ar" ? "لا يمكن حذف رئيس المركز." : locale === "fr" ? "Le président ne peut pas être supprimé." : "The president cannot be removed." };
  return runAdminAction(locale, "removeLeadershipMember", async () => {
    await editor();
    const current = await getLeadershipMembers();
    const removed = current.find((member) => member.id === memberId);
    const members = current.filter((member) => member.id !== memberId);
    await prisma.siteSetting.upsert({ where: { key: "leadership_members" }, update: { value: JSON.stringify(members) }, create: { key: "leadership_members", value: JSON.stringify(members) } });
    await deleteBlobSafely(removed?.imageUrl);
    revalidatePath(`/${locale}`); revalidatePath(`/${locale}/structure`); revalidatePath(`/${locale}/president`); revalidatePath(`/${locale}/team/${memberId}`); revalidatePath(`/${locale}/admin/team`);
  }, messages(locale).deleted);
}
