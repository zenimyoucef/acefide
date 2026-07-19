"use server";

import { randomUUID } from "crypto";
import { del, put } from "@vercel/blob";
import type { EventCategory, PartnerCategory, PublicationCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getLeadershipMembers } from "@/lib/leadership-data";
import { prisma } from "@/lib/prisma";

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
  if (file.size > maxMb * 1024 * 1024) throw new Error(`File must be smaller than ${maxMb} MB`);
  const fallbackExtension = allowed[file.type];
  if (!fallbackExtension) throw new Error(`Unsupported file type: ${file.type || "unknown"}`);

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

async function runAdminAction<T>(name: string, action: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error) {
    console.error(`Admin action ${name} failed:`, error);
    throw error;
  }
}

const dateValue = (data: FormData, key: string, required = false) => {
  const value = text(data, key);
  if (!value) {
    if (required) throw new Error(`${key} is required`);
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`${key} is not a valid date`);
  return date;
};

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
  const user = await editor();
  const slug = automaticSlug(data, "titleEn");
  if (!slug) throw new Error("English title is required");
  await runAdminAction("saveNews", async () => {
    const previous = await prisma.news.findUnique({ where: { slug }, select: { coverImage: true, galleryImages: true } });
    const gallery = await contentGallery(data, "news");
    try {
      await prisma.news.upsert({ where: { slug }, update: { titleAr: text(data, "titleAr"), titleEn: text(data, "titleEn"), titleFr: text(data, "titleFr"), excerptAr: text(data, "excerptAr"), excerptEn: text(data, "excerptEn"), excerptFr: text(data, "excerptFr"), contentAr: text(data, "contentAr"), contentEn: text(data, "contentEn"), contentFr: text(data, "contentFr"), coverImage: gallery.coverImage, galleryImages: gallery.images, published: data.get("published") === "on", publishedAt: data.get("published") === "on" ? new Date() : null }, create: { slug, titleAr: text(data, "titleAr"), titleEn: text(data, "titleEn"), titleFr: text(data, "titleFr"), excerptAr: text(data, "excerptAr"), excerptEn: text(data, "excerptEn"), excerptFr: text(data, "excerptFr"), contentAr: text(data, "contentAr"), contentEn: text(data, "contentEn"), contentFr: text(data, "contentFr"), coverImage: gallery.coverImage, galleryImages: gallery.images, published: data.get("published") === "on", publishedAt: data.get("published") === "on" ? new Date() : null, authorId: user.id } });
    } catch (error) {
      await deleteBlobsSafely(gallery.uploaded);
      throw error;
    }
    if (previous) await deleteBlobsSafely(staleUrls([previous.coverImage, ...previous.galleryImages], [gallery.coverImage, ...gallery.images]));
  });
  revalidatePath(`/${locale}`); revalidatePath(`/${locale}/news`); redirect(`/${locale}/admin/news`);
}

export async function updateNews(locale: string, id: string, data: FormData) {
  await editor();
  await runAdminAction("updateNews", async () => {
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
  });
  revalidatePath(`/${locale}`); revalidatePath(`/${locale}/news`); revalidatePath(`/${locale}/admin/news`); redirect(`/${locale}/admin/news`);
}

export async function deleteNews(locale: string, id: string) {
  await editor();
  await runAdminAction("deleteNews", async () => {
    const item = await prisma.news.findUniqueOrThrow({ where: { id }, select: { coverImage: true, galleryImages: true } });
    await prisma.news.delete({ where: { id } });
    await deleteBlobsSafely([item.coverImage, ...item.galleryImages]);
  });
  revalidatePath(`/${locale}`); revalidatePath(`/${locale}/news`); revalidatePath(`/${locale}/admin/news`);
}

export async function deleteEvent(locale: string, id: string) {
  await editor();
  await runAdminAction("deleteEvent", async () => {
    const item = await prisma.event.findUniqueOrThrow({ where: { id }, select: { coverImage: true, galleryImages: true } });
    await prisma.event.delete({ where: { id } });
    await deleteBlobsSafely([item.coverImage, ...item.galleryImages]);
  });
  revalidatePath(`/${locale}/events`); revalidatePath(`/${locale}/admin/events`);
}

export async function saveEvent(locale: string, data: FormData) {
  await editor();
  const slug = automaticSlug(data, "titleEn");
  if (!slug) throw new Error("English title is required");
  await runAdminAction("saveEvent", async () => {
    const previous = await prisma.event.findUnique({ where: { slug }, select: { coverImage: true, galleryImages: true } });
    const published = data.get("published") === "on";
    const gallery = await contentGallery(data, "events");
    const values = { titleAr: text(data, "titleAr"), titleFr: text(data, "titleFr"), titleEn: text(data, "titleEn"), descriptionAr: text(data, "descriptionAr") || null, descriptionFr: text(data, "descriptionFr") || null, descriptionEn: text(data, "descriptionEn") || null, locationAr: text(data, "locationAr") || null, locationFr: text(data, "locationFr") || null, locationEn: text(data, "locationEn") || null, category: text(data, "category") as EventCategory, date: dateValue(data, "date", true)!, endDate: dateValue(data, "endDate"), speakers: text(data, "speakers") || null, registrationLink: text(data, "registrationLink") || null, coverImage: gallery.coverImage, galleryImages: gallery.images, published };
    try {
      await prisma.event.upsert({ where: { slug }, update: values, create: { slug, ...values } });
    } catch (error) {
      await deleteBlobsSafely(gallery.uploaded);
      throw error;
    }
    if (previous) await deleteBlobsSafely(staleUrls([previous.coverImage, ...previous.galleryImages], [gallery.coverImage, ...gallery.images]));
  });
  revalidatePath(`/${locale}/events`); revalidatePath(`/${locale}/admin/events`); redirect(`/${locale}/admin/events`);
}

export async function updateEvent(locale: string, id: string, data: FormData) {
  await editor();
  await runAdminAction("updateEvent", async () => {
    const previous = await prisma.event.findUniqueOrThrow({ where: { id }, select: { coverImage: true, galleryImages: true } });
    const gallery = await contentGallery(data, "events");
    const published = data.get("published") === "on";
    try {
      await prisma.event.update({ where: { id }, data: { titleAr: text(data, "titleAr"), titleFr: text(data, "titleFr"), titleEn: text(data, "titleEn"), descriptionAr: text(data, "descriptionAr") || null, descriptionFr: text(data, "descriptionFr") || null, descriptionEn: text(data, "descriptionEn") || null, locationAr: text(data, "locationAr") || null, locationFr: text(data, "locationFr") || null, locationEn: text(data, "locationEn") || null, category: text(data, "category") as EventCategory, date: dateValue(data, "date", true)!, endDate: dateValue(data, "endDate"), speakers: text(data, "speakers") || null, registrationLink: text(data, "registrationLink") || null, coverImage: gallery.coverImage, galleryImages: gallery.images, published } });
    } catch (error) {
      await deleteBlobsSafely(gallery.uploaded);
      throw error;
    }
    await deleteBlobsSafely(staleUrls([previous.coverImage, ...previous.galleryImages], [gallery.coverImage, ...gallery.images]));
  });
  revalidatePath(`/${locale}/events`); revalidatePath(`/${locale}/admin/events`); redirect(`/${locale}/admin/events`);
}

export async function savePublication(locale: string, fixedCategory: PublicationCategory | null, data: FormData) {
  const user = await editor();
  const slug = automaticSlug(data, "titleEn");
  if (!slug) throw new Error("English title is required");
  const category = fixedCategory || text(data, "category") as PublicationCategory;
  await runAdminAction("savePublication", async () => {
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
  });
  revalidatePath(`/${locale}/publications`); revalidatePath(`/${locale}/admin/publications`); revalidatePath(`/${locale}/admin/studies`);
  redirect(`/${locale}/admin/${category === "STUDY" ? "studies" : "publications"}`);
}

export async function deletePublication(locale: string, id: string) {
  await editor();
  await runAdminAction("deletePublication", async () => {
    const item = await prisma.publication.findUniqueOrThrow({ where: { id }, select: { coverImage: true, pdfUrl: true } });
    await prisma.publication.delete({ where: { id } });
    await deleteBlobsSafely([item.coverImage, item.pdfUrl]);
  });
  revalidatePath(`/${locale}/publications`); revalidatePath(`/${locale}/admin/publications`); revalidatePath(`/${locale}/admin/studies`);
}

export async function savePartner(locale: string, data: FormData) {
  await editor();
  const slug = automaticSlug(data, "nameEn");
  if (!slug) throw new Error("English organization name is required");
  await runAdminAction("savePartner", async () => {
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
  });
  revalidatePath(`/${locale}`); revalidatePath(`/${locale}/partners`); revalidatePath(`/${locale}/partners/${slug}`); revalidatePath(`/${locale}/admin/partners`); redirect(`/${locale}/admin/partners`);
}

export async function deletePartner(locale: string, id: string) {
  await editor();
  await runAdminAction("deletePartner", async () => {
    const item = await prisma.partner.findUniqueOrThrow({ where: { id }, select: { logo: true } });
    await prisma.partner.delete({ where: { id } });
    await deleteBlobSafely(item.logo);
  });
  revalidatePath(`/${locale}`); revalidatePath(`/${locale}/partners`); revalidatePath(`/${locale}/admin/partners`);
}

export async function deleteMembershipRequest(locale: string, id: string) {
  await editor();
  await runAdminAction("deleteMembershipRequest", async () => {
    const applicant = await prisma.membershipRequest.findUnique({ where: { id } });
    if (!applicant) return;
    await prisma.membershipRequest.delete({ where: { id } });
    await deleteBlobsSafely(
      [applicant.identityDocumentUrl, applicant.personalPhotoUrl, applicant.cvUrl, applicant.diplomaUrl, applicant.criminalRecordUrl, applicant.duesReceiptUrl],
      process.env.BLOB_READ_WRITE_TOKEN,
    );
  });
  revalidatePath(`/${locale}/admin/members`);
}

export async function saveSiteSettings(locale: string, data: FormData) {
  await editor();
  await runAdminAction("saveSiteSettings", async () => {
    const keys = ["site_name_ar", "site_name_fr", "site_name_en", "contact_email", "contact_phone", "contact_address_ar", "contact_address_fr", "contact_address_en", "facebook_url", "linkedin_url", "youtube_url", "map_embed_url"];
    await prisma.$transaction(keys.map((key) => prisma.siteSetting.upsert({ where: { key }, update: { value: text(data, key) }, create: { key, value: text(data, key) } })));
  });
  revalidatePath(`/${locale}`); revalidatePath(`/${locale}/contact`); revalidatePath(`/${locale}/admin/content`); redirect(`/${locale}/admin/content`);
}

export async function saveLeadershipMember(locale: string, memberId: string, data: FormData) {
  await editor();
  await runAdminAction("saveLeadershipMember", async () => {
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
  });
  revalidatePath(`/${locale}`); revalidatePath(`/${locale}/structure`); revalidatePath(`/${locale}/president`); revalidatePath(`/${locale}/team/${memberId}`); revalidatePath(`/${locale}/admin/team`); redirect(`/${locale}/admin/team`);
}

export async function addLeadershipMember(locale: string, data: FormData) {
  await editor();
  const nameEn = text(data, "nameEn");
  if (!nameEn) throw new Error("English name is required");
  await runAdminAction("addLeadershipMember", async () => {
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
  });
  revalidatePath(`/${locale}`); revalidatePath(`/${locale}/structure`); revalidatePath(`/${locale}/president`); revalidatePath(`/${locale}/admin/team`); redirect(`/${locale}/admin/team`);
}

export async function removeLeadershipMember(locale: string, memberId: string) {
  await editor();
  if (memberId === "president") throw new Error("The president cannot be removed");
  await runAdminAction("removeLeadershipMember", async () => {
    const current = await getLeadershipMembers();
    const removed = current.find((member) => member.id === memberId);
    const members = current.filter((member) => member.id !== memberId);
    await prisma.siteSetting.upsert({ where: { key: "leadership_members" }, update: { value: JSON.stringify(members) }, create: { key: "leadership_members", value: JSON.stringify(members) } });
    await deleteBlobSafely(removed?.imageUrl);
  });
  revalidatePath(`/${locale}`); revalidatePath(`/${locale}/structure`); revalidatePath(`/${locale}/president`); revalidatePath(`/${locale}/team/${memberId}`); revalidatePath(`/${locale}/admin/team`);
}
