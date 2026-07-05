import { HeroSection } from "@/components/hero/HeroSection";
import { TracksSection } from "@/components/tracks/TracksSection";
import MonthTimeline from "@/components/month/MonthTimeline";
import RunwaySection from "@/components/runway/RunwaySection";
import KobeSection from "@/components/kobe/KobeSection";
import PracticalSection from "@/components/practical/PracticalSection";
import RosterSection from "@/components/roster/RosterSection";
import CommunitiesSection from "@/components/proof/CommunitiesSection";
import PastEventsSection from "@/components/proof/PastEventsSection";
import { ApplySection } from "@/components/apply/ApplySection";
import { FaqSection } from "@/components/apply/FaqSection";
import { PostCredits } from "@/components/apply/PostCredits";
import { ScrollCompanion } from "@/components/apply/ScrollCompanion";
import { Navbar } from "@/components/ui/Navbar";
import { QuickActions } from "@/components/ui/QuickActions";

export default function Home() {
  return (
    <main className="w-full">
      <Navbar />
      <HeroSection />
      <TracksSection />
      <MonthTimeline />
      <RunwaySection />
      <KobeSection />
      <PracticalSection />
      <RosterSection />
      <CommunitiesSection />
      <PastEventsSection />
      <ApplySection />
      <QuickActions source="home" />
      <FaqSection />
      <PostCredits />
      <ScrollCompanion />
    </main>
  );
}
