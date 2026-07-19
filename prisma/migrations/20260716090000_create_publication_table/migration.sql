DO $$
BEGIN
    CREATE TYPE "PublicationCategory" AS ENUM (
        'REPORT',
        'STUDY',
        'ANALYSIS',
        'POLICY_BRIEF'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "Publication" (
    "id" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summaryAr" TEXT,
    "summaryEn" TEXT,
    "summaryFr" TEXT,
    "category" "PublicationCategory" NOT NULL DEFAULT 'REPORT',
    "coverImage" TEXT,
    "pdfUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Publication_authorId_fkey"
        FOREIGN KEY ("authorId")
        REFERENCES "User"("id")
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Publication_slug_key"
ON "Publication"("slug");
