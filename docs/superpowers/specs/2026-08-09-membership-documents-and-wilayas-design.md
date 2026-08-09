# Membership Documents and Wilayas Design

## Scope

Preserve the existing inscription form, styling, account verification, submission flow, approval flow, and dashboard behavior. Change only the required document uploads and the wilaya selector.

## Required uploads

The inscription form must require one file for each of the following:

1. Identity card or passport copy
2. Personal photo
3. CV
4. Academic or professional qualification certificate
5. Valid criminal record
6. Membership dues payment receipt

The browser must mark all six inputs as required. The membership API must independently reject submissions when any required file is absent or empty. Accepted files continue using the current upload restrictions and private Vercel Blob storage. The receipt must be saved in the existing `duesReceiptUrl` database field and made available through the existing applicant and administrator document views.

## Wilayas

Replace the current selector options with the complete current list of 69 Algerian wilayas. Keep the current single-select interface and Arabic labels.

## Compatibility

No database migration is needed because the six document URL fields already exist. Existing membership records may continue to have missing documents; the stricter requirements apply to new submissions only.

## Verification

Add automated tests for the 69-wilaya list and required document validation. Run the full test suite, TypeScript checking, linting, and a production build.
