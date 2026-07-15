import { HeroSection } from "@/components/home/HeroSection";
import { PresidentSection } from "@/components/home/PresidentSection";
import { LeadershipSection } from "@/components/home/LeadershipSection";
import { ImpactSection } from "@/components/home/ImpactSection";
import { MissionSection } from "@/components/home/MissionSection";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { PartnersSection } from "@/components/home/PartnersSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { AboutFocusSection } from "@/components/home/AboutFocusSection";
import { LatestNews } from "@/components/home/LatestNews";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <>
      <HeroSection />
      <PresidentSection />
      <LeadershipSection />
      <ImpactSection />
      <AboutFocusSection />
      <MissionSection />
      <UpcomingEvents />
      <LatestNews locale={locale as "ar" | "fr" | "en"} />
      <PartnersSection locale={locale as "ar" | "fr" | "en"} />
      <NewsletterSection />
    </>
  );
}
