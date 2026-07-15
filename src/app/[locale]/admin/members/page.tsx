import { ExternalLink, Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function MembersPage() {
  const items = await prisma.membershipRequest.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div>
      <div className="mb-6"><p className="text-sm font-bold text-primary">ACEFIDE</p><h1 className="mt-1 text-2xl font-bold">Membership applications</h1></div>
      <div className="space-y-6">
        {items.map((item) => {
          const details: Array<[string, string | null | undefined]> = [
            ["Date of birth", item.dateOfBirth?.toLocaleDateString()], ["Place of birth", item.placeOfBirth],
            ["National ID", item.nationalId], ["Address", item.address], ["Wilaya", item.wilaya],
            ["Education level", item.educationLevel], ["Employment status", item.employmentStatus],
            ["Profession / position", item.position], ["Organization", item.organization],
            ["Membership category", item.membershipCategory],
            ["Previous association", item.previousAssociation === null ? null : item.previousAssociation ? "Yes" : "No"],
          ];
          const documents: Array<[string, string | null]> = [
            ["Identity document", item.identityDocumentUrl], ["Personal photo", item.personalPhotoUrl], ["CV", item.cvUrl],
            ["Diploma / qualification", item.diplomaUrl], ["Criminal record", item.criminalRecordUrl], ["Dues receipt", item.duesReceiptUrl],
          ];
          return (
            <article key={item.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <header className="flex flex-wrap items-start justify-between gap-4 border-b bg-[#f8faf7] p-5">
                <div><h2 className="text-xl font-bold text-[#0b1f33]">{item.name}</h2><p className="mt-1 text-xs text-muted-foreground">Submitted {item.createdAt.toLocaleString()}</p></div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{item.status}</span>
              </header>
              <div className="grid gap-7 p-5 xl:grid-cols-[1fr_1fr]">
                <section>
                  <h3 className="mb-4 border-b pb-2 font-bold text-[#0b1f33]">Applicant information</h3>
                  <div className="grid gap-4 text-sm sm:grid-cols-2">
                    <Info label="Email"><a href={`mailto:${item.email}`} className="inline-flex items-center gap-2 text-primary hover:underline"><Mail className="h-4 w-4" />{item.email}</a></Info>
                    <Info label="Phone">{item.phone ? <a href={`tel:${item.phone}`} className="inline-flex items-center gap-2 text-primary hover:underline"><Phone className="h-4 w-4" />{item.phone}</a> : "—"}</Info>
                    {details.map(([label, value]) => <Info key={label} label={label}>{value || "—"}</Info>)}
                    <Info label="Interests">{item.interests.length ? item.interests.join("، ") : "—"}</Info>
                  </div>
                  <LongInfo label="Previous association details" value={item.previousAssociationDetails} />
                  <LongInfo label="Social media links" value={item.socialLinks} />
                  <LongInfo label="Reason for joining" value={item.reason} />
                </section>
                <section>
                  <h3 className="mb-4 border-b pb-2 font-bold text-[#0b1f33]">Application documents</h3>
                  <div className="grid gap-3 sm:grid-cols-2">{documents.map(([label, url]) => url ? <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg border p-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/[0.03]"><span>{label}</span><ExternalLink className="h-4 w-4" /></a> : <div key={label} className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">{label}: missing</div>)}</div>
                  <p className="mt-5 rounded-lg bg-primary/[0.04] p-4 text-sm"><strong>Declaration:</strong> {item.declarationAccepted ? "Accepted" : "Not accepted"}</p>
                  {item.notes && <LongInfo label="Admin notes" value={item.notes} />}
                </section>
              </div>
            </article>
          );
        })}
      </div>
      {!items.length && <p className="rounded-xl border bg-white p-10 text-center text-muted-foreground">No membership applications yet.</p>}
    </div>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p><div className="mt-1 break-words text-[#0b1f33]">{children}</div></div>;
}
function LongInfo({ label, value }: { label: string; value?: string | null }) {
  return <div className="mt-5"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#0b1f33]">{value || "—"}</p></div>;
}
