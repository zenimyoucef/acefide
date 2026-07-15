import { LeadershipPreview } from "@/components/structure/LeadershipPreview";
import { getLeadershipMembers } from "@/lib/leadership-data";

export async function LeadershipSection() {
  const members = await getLeadershipMembers();
  return (
    <section className="overflow-hidden border-t border-primary/10 bg-[#f3fbf6] py-16 md:py-20">
      <LeadershipPreview fullBleed members={members} />
    </section>
  );
}
