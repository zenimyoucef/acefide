"use server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import type { EventCategory, PartnerCategory, PublicationCategory } from "@prisma/client";
import { getLeadershipMembers } from "@/lib/leadership-data";

async function editor() { const user = await getSession(); if (!user || !["EDITOR","ADMIN","SUPER_ADMIN"].includes(user.role)) throw new Error("Unauthorized"); return user; }
const text = (data: FormData, key: string) => String(data.get(key) || "").trim();
const slugify = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const automaticSlug = (data: FormData, source: string) => text(data, "slug") || slugify(text(data, source));

async function uploadedFile(data: FormData, fileKey: string, urlKey: string, folder: string, allowed: Record<string, string>, maxMb = 8) {
  const file = data.get(fileKey);
  if (!(file instanceof File) || file.size === 0) return text(data, urlKey) || null;
  if (file.size > maxMb * 1024 * 1024) throw new Error(`File must be smaller than ${maxMb} MB`);
  const extension = allowed[file.type];
  if (!extension) throw new Error("Unsupported file type");
  const directory = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(directory, { recursive: true });
  const filename = `${randomUUID()}.${extension}`;
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${filename}`;
}

const imageTypes = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
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

async function contentGallery(data:FormData,folder:string){
  let existing:string[]=[];try{const parsed=JSON.parse(text(data,"existingGalleryImages")||"[]");if(Array.isArray(parsed))existing=parsed.filter(x=>typeof x==="string");}catch{}
  const files=data.getAll("galleryFiles").filter((value):value is File=>value instanceof File&&value.size>0);
  const uploaded:string[]=[];
  for(const file of files){if(file.size>8*1024*1024)throw new Error("Each image must be smaller than 8 MB");const extension=imageTypes[file.type as keyof typeof imageTypes];if(!extension)throw new Error("Images must be JPG, PNG, WebP, or GIF");const directory=path.join(process.cwd(),"public","uploads",folder);await mkdir(directory,{recursive:true});const filename=`${randomUUID()}.${extension}`;await writeFile(path.join(directory,filename),Buffer.from(await file.arrayBuffer()));uploaded.push(`/uploads/${folder}/${filename}`);}
  const images=[...new Set([...existing,...uploaded])];const choice=text(data,"mainImageChoice");let coverImage:string|null=null;if(choice.startsWith("existing:"))coverImage=choice.slice(9);else if(choice.startsWith("new:"))coverImage=uploaded[Number(choice.slice(4))]||null;coverImage=coverImage||images[0]||null;return{images,coverImage};
}

export async function saveNews(locale: string, data: FormData) {
  const user = await editor(); const slug = automaticSlug(data,"titleEn"); if (!slug) throw new Error("English title is required");
  const gallery=await contentGallery(data,"news");
  await prisma.news.upsert({ where:{slug}, update:{ titleAr:text(data,"titleAr"),titleEn:text(data,"titleEn"),titleFr:text(data,"titleFr"),excerptAr:text(data,"excerptAr"),excerptEn:text(data,"excerptEn"),excerptFr:text(data,"excerptFr"),contentAr:text(data,"contentAr"),contentEn:text(data,"contentEn"),contentFr:text(data,"contentFr"),coverImage:gallery.coverImage,galleryImages:gallery.images,published:data.get("published")==="on",publishedAt:data.get("published")==="on"?new Date():null }, create:{slug,titleAr:text(data,"titleAr"),titleEn:text(data,"titleEn"),titleFr:text(data,"titleFr"),excerptAr:text(data,"excerptAr"),excerptEn:text(data,"excerptEn"),excerptFr:text(data,"excerptFr"),contentAr:text(data,"contentAr"),contentEn:text(data,"contentEn"),contentFr:text(data,"contentFr"),coverImage:gallery.coverImage,galleryImages:gallery.images,published:data.get("published")==="on",publishedAt:data.get("published")==="on"?new Date():null,authorId:user.id} });
  revalidatePath(`/${locale}`); revalidatePath(`/${locale}/news`); redirect(`/${locale}/admin/news`);
}
export async function updateNews(locale:string,id:string,data:FormData){
  await editor();const gallery=await contentGallery(data,"news");const published=data.get("published")==="on";
  await prisma.news.update({where:{id},data:{titleAr:text(data,"titleAr"),titleEn:text(data,"titleEn"),titleFr:text(data,"titleFr"),excerptAr:text(data,"excerptAr"),excerptEn:text(data,"excerptEn"),excerptFr:text(data,"excerptFr"),contentAr:text(data,"contentAr"),contentEn:text(data,"contentEn"),contentFr:text(data,"contentFr"),coverImage:gallery.coverImage,galleryImages:gallery.images,published,publishedAt:published?new Date():null}});
  revalidatePath(`/${locale}`);revalidatePath(`/${locale}/news`);revalidatePath(`/${locale}/admin/news`);redirect(`/${locale}/admin/news`);
}
export async function deleteNews(locale:string,id:string){ await editor(); await prisma.news.delete({where:{id}}); revalidatePath(`/${locale}`); revalidatePath(`/${locale}/news`); revalidatePath(`/${locale}/admin/news`); }
export async function deleteEvent(locale:string,id:string){ await editor(); await prisma.event.delete({where:{id}}); revalidatePath(`/${locale}/events`); revalidatePath(`/${locale}/admin/events`); }

export async function saveEvent(locale: string, data: FormData) {
  await editor();
  const slug = automaticSlug(data, "titleEn");
  if (!slug) throw new Error("English title is required");
  const published = data.get("published") === "on";
  const gallery=await contentGallery(data,"events");
  const values = {
    titleAr: text(data, "titleAr"), titleFr: text(data, "titleFr"), titleEn: text(data, "titleEn"),
    descriptionAr: text(data, "descriptionAr") || null, descriptionFr: text(data, "descriptionFr") || null, descriptionEn: text(data, "descriptionEn") || null,
    locationAr: text(data, "locationAr") || null, locationFr: text(data, "locationFr") || null, locationEn: text(data, "locationEn") || null,
    category: text(data, "category") as EventCategory, date: dateValue(data, "date", true)!, endDate: dateValue(data, "endDate"),
    speakers: text(data, "speakers") || null, registrationLink: text(data, "registrationLink") || null, coverImage:gallery.coverImage,galleryImages:gallery.images, published,
  };
  await prisma.event.upsert({ where: { slug }, update: values, create: { slug, ...values } });
  revalidatePath(`/${locale}/events`); revalidatePath(`/${locale}/admin/events`); redirect(`/${locale}/admin/events`);
}
export async function updateEvent(locale:string,id:string,data:FormData){
  await editor();const gallery=await contentGallery(data,"events");const published=data.get("published")==="on";
  await prisma.event.update({where:{id},data:{titleAr:text(data,"titleAr"),titleFr:text(data,"titleFr"),titleEn:text(data,"titleEn"),descriptionAr:text(data,"descriptionAr")||null,descriptionFr:text(data,"descriptionFr")||null,descriptionEn:text(data,"descriptionEn")||null,locationAr:text(data,"locationAr")||null,locationFr:text(data,"locationFr")||null,locationEn:text(data,"locationEn")||null,category:text(data,"category") as EventCategory,date:dateValue(data,"date",true)!,endDate:dateValue(data,"endDate"),speakers:text(data,"speakers")||null,registrationLink:text(data,"registrationLink")||null,coverImage:gallery.coverImage,galleryImages:gallery.images,published}});
  revalidatePath(`/${locale}/events`);revalidatePath(`/${locale}/admin/events`);redirect(`/${locale}/admin/events`);
}

export async function savePublication(locale: string, fixedCategory: PublicationCategory | null, data: FormData) {
  const user = await editor();
  const slug = automaticSlug(data, "titleEn");
  if (!slug) throw new Error("English title is required");
  const published = data.get("published") === "on";
  const category = fixedCategory || text(data, "category") as PublicationCategory;
  const coverImage = await uploadedFile(data, "coverImageFile", "coverImage", "publications/covers", imageTypes);
  const pdfUrl = await uploadedFile(data, "pdfFile", "pdfUrl", "publications/files", { "application/pdf": "pdf" }, 25);
  const values = {
    titleAr: text(data, "titleAr"), titleFr: text(data, "titleFr"), titleEn: text(data, "titleEn"),
    summaryAr: text(data, "summaryAr") || null, summaryFr: text(data, "summaryFr") || null, summaryEn: text(data, "summaryEn") || null,
    category, coverImage, pdfUrl, published, publishedAt: published ? new Date() : null,
  };
  await prisma.publication.upsert({ where: { slug }, update: values, create: { slug, ...values, authorId: user.id } });
  revalidatePath(`/${locale}/publications`); revalidatePath(`/${locale}/admin/publications`); revalidatePath(`/${locale}/admin/studies`);
  redirect(`/${locale}/admin/${category === "STUDY" ? "studies" : "publications"}`);
}

export async function deletePublication(locale: string, id: string) {
  await editor(); await prisma.publication.delete({ where: { id } });
  revalidatePath(`/${locale}/publications`); revalidatePath(`/${locale}/admin/publications`); revalidatePath(`/${locale}/admin/studies`);
}

export async function savePartner(locale: string, data: FormData) {
  await editor();
  const slug = automaticSlug(data, "nameEn");
  if (!slug) throw new Error("English organization name is required");
  const logo = await uploadedFile(data, "logoFile", "logo", "partners", imageTypes, 4);
  const values = {
    nameAr: text(data, "nameAr"), nameFr: text(data, "nameFr"), nameEn: text(data, "nameEn"),
    descriptionAr: text(data, "descriptionAr") || null, descriptionFr: text(data, "descriptionFr") || null, descriptionEn: text(data, "descriptionEn") || null,
    category: text(data, "category") as PartnerCategory, website: text(data, "website") || null, logo,
    order: Number.parseInt(text(data, "order") || "0", 10) || 0, published: data.get("published") === "on",
  };
  await prisma.partner.upsert({ where: { slug }, update: values, create: { slug, ...values } });
  revalidatePath(`/${locale}`); revalidatePath(`/${locale}/partners`); revalidatePath(`/${locale}/partners/${slug}`); revalidatePath(`/${locale}/admin/partners`); redirect(`/${locale}/admin/partners`);
}

export async function deletePartner(locale: string, id: string) {
  await editor(); await prisma.partner.delete({ where: { id } });
  revalidatePath(`/${locale}`); revalidatePath(`/${locale}/partners`); revalidatePath(`/${locale}/admin/partners`);
}

export async function saveSiteSettings(locale: string, data: FormData) {
  await editor();
  const keys = ["site_name_ar", "site_name_fr", "site_name_en", "contact_email", "contact_phone", "contact_address_ar", "contact_address_fr", "contact_address_en", "facebook_url", "linkedin_url", "youtube_url", "map_embed_url"];
  await prisma.$transaction(keys.map((key) => prisma.siteSetting.upsert({ where: { key }, update: { value: text(data, key) }, create: { key, value: text(data, key) } })));
  revalidatePath(`/${locale}`); revalidatePath(`/${locale}/contact`); revalidatePath(`/${locale}/admin/content`); redirect(`/${locale}/admin/content`);
}

export async function saveLeadershipMember(locale: string, memberId: string, data: FormData) {
  await editor();
  const members = await getLeadershipMembers();
  const imageUrl = await uploadedFile(data, "imageFile", "imageUrl", "leadership", { "image/jpeg":"jpg", "image/png":"png", "image/webp":"webp" }, 8);
  const updated = members.map(member => member.id === memberId ? {
    ...member,
    imageUrl: imageUrl || undefined,
    name: { ar:text(data,"nameAr"), fr:text(data,"nameFr"), en:text(data,"nameEn") },
    role: { ar:text(data,"roleAr"), fr:text(data,"roleFr"), en:text(data,"roleEn") },
  } : member);
  await prisma.siteSetting.upsert({ where:{key:"leadership_members"}, update:{value:JSON.stringify(updated)}, create:{key:"leadership_members",value:JSON.stringify(updated)} });
  revalidatePath(`/${locale}`); revalidatePath(`/${locale}/structure`); revalidatePath(`/${locale}/president`); revalidatePath(`/${locale}/admin/team`);
  redirect(`/${locale}/admin/team`);
}

export async function addLeadershipMember(locale: string, data: FormData) {
  await editor(); const members=await getLeadershipMembers(); const nameEn=text(data,"nameEn"); if(!nameEn)throw new Error("English name is required");
  const imageUrl=await uploadedFile(data,"imageFile","imageUrl","leadership",{"image/jpeg":"jpg","image/png":"png","image/webp":"webp"},8);
  const initials=nameEn.split(/\s+/).map(part=>part[0]).join("").slice(0,2).toUpperCase();
  members.push({id:randomUUID(),initials:initials||"TM",accent:"from-primary to-turquoise",imageUrl:imageUrl||undefined,name:{ar:text(data,"nameAr"),fr:text(data,"nameFr"),en:nameEn},role:{ar:text(data,"roleAr"),fr:text(data,"roleFr"),en:text(data,"roleEn")},summary:{ar:"",fr:"",en:""},reportsTo:"president"});
  await prisma.siteSetting.upsert({where:{key:"leadership_members"},update:{value:JSON.stringify(members)},create:{key:"leadership_members",value:JSON.stringify(members)}});
  revalidatePath(`/${locale}`);revalidatePath(`/${locale}/structure`);revalidatePath(`/${locale}/president`);revalidatePath(`/${locale}/admin/team`);redirect(`/${locale}/admin/team`);
}

export async function removeLeadershipMember(locale:string,memberId:string){
  await editor();if(memberId==="president")throw new Error("The president cannot be removed");const members=(await getLeadershipMembers()).filter(member=>member.id!==memberId);
  await prisma.siteSetting.upsert({where:{key:"leadership_members"},update:{value:JSON.stringify(members)},create:{key:"leadership_members",value:JSON.stringify(members)}});
  revalidatePath(`/${locale}`);revalidatePath(`/${locale}/structure`);revalidatePath(`/${locale}/president`);revalidatePath(`/${locale}/admin/team`);
}
