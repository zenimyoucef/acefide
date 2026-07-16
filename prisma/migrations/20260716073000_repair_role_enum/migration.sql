DO $$
BEGIN
    CREATE TYPE "Role" AS ENUM (
        'USER',
        'EDITOR',
        'ADMIN',
        'SUPER_ADMIN'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'User'
    ) THEN
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'User'
              AND column_name = 'role'
        ) THEN
            ALTER TABLE "User"
            ADD COLUMN "role" "Role" NOT NULL DEFAULT 'USER';
        ELSE
            ALTER TABLE "User"
            ALTER COLUMN "role" DROP DEFAULT;

            ALTER TABLE "User"
            ALTER COLUMN "role" TYPE "Role"
            USING (
                CASE UPPER(COALESCE("role"::TEXT, 'USER'))
                    WHEN 'SUPER_ADMIN' THEN 'SUPER_ADMIN'::"Role"
                    WHEN 'ADMIN' THEN 'ADMIN'::"Role"
                    WHEN 'EDITOR' THEN 'EDITOR'::"Role"
                    ELSE 'USER'::"Role"
                END
            );

            UPDATE "User"
            SET "role" = 'USER'
            WHERE "role" IS NULL;

            ALTER TABLE "User"
            ALTER COLUMN "role" SET DEFAULT 'USER',
            ALTER COLUMN "role" SET NOT NULL;
        END IF;
    END IF;
END $$;
