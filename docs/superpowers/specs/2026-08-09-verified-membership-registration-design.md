# Verified Membership Registration Design

## Goal

Require applicants to create an account and verify ownership of their email address before they can complete the membership application or upload documents. After submission, applicants can sign in to see that their application is under review. Approval unlocks a placeholder member dashboard that can be expanded later.

## User flow

1. The public Inscription link opens the membership registration page.
2. A new applicant enters their name, email address, password, and password confirmation.
3. The server normalizes the email, validates the password, hashes it, creates an unverified `USER` account, and sends a single-use verification link.
4. The page tells the applicant to check their inbox and offers a rate-limited resend action.
5. The verification link expires after 24 hours. Following a valid link marks the email as verified, consumes the token, creates a session, and redirects to the membership application.
6. Only a signed-in, email-verified user without an existing application can submit the membership form and upload its documents. The account email is authoritative and cannot be replaced by a form field.
7. Submission creates a `MembershipRequest` linked to that user and redirects to the membership status page.
8. A pending applicant sees a localized message explaining that the administration is reviewing the application.
9. Existing administration controls approve or reject the linked request. Approval no longer creates another user account or sends a password-activation link.
10. An approved user sees a minimal dashboard placeholder. A rejected user sees a clear status message without dashboard access.

## Architecture and data model

The existing custom session system, Prisma/PostgreSQL database, Nodemailer infrastructure, and membership review interface will be extended rather than replaced with a new authentication framework.

`User` gains:

- `emailVerifiedAt DateTime?`
- `emailVerificationTokenHash String? @unique`
- `emailVerificationExpiresAt DateTime?`

Email-verification tokens are cryptographically random. Only their SHA-256 hashes are stored. Verifying or replacing a token clears the previous token state, making links single-use.

`MembershipRequest.userId` remains the ownership link and its existing status remains the source of truth for review and dashboard access. Account activation and application approval are distinct states: email verification proves mailbox ownership; membership status controls member access.

## Pages and endpoints

- The membership page becomes a state-aware experience: account signup, check-email notice, verified application form, review status, or approved dashboard placeholder.
- `POST /api/auth/register` validates input, prevents account enumeration in its public response, creates the account, and sends verification mail.
- `GET /api/auth/verify-email` consumes a valid token, establishes a session, and redirects to the localized membership page.
- `POST /api/auth/resend-verification` issues a replacement link with generic responses and strict rate limiting.
- `POST /api/membership` requires a valid session and verified email, derives the user and email from the session/database, and rejects duplicate applications.
- Login permits verified applicants to access their application status. Unverified users are directed to verification rather than admitted to the application.

## Email delivery

The verification email uses the existing SMTP/Nodemailer configuration pattern. It contains the applicant's name, a 24-hour verification link, and a short note to ignore the message if they did not register. The application logs delivery failures without exposing SMTP details to users.

## Security and error handling

- Passwords are hashed with bcrypt using the existing cost setting and must be 8–128 characters.
- Registration, login, verification, and resend endpoints are rate-limited.
- Duplicate-email and resend responses are generic to reduce account enumeration.
- Membership submission authorization is enforced on the server; hiding the form is not treated as protection.
- Uploaded documents retain the existing validation and private-download protections.
- Invalid, expired, or consumed links show a localized recovery message with a resend path.
- A mail-delivery failure leaves the account unverified and lets the applicant retry sending the message.

## Administration changes

The existing members administration view continues to list submitted applications. Approval changes only the request status and any approval metadata. It must not create a new `User`, overwrite the applicant's password, or issue the old account-activation token. Existing already-approved accounts remain compatible.

## Testing

Implementation follows test-driven development. Automated tests will cover:

- Registration validation, password hashing, normalized email storage, duplicate-safe responses, and verification-mail dispatch.
- Valid, expired, invalid, replaced, and already-consumed verification tokens.
- Session creation and redirect after successful verification.
- Resend rate limiting and token replacement.
- Rejection of anonymous or unverified membership submissions.
- Ownership linkage, authoritative account email, and duplicate-application rejection.
- Pending, rejected, and approved state routing.
- Admin approval updating the existing applicant rather than creating another account.

The final verification run includes focused tests, the full test suite, type checking, linting, Prisma validation/generation, and a production build when the configured database permits it.

## Out of scope

- The final member-dashboard features and content.
- Password reset and change-email workflows.
- Social login or multi-factor authentication.
- Changes to membership-review policy or required documents.
