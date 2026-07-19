import { z } from "zod";

const optionalText = z.string().trim().max(500).optional().or(z.literal(""));
const email = z.string().trim().email().max(254);
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120), email, phone: optionalText, organization: optionalText,
  subject: z.string().trim().min(3).max(180), message: z.string().trim().min(10).max(5000),
});
export const membershipSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email,
  phone: z.string().trim().min(6).max(40),
  dateOfBirth: z.string().date(),
  placeOfBirth: z.string().trim().min(2).max(120),
  nationalId: z.string().trim().min(5).max(40),
  address: z.string().trim().min(5).max(500),
  wilaya: z.string().trim().min(2).max(80),
  educationLevel: z.string().trim().min(2).max(100),
  employmentStatus: z.string().trim().min(2).max(100),
  organization: z.string().trim().min(2).max(500),
  position: z.string().trim().min(2).max(200),
  membershipCategory: z.string().trim().min(2).max(200),
  interests: z.array(z.string().trim().min(2).max(120)).min(1).max(20),
  previousAssociation: z.boolean(),
  previousAssociationDetails: z.string().trim().max(1000).optional().or(z.literal("")),
  socialLinks: z.string().trim().max(1000).optional().or(z.literal("")),
  reason: z.string().trim().min(20).max(3000),
  declarationAccepted: z.literal(true),
});
export const eventRegistrationSchema = z.object({
  eventId: z.string().trim().min(1), name: z.string().trim().min(2).max(120), email,
  phone: optionalText, organization: optionalText, notes: optionalText,
});
export function validationError(error: z.ZodError) {
  return { error: "Invalid submission", fields: error.flatten().fieldErrors };
}
