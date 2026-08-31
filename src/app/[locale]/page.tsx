import { HeroSection } from "@/components/home/HeroSection";
import { PresidentSection } from "@/components/home/PresidentSection";
import { LeadershipSection } from "@/components/home/LeadershipSection";
import { ImpactSection } from "@/components/home/ImpactSection";
import { MissionSection } from "@/components/home/MissionSection";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { PartnersSection } from "@/components/home/PartnersSection";

import { LatestNews } from "@/components/home/LatestNews";
import { AboutCenterSection } from "@/components/home/AboutCenterSection";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <>
      <HeroSection />
      <LatestNews locale="ar" />
      <AboutCenterSection locale="ar" />
      <PresidentSection />
      <LeadershipSection />
      <ImpactSection />
      <MissionSection />
      <UpcomingEvents locale={locale as "ar" | "fr" | "en"} />
      <PartnersSection />
    </>
  );
}
