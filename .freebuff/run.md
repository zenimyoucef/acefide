# Preview Run Doc

## Prerequisites
- Node.js 18+ installed
- Docker NOT required (using SQLite for local preview)

## Setup

### 1. Schema adapted for SQLite (preview only)
The prisma schema has been temporarily switched from PostgreSQL to SQLite:
- `prisma/schema.prisma` — `provider = "sqlite"` with enums → strings, arrays → single strings
- `.env` — `DATABASE_URL="file:./dev.db"`

To reproduce from a fresh checkout:
```
# Replace PostgreSQL datasource with SQLite in prisma/schema.prisma
# Set DATABASE_URL="file:./dev.db" in .env
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 2. Install dependencies
```
npm install
```

### 3. Start dev server
```
npm run dev
```
Server starts on port 3000 by default, or a random free port.

## Notes
- SQLite database file: `prisma/dev.db`
- Seed creates admin user and sample activities
- For production, restore PostgreSQL in schema.prisma and update DATABASE_URL
