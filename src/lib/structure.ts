export type Locale = "ar" | "fr" | "en";

export type LeadershipMember = {
  id: string;
  initials: string;
  accent: string;
  name: Record<Locale, string>;
  role: Record<Locale, string>;
  summary: Record<Locale, string>;
  imageUrl?: string;
  image?: "akram";
  reportsTo?: string;
};

export const leadershipMembers: LeadershipMember[] = [
  {
    id: "president",
    initials: "AI",
    accent: "from-primary to-turquoise",
    image: "akram",
    name: { ar: "اكرم زيدي", fr: "Akram Zidi", en: "Akram Zidi" },
    role: { ar: "رئيس المركز", fr: "Président", en: "President" },
    summary: {
      ar: "يقود الرؤية العامة للمركز وبرامجه الاستراتيجية.",
      fr: "Porte la vision générale du centre et ses programmes stratégiques.",
      en: "Leads the center's overall vision and strategic programs.",
    },
  },
  {
    id: "vp-foresight",
    initials: "VP",
    accent: "from-[#0b7a53] to-[#4f9f86]",
    name: { ar: "نائب الرئيس", fr: "Vice-président", en: "Vice President" },
    role: { ar: "الاستشراف والدراسات", fr: "Prospective et études", en: "Foresight and Studies" },
    summary: {
      ar: "يشرف على الدراسات الاقتصادية، التحليل، وإعداد التوصيات.",
      fr: "Supervise les études économiques, l’analyse et les recommandations.",
      en: "Oversees economic studies, analysis, and recommendations.",
    },
    reportsTo: "president",
  },
  {
    id: "vp-investment",
    initials: "VP",
    accent: "from-[#168b78] to-[#5db8a9]",
    name: { ar: "نائب الرئيس", fr: "Vice-président", en: "Vice President" },
    role: { ar: "تطوير الاستثمار", fr: "Développement de l’investissement", en: "Investment Development" },
    summary: {
      ar: "يتابع ملفات الاستثمار، مرافقة المستثمرين، وفرص الشراكة.",
      fr: "Suit les dossiers d’investissement, l’accompagnement et les partenariats.",
      en: "Coordinates investment files, investor support, and partnership opportunities.",
    },
    reportsTo: "president",
  },
  {
    id: "vp-entrepreneurship",
    initials: "VP",
    accent: "from-[#c8a24a] to-[#d9c06d]",
    name: { ar: "نائب الرئيس", fr: "Vice-président", en: "Vice President" },
    role: { ar: "المقاولاتية والشراكات", fr: "Entrepreneuriat et partenariats", en: "Entrepreneurship and Partnerships" },
    summary: {
      ar: "ينسق برامج المقاولاتية، العلاقات المؤسساتية، والشبكات المهنية.",
      fr: "Coordonne les programmes entrepreneuriaux et les relations institutionnelles.",
      en: "Coordinates entrepreneurship programs, institutional relations, and networks.",
    },
    reportsTo: "president",
  },
  {
    id: "secretary-general",
    initials: "SG",
    accent: "from-[#263f55] to-[#50718f]",
    name: { ar: "الأمين العام", fr: "Secrétaire général", en: "Secretary General" },
    role: { ar: "التنسيق الإداري", fr: "Coordination administrative", en: "Administrative Coordination" },
    summary: {
      ar: "ينظم الاجتماعات، الوثائق، والمتابعة الداخلية.",
      fr: "Organise les réunions, les documents et le suivi interne.",
      en: "Organizes meetings, documentation, and internal follow-up.",
    },
    reportsTo: "president",
  },
  {
    id: "programs-coordinator",
    initials: "SB",
    accent: "from-[#0b7a53] to-[#9ac7b2]",
    name: { ar: "سارة بن علي", fr: "Sara Benali", en: "Sara Benali" },
    role: { ar: "تنسيق البرامج", fr: "Coordination des programmes", en: "Programs Coordination" },
    summary: {
      ar: "تتابع برمجة الأنشطة وتنسيق المبادرات.",
      fr: "Suit la programmation des activités et la coordination des initiatives.",
      en: "Supports activity planning and initiative coordination.",
    },
    reportsTo: "president",
  },
  {
    id: "research-officer",
    initials: "MK",
    accent: "from-[#168b78] to-[#65c9bb]",
    name: { ar: "محمد كروم", fr: "Mohamed Kerroum", en: "Mohamed Kerroum" },
    role: { ar: "البحث والتحليل", fr: "Recherche et analyse", en: "Research and Analysis" },
    summary: {
      ar: "يساهم في إعداد الدراسات والملخصات الاقتصادية.",
      fr: "Contribue aux études et aux synthèses économiques.",
      en: "Contributes to economic studies and briefs.",
    },
    reportsTo: "president",
  },
  {
    id: "partnerships-officer",
    initials: "LH",
    accent: "from-[#c8a24a] to-[#e4cf83]",
    name: { ar: "لينا حداد", fr: "Lina Haddad", en: "Lina Haddad" },
    role: { ar: "الشراكات", fr: "Partenariats", en: "Partnerships" },
    summary: {
      ar: "تدعم العلاقات المؤسساتية وفرص التعاون.",
      fr: "Appuie les relations institutionnelles et les coopérations.",
      en: "Supports institutional relations and cooperation opportunities.",
    },
    reportsTo: "president",
  },
  {
    id: "communications-officer",
    initials: "YM",
    accent: "from-[#263f55] to-[#6c91ad]",
    name: { ar: "ياسين منصوري", fr: "Yacine Mansouri", en: "Yacine Mansouri" },
    role: { ar: "الاتصال والإعلام", fr: "Communication", en: "Communications" },
    summary: {
      ar: "يتابع الاتصال ونشر أخبار المركز.",
      fr: "Suit la communication et la diffusion des actualités du centre.",
      en: "Supports communications and center news updates.",
    },
    reportsTo: "president",
  },
  {
    id: "member-relations",
    initials: "NB",
    accent: "from-[#7f6caa] to-[#b5a9d6]",
    name: { ar: "نور بكوش", fr: "Nour Bekkouche", en: "Nour Bekkouche" },
    role: { ar: "علاقات الأعضاء", fr: "Relations membres", en: "Member Relations" },
    summary: {
      ar: "تتابع طلبات العضوية والتواصل مع الأعضاء.",
      fr: "Suit les demandes d'adhésion et les échanges avec les membres.",
      en: "Supports membership requests and member communication.",
    },
    reportsTo: "president",
  },
];

export const structureCopy = {
  ar: {
    previewLabel: "فريق القيادة",
    previewTitle: "هيكل المركز",
    previewCta: "عرض الهيكل التنظيمي",
    pageEyebrow: "ACEFIDE",
    pageTitle: "الهيكل التنظيمي للمركز",
    pageIntro: "نظرة منظمة على قيادة المركز والمسؤوليات الأساسية داخل ACEFIDE.",
    president: "الرئاسة",
    executive: "النواب والإدارة",
    reportsTo: "يرتبط بـ",
  },
  fr: {
    previewLabel: "Équipe dirigeante",
    previewTitle: "Structure du centre",
    previewCta: "Voir l’organigramme",
    pageEyebrow: "ACEFIDE",
    pageTitle: "Structure organisationnelle du centre",
    pageIntro: "Vue organisée de la direction du centre et des responsabilités clés d’ACEFIDE.",
    president: "Présidence",
    executive: "Vice-présidences et administration",
    reportsTo: "Rattaché à",
  },
  en: {
    previewLabel: "Leadership team",
    previewTitle: "Center structure",
    previewCta: "View organization chart",
    pageEyebrow: "ACEFIDE",
    pageTitle: "ACEFIDE Organization Structure",
    pageIntro: "A structured view of the center's leadership and core responsibilities.",
    president: "Presidency",
    executive: "Vice Presidents and Administration",
    reportsTo: "Reports to",
  },
} as const;
