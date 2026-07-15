# ACEFIDE institutional website

Multilingual institutional website and administration system for the Algerian Center for Economic Foresight, Investment Development and Entrepreneurship. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, next-intl, PostgreSQL, and Prisma.

## Local setup

1. Copy `.env.example` to `.env` and configure `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`, and a long random `AUTH_SECRET`.
2. Install dependencies with `npm install`.
3. Create a new database with `npm run db:migrate`.
4. Set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 12 characters, then run `npm run db:seed`.
5. Start the site with `npm run dev`.

The seed is idempotent and adds curated ACEFIDE activities and settings. It creates an administrator only when both administrator variables are present; there is no default password.

For a database that predates the migration directory, back it up first, reconcile it with `npx prisma db push`, and mark the baseline as applied with `npx prisma migrate resolve --applied 20260706000000_acefide_baseline`. New databases should use `npx prisma migrate deploy`.

## Commands

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript verification
- `npm run db:migrate` — create/apply development migrations
- `npx prisma migrate deploy` — apply migrations in production
- `npm run db:seed` — seed activities, settings, and optionally the first administrator
- `npm run db:studio` — inspect the database

## Administration and forms

Administration is available at `/{locale}/admin` and requires an active `EDITOR`, `ADMIN`, or `SUPER_ADMIN` account. Sessions use an HTTP-only, same-site signed cookie and expire after eight hours. Use HTTPS and a strong `AUTH_SECRET` in production.

Contact, consultation, membership, newsletter, and event registration endpoints validate input and apply basic per-instance rate limiting. Submissions are stored in PostgreSQL and shown in the administration area. Email sending is not enabled; the SMTP variables in `.env.example` are reserved for a future provider integration.

## Deployment

Before deploying to Vercel or another Node.js platform:

1. Provision PostgreSQL and set all required environment variables.
2. Run `npx prisma migrate deploy` against the production database.
3. Run the seed once with secure administrator variables, then remove `ADMIN_PASSWORD` from the deployment environment if it is no longer needed.
4. Run `npm run typecheck`, `npm run lint`, and `npm run build`.
5. Confirm the production URL, Facebook link, organization content, and contact settings.

Uploads are URL-based. Add external object storage before implementing direct image or PDF uploads; serverless local filesystems are not persistent.
