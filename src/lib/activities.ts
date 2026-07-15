import type { EventCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type Activity = { id: string; slug: string; category: EventCategory; date: Date; titleAr: string; titleEn: string; titleFr: string; descriptionAr: string | null; descriptionEn: string | null; descriptionFr: string | null; locationAr: string | null; locationEn: string | null; locationFr: string | null; coverImage: string | null; galleryImages:string[] };

const records = [
  {
    slug: "african-business-fair-2026",
    category: "PARTICIPATION",
    date: "2026-06-08",
    titleAr: "المشاركة في الطبعة الرابعة للصالون الإفريقي للأعمال",
    titleEn: "Participation in the 4th African Business Fair",
    titleFr: "Participation à la 4e édition du Salon africain des affaires",
    descriptionAr: "شارك رئيس المركز اكرم زيدي في فعاليات الصالون بالجزائر، مؤكداً أهمية توسيع الشراكات الاقتصادية الإفريقية وترقية الصادرات خارج المحروقات.",
    descriptionEn: "ACEFIDE President Akram Zidi took part in the Algiers fair, highlighting stronger African economic partnerships and the promotion of non-hydrocarbon exports.",
    descriptionFr: "Le président d’ACEFIDE, , a participé au salon à Alger, soulignant l’importance des partenariats économiques africains et des exportations hors hydrocarbures.",
    locationAr: "المدرسة العليا للفندقة والإطعام، الجزائر",
    locationEn: "ESHRA, Algiers",
    locationFr: "ESHRA, Alger",
  },
  {
    slug: "mining-innovation-roadmap-2025",
    category: "MEETING",
    date: "2025-07-30",
    titleAr: "خارطة طريق للابتكار والمقاولاتية في قطاع المناجم",
    titleEn: "Roadmap for innovation and entrepreneurship in the mining sector",
    titleFr: "Feuille de route pour l’innovation et l’entrepreneuriat dans le secteur minier",
    descriptionAr: "اجتماع تنسيقي ضم المركز والمديرية العامة للبحث العلمي والتطوير التكنولوجي والوكالة الوطنية لتثمين نتائج البحث، لضبط برنامج سنوي يربط البحث الجامعي بالمشاريع الاقتصادية في قطاع المناجم.",
    descriptionEn: "A coordination meeting involving ACEFIDE, DGRSDT, and ANVREDET defined an annual program linking university research and entrepreneurship to sustainable mining-sector innovation.",
    descriptionFr: "Une réunion de coordination réunissant ACEFIDE, la DGRSDT et l’ANVREDET a défini un programme annuel reliant recherche universitaire, entrepreneuriat et innovation minière durable.",
    locationAr: "مقر المديرية العامة للبحث العلمي والتطوير التكنولوجي، الجزائر",
    locationEn: "DGRSDT headquarters, Algiers",
    locationFr: "Siège de la DGRSDT, Alger",
  },
  {
    slug: "sonarem-mining-cooperation-2025",
    category: "ORGANIZED",
    date: "2025-06-02",
    titleAr: "المناجم: الاستثمار والابتكار والتحويل المحلي",
    titleEn: "Mining: investment, innovation, and local transformation",
    titleFr: "Mines : investissement, innovation et transformation locale",
    descriptionAr: "دعا المركز إلى تثمين الموارد المنجمية وخفض الواردات وزيادة الصادرات خارج المحروقات. وشهد اللقاء توقيع مذكرة تعاون بين سونارام-تكوين والمركز لدعم مشاركة الشباب وتبادل المعلومات الاقتصادية وتنظيم أنشطة مشتركة.",
    descriptionEn: "ACEFIDE advocated local mineral-resource transformation, lower imports, and stronger non-hydrocarbon exports. A cooperation memorandum with Sonarem-Formation supports youth participation, economic-information exchange, and joint activities.",
    descriptionFr: "ACEFIDE a plaidé pour la transformation locale des ressources minières, la réduction des importations et le développement des exportations hors hydrocarbures. Un mémorandum avec Sonarem-Formation soutient les jeunes et les activités communes.",
    locationAr: "الجزائر العاصمة",
    locationEn: "Algiers",
    locationFr: "Alger",
  },
  {
    slug: "aapi-delegation-meeting-2024",
    category: "MEETING",
    date: "2024-08-07",
    titleAr: "لقاء عمل مع الوكالة الجزائرية لترقية الاستثمار",
    titleEn: "Working meeting with the Algerian Investment Promotion Agency",
    titleFr: "Réunion de travail avec l’Agence algérienne de promotion de l’investissement",
    descriptionAr: "استقبل المدير العام للوكالة وفداً من المركز برئاسة اكرم زيدي لبحث إجراءات الاستثمار، مرافقة المستثمرين، ورقمنة منح العقار الاقتصادي عبر المنصة الرقمية للمستثمر.",
    descriptionEn: "AAPI’s Director General received an ACEFIDE delegation led by Akram Zidi to discuss investment procedures, investor support, and digital allocation of economic land through the Investor Digital Platform.",
    descriptionFr: "Le Directeur général de l’AAPI a reçu une délégation d’ACEFIDE conduite par Akram Zidi pour examiner les procédures d’investissement, l’accompagnement des investisseurs et l’octroi numérique du foncier économique.",
    locationAr: "مقر الوكالة الجزائرية لترقية الاستثمار، الجزائر",
    locationEn: "AAPI headquarters, Algiers",
    locationFr: "Siège de l’AAPI, Alger",
  },
  {
    slug: "media-digital-investment-forum-2024",
    category: "ORGANIZED",
    date: "2024-02-18",
    titleAr: "الإعلام الوطني والرقمي كآليتين لإنعاش الاستثمار والإقلاع الاقتصادي",
    titleEn: "National and digital media as drivers of investment and economic takeoff",
    titleFr: "Médias nationaux et information numérique, leviers de l’investissement et du décollage économique",
    descriptionAr: "ملتقى نظمه المركز بالتعاون مع الوكالة الجزائرية لترقية الاستثمار، وجمع ممثلين عن الوزارات والمؤسسات والقطاعين المالي والمصرفي. خلص إلى توصيات لتعزيز التواصل الاقتصادي والإعلام المتخصص والثقافة القانونية والتشاور مع المتعاملين.",
    descriptionEn: "Organized by ACEFIDE with AAPI, the forum brought together ministries, institutions, and financial-sector representatives. Its recommendations addressed economic communication, specialized media, legal awareness, and consultation with economic operators.",
    descriptionFr: "Organisé par ACEFIDE avec l’AAPI, le forum a réuni ministères, institutions et acteurs financiers. Ses recommandations ont porté sur la communication économique, la presse spécialisée, la culture juridique et la concertation avec les opérateurs.",
    locationAr: "الجزائر العاصمة",
    locationEn: "Algiers",
    locationFr: "Alger",
  },
] as const;

const fallback: Activity[] = records.map((item) => ({ id: item.slug, slug: item.slug, category: item.category as EventCategory, date: new Date(`${item.date}T12:00:00Z`), titleAr: item.titleAr, titleEn: item.titleEn, titleFr: item.titleFr, descriptionAr: item.descriptionAr, descriptionEn: item.descriptionEn, descriptionFr: item.descriptionFr, locationAr: item.locationAr, locationEn: item.locationEn, locationFr: item.locationFr, coverImage: null,galleryImages:[] }));
export async function getActivities() {
  const items=await prisma.event.findMany({where:{published:true},orderBy:{date:"desc"}}).catch(()=>[]);return items.length?items:fallback;
}

export async function getActivity(id: string) {
  return await prisma.event.findFirst({where:{published:true,OR:[{id},{slug:id}]}}).catch(()=>null)||fallback.find((item) => item.id === id || item.slug === id) || null;
}

export function localized(activity: Activity, locale: string) {
  const suffix = locale === "ar" ? "Ar" : locale === "fr" ? "Fr" : "En";
  return { title: activity[`title${suffix}` as keyof Activity] as string, description: activity[`description${suffix}` as keyof Activity] as string | null, location: activity[`location${suffix}` as keyof Activity] as string | null };
}
