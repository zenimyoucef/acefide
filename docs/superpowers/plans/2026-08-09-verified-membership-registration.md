# Verified Membership Registration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build account registration with email verification before membership document submission, followed by pending-review status and approval-gated dashboard access.

**Architecture:** Extend the existing Prisma user model and custom signed-cookie sessions. Keep token creation and email delivery in focused server modules, expose small rate-limited route handlers, and make the localized membership route render the correct signup, verification, application, review, or approved state. The membership API derives identity from the authenticated user, while the existing admin action updates the linked request instead of creating an account.

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript 5.9, Prisma 5/PostgreSQL, Zod, bcryptjs, Nodemailer, Vitest.

## Global Constraints

- Read relevant `node_modules/next/dist/docs/` guidance before changing Next.js route, cookie, redirect, or page behavior.
- Verification links are random, single-use, replaceable, and expire after 24 hours; only SHA-256 token hashes are stored.
- Passwords are 8–128 characters and bcrypt-hashed with cost 12.
- Account email is normalized and is authoritative for membership submission.
- Anonymous or unverified users cannot upload or submit membership documents.
- Existing unrelated working-tree changes must be preserved.
- The final member dashboard remains a localized placeholder.

---

## File map

- `prisma/schema.prisma` and a new migration: verification state on `User`.
- `src/lib/email-verification.ts`: token generation, hashing, expiry, and verification operations.
- `src/lib/verification-email.ts`: SMTP delivery and localized verification URL construction.
- `src/lib/membership-access.ts`: pure mapping from user/application state to the membership UI state.
- `src/app/api/auth/register/route.ts`: account creation and initial mail dispatch.
- `src/app/api/auth/verify-email/route.ts`: token consumption, session issuance, and redirect.
- `src/app/api/auth/resend-verification/route.ts`: generic, rate-limited resend behavior.
- `src/app/api/auth/login/route.ts`: verification-aware applicant login.
- `src/app/api/membership/route.ts`: authenticated, verified, ownership-linked submission.
- `src/app/[locale]/membership/page.tsx`: server state router.
- `src/components/membership/RegistrationForm.tsx`, `CheckEmailPanel.tsx`, `MembershipApplicationForm.tsx`, `MembershipStatusPanel.tsx`: focused client/UI units.
- `src/app/[locale]/admin/actions.ts`: approval updates the existing linked account/request.
- `src/messages/{ar,en,fr}.json`: localized registration, verification, and status copy.
- `src/**/*.test.ts`: colocated Vitest coverage for pure services and route behavior.

### Task 1: Test harness and verification data model

**Files:**
- Modify: `package.json`
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260809120000_add_email_verification/migration.sql`
- Create: `vitest.config.ts`

**Interfaces:**
- Produces: Prisma `User.emailVerifiedAt`, `emailVerificationTokenHash`, and `emailVerificationExpiresAt` nullable fields.

- [ ] Add Vitest as a development dependency and scripts `test` (`vitest run`) and `test:watch` (`vitest`).
- [ ] Add a Vitest config resolving `@` to `src` and using the Node environment.
- [ ] Add the three nullable fields to `User`, with a unique constraint on the token hash.
- [ ] Write the SQL migration using `ALTER TABLE "User" ADD COLUMN ...` and a unique index.
- [ ] Run `npx prisma validate` and `npx prisma generate`; expect both to exit 0.
- [ ] Commit with `chore: prepare email verification data model`.

### Task 2: Verification token service

**Files:**
- Create: `src/lib/email-verification.test.ts`
- Create: `src/lib/email-verification.ts`

**Interfaces:**
- Produces: `createEmailVerificationToken(now?: Date): { token: string; tokenHash: string; expiresAt: Date }`, `hashEmailVerificationToken(token: string): string`, and `isVerificationExpired(expiresAt: Date, now?: Date): boolean`.

- [ ] Write failing tests asserting a token has at least 32 random bytes, its stored value is a SHA-256 hash rather than the raw token, expiry is exactly 24 hours, and expiry boundary comparison is deterministic.
- [ ] Run `npm test -- src/lib/email-verification.test.ts`; expect failures because the module is absent.
- [ ] Implement the three functions with `node:crypto`, a `24 * 60 * 60 * 1000` lifetime, and no database dependency.
- [ ] Re-run the focused test; expect PASS.
- [ ] Commit with `feat: add email verification tokens`.

### Task 3: Verification email delivery

**Files:**
- Create: `src/lib/verification-email.test.ts`
- Create: `src/lib/verification-email.ts`
- Modify: `.env.example`

**Interfaces:**
- Consumes: existing SMTP environment variables used by membership activation.
- Produces: `sendVerificationEmail(input: { email: string; name: string; token: string; locale: "ar" | "en" | "fr" }): Promise<void>` and `buildVerificationUrl(token: string, locale: Locale): string`.

- [ ] Write failing tests for URL encoding, locale preservation, the `/api/auth/verify-email` path, and missing public base URL.
- [ ] Run the focused test and confirm the missing module causes RED.
- [ ] Implement URL construction from `NEXT_PUBLIC_SITE_URL` and Nodemailer transport construction following `src/lib/membership-activation.ts`; include localized subject/body and never log the token.
- [ ] Document required SMTP and public URL variable names in `.env.example` without secret values.
- [ ] Re-run the focused test; expect PASS.
- [ ] Commit with `feat: send account verification email`.

### Task 4: Registration endpoint

**Files:**
- Create: `src/app/api/auth/register/route.test.ts`
- Create: `src/app/api/auth/register/route.ts`

**Interfaces:**
- Consumes: token and email functions from Tasks 2–3, Prisma, bcrypt, and existing `rateLimit`/`requestKey`.
- Produces: `POST` accepting `{ name, email, password, passwordConfirmation, locale }`, returning `{ ok: true }` for accepted and existing-email requests.

- [ ] Write failing route tests with injected/mocked boundary dependencies for invalid fields, password mismatch, normalized email, bcrypt hash rather than plaintext, unverified user creation, email dispatch, duplicate-safe response, and rate-limit 429.
- [ ] Run the focused test and verify RED due to the absent route.
- [ ] Implement Zod validation, lowercase/trim normalization, bcrypt cost 12, token persistence, generic duplicate response, and delivery-failure 503 that leaves a resendable unverified account.
- [ ] Re-run the focused tests; expect PASS.
- [ ] Commit with `feat: register membership applicants`.

### Task 5: Verification and resend endpoints

**Files:**
- Create: `src/app/api/auth/verify-email/route.test.ts`
- Create: `src/app/api/auth/verify-email/route.ts`
- Create: `src/app/api/auth/resend-verification/route.test.ts`
- Create: `src/app/api/auth/resend-verification/route.ts`

**Interfaces:**
- Verification consumes `token` and `locale` query parameters, atomically clears token fields, sets `emailVerifiedAt`, sets `acefide_session`, and redirects to `/{locale}/membership`.
- Resend accepts `{ email, locale }` and returns a generic `{ ok: true }` outside rate-limit failures.

- [ ] Write failing verification tests for valid, unknown, expired, and consumed tokens plus session-cookie options and locale redirect.
- [ ] Run verification tests and confirm RED.
- [ ] Implement hash lookup, expiry checking, atomic guarded update, signed session cookie, and safe error redirect query state.
- [ ] Run verification tests and expect PASS.
- [ ] Write failing resend tests for generic unknown/verified email responses, token replacement, email dispatch, and rate limiting.
- [ ] Run resend tests and confirm RED.
- [ ] Implement generic resend behavior with a stricter per-IP/email key and replacement token.
- [ ] Run both focused suites and expect PASS.
- [ ] Commit with `feat: verify applicant email addresses`.

### Task 6: Membership authorization and submission

**Files:**
- Create: `src/lib/membership-access.test.ts`
- Create: `src/lib/membership-access.ts`
- Create or modify: `src/app/api/membership/route.test.ts`
- Modify: `src/app/api/membership/route.ts`

**Interfaces:**
- Produces: `getMembershipViewState(user, request): "REGISTER" | "VERIFY_EMAIL" | "APPLICATION" | "PENDING" | "REJECTED" | "APPROVED"`.
- Submission consumes authenticated user ID/email and creates `MembershipRequest.userId`/`email` from the database, not multipart fields.

- [ ] Write failing pure state tests for anonymous, unverified, verified/no-request, pending, rejected, and approved cases.
- [ ] Implement the exhaustive state mapper and make the focused suite pass.
- [ ] Write failing API tests for anonymous 401, unverified 403, mismatched form email ignored, duplicate request 409, and linked request creation.
- [ ] Run the route tests and confirm RED for missing authorization.
- [ ] Add session/user lookup before parsing or uploading documents, preserve current file validation/cleanup, remove client-controlled email authority, and connect `userId`.
- [ ] Re-run both suites; expect PASS and no orphaned uploads on rejected requests.
- [ ] Commit with `feat: gate membership applications by verified account`.

### Task 7: State-aware membership interface

**Files:**
- Modify: `src/app/[locale]/membership/page.tsx`
- Create: `src/components/membership/RegistrationForm.tsx`
- Create: `src/components/membership/CheckEmailPanel.tsx`
- Create: `src/components/membership/MembershipApplicationForm.tsx`
- Create: `src/components/membership/MembershipStatusPanel.tsx`
- Modify: `src/messages/ar.json`
- Modify: `src/messages/en.json`
- Modify: `src/messages/fr.json`

**Interfaces:**
- Consumes: `getSession`, Prisma user/request state, and `getMembershipViewState`.
- Produces: localized registration, check-email/resend, application, pending, rejected, and approved-dashboard-placeholder screens.

- [ ] Add component tests for registration submission/check-email transition, resend feedback, read-only authoritative email, pending copy, rejected copy, and approved placeholder.
- [ ] Run UI tests and confirm RED because components do not exist.
- [ ] Extract the current large form into `MembershipApplicationForm` without changing its fields or file validation UI.
- [ ] Implement the other focused panels and a server page that selects exactly one state; use Arabic RTL and localized strings in all three message files.
- [ ] Re-run UI tests and expect PASS.
- [ ] Run `npm run typecheck` and fix only errors introduced by this task.
- [ ] Commit with `feat: add verified membership registration flow`.

### Task 8: Login and admin approval integration

**Files:**
- Modify or create: `src/app/api/auth/login/route.test.ts`
- Modify: `src/app/api/auth/login/route.ts`
- Create or modify: `src/app/[locale]/admin/actions.test.ts`
- Modify: `src/app/[locale]/admin/actions.ts`

**Interfaces:**
- Login returns `{ ok: true, role, destination }`, where verified applicants go to the membership status route.
- Approval updates the existing request and linked user; it never calls `user.create` or sends the legacy activation email.

- [ ] Write failing login tests proving unverified users receive a verification-required response and verified `USER` accounts receive the localized membership destination.
- [ ] Implement the minimal login branching and make the focused tests pass.
- [ ] Write a failing admin-action test proving approval updates the linked application and does not create a user or replace a password.
- [ ] Remove the approval-time account creation/activation-mail branch while preserving approval timestamps, notes, and existing admin feedback.
- [ ] Run both focused suites and expect PASS.
- [ ] Commit with `refactor: approve existing applicant accounts`.

### Task 9: Final verification and documentation

**Files:**
- Modify: `README.md`

**Interfaces:**
- Documents local SMTP/public URL setup, migration, and the end-to-end account state flow.

- [ ] Add concise setup instructions and a manual smoke-test sequence: register, inspect mail, verify, submit, view pending state, approve, view dashboard placeholder.
- [ ] Run `npm test`; expect all suites PASS with no unhandled errors.
- [ ] Run `npx prisma validate`, `npx prisma generate`, `npm run typecheck`, and `npm run lint`; expect exit 0.
- [ ] Run `npm run build` when the configured database is available; distinguish infrastructure failures from application failures.
- [ ] Inspect `git diff --check` and `git status --short`, confirming unrelated pre-existing edits were not staged.
- [ ] Commit only documentation or final focused fixes with `docs: document verified registration flow`.
