DO $$
BEGIN
    CREATE TYPE "NewsCategory" AS ENUM ('NEWS', 'REPORTS', 'STUDIES', 'ANALYSIS');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE "EventCategory" AS ENUM ('ORGANIZED', 'PARTICIPATION', 'MEETING', 'MEDIA');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
CREATE TABLE IF NOT EXISTS "News" (
    "id" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerptAr" TEXT,
    "excerptEn" TEXT,
    "excerptFr" TEXT,
    "contentAr" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "contentFr" TEXT NOT NULL,
    "category" "NewsCategory" NOT NULL DEFAULT 'NEWS',
    "coverImage" TEXT,
    "galleryImages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDesc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "News_slug_key"
ON "News"("slug");

CREATE TABLE IF NOT EXISTS "Event" (
    "id" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descriptionAr" TEXT,
    "descriptionEn" TEXT,
    "descriptionFr" TEXT,
    "category" "EventCategory" NOT NULL DEFAULT 'ORGANIZED',
    "date" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "location" TEXT,
    "locationAr" TEXT,
    "locationEn" TEXT,
    "locationFr" TEXT,
    "speakers" TEXT,
    "coverImage" TEXT,
    "registrationLink" TEXT,
    "galleryImages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Event_slug_key"
ON "Event"("slug");