import { HeroSection } from "@/components/home/HeroSection";
import { PresidentSection } from "@/components/home/PresidentSection";
import { ImpactSection } from "@/components/home/ImpactSection";
import { MissionSection } from "@/components/home/MissionSection";
import { LatestNews } from "@/components/home/LatestNews";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { PartnersSection } from "@/components/home/PartnersSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PresidentSection />
      <ImpactSection />
      <MissionSection />
      <LatestNews />
      <UpcomingEvents />
      <PartnersSection />
      <NewsletterSection />
    </>
  );
}
