# Membership Documents and Wilayas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Require all six membership documents and expose all 69 Algerian wilayas without changing the existing inscription design or workflow.

**Architecture:** Move the wilaya data and required-upload metadata into focused library modules. The client form renders the new options and inputs, while the API validates every file before uploading it to the existing private Blob store and persists the receipt in the existing Prisma field. Existing applicant/admin document views gain receipt links.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest, Prisma, Vercel Blob.

## Global Constraints

- Preserve the current form layout, styling, authentication, verification, submission, approval, and dashboard behavior.
- One personal-photo file is required.
- No Prisma migration; use the existing `duesReceiptUrl` field.
- The stricter upload rules apply only to new submissions.

---

### Task 1: Canonical 69-wilaya list

**Files:**
- Create: `src/lib/algeria-wilayas.ts`
- Create: `src/lib/algeria-wilayas.test.ts`
- Modify: `src/app/[locale]/membership/page.tsx`

**Interfaces:**
- Produces: `ALGERIA_WILAYAS: readonly string[]`, ordered from wilaya 1 through 69 and using Arabic display names.

- [ ] Write a failing test asserting exactly 69 unique entries and the official new wilayas at positions 59–69.
- [ ] Run `npm test -- src/lib/algeria-wilayas.test.ts` and confirm failure because the module does not exist.
- [ ] Add the 58 existing wilayas followed by آفلو، بريكة، القنطرة، بئر العاتر، العريشة، قصر الشلالة، عين وسارة، مسعد، قصر البخاري، بوسعادة، الأبيض سيدي الشيخ.
- [ ] Import the constant into the membership page and remove only its inline list.
- [ ] Run the targeted test and confirm it passes.

### Task 2: Required document validation and persistence

**Files:**
- Create: `src/lib/membership-files.ts`
- Create: `src/lib/membership-files.test.ts`
- Modify: `src/app/api/membership/route.ts`
- Modify: `src/app/[locale]/membership/page.tsx`

**Interfaces:**
- Produces: `REQUIRED_MEMBERSHIP_FILES`, metadata for `identityDocument`, `personalPhoto`, `cv`, `diploma`, `criminalRecord`, and `duesReceipt`.
- Produces: `readRequiredMembershipFiles(formData: FormData)`, returning either all six non-empty `File` objects or the missing field names.

- [ ] Write failing tests for accepting six non-empty files and rejecting each absent or empty file.
- [ ] Run `npm test -- src/lib/membership-files.test.ts` and confirm failure because the module does not exist.
- [ ] Implement the minimal metadata and parser.
- [ ] Render six required upload controls in the existing section, retaining the existing file-input styling.
- [ ] Validate the six files in the API before any upload occurs; return HTTP 400 with field errors when missing.
- [ ] Upload each file through the existing `saveFile` function and persist all six URLs, including `duesReceiptUrl`.
- [ ] Run the targeted test and confirm it passes.

### Task 3: Receipt access in applicant and admin views

**Files:**
- Modify: `src/lib/membership-document-download.ts`
- Modify: `src/app/[locale]/membership/dashboard/page.tsx`
- Modify: `src/app/[locale]/admin/members/page.tsx`

**Interfaces:**
- Extends `MembershipDocumentKey` with `dues-receipt`, mapped to `duesReceiptUrl`.

- [ ] Add a failing assertion to the membership-files test for the complete downloadable document-key set.
- [ ] Add `dues-receipt` to authorization-safe document streaming and database selection.
- [ ] Add the receipt link to the applicant dashboard.
- [ ] Add the receipt link to the administrator membership review card.
- [ ] Run the targeted tests and confirm they pass.

### Task 4: Full verification

**Files:**
- Verify all modified files.

- [ ] Run `npm test` and require zero failures.
- [ ] Run `npm run typecheck` and require exit code 0.
- [ ] Run `npm run lint` and require exit code 0.
- [ ] Run `npm run build` and require exit code 0.
- [ ] Inspect `git diff --check` and the final scoped diff before handoff.
