import { HeroSection } from "@/components/hero/HeroSection";
import { TracksSection } from "@/components/tracks/TracksSection";
import MonthTimeline from "@/components/month/MonthTimeline";
import RunwaySection from "@/components/runway/RunwaySection";
import KobeSection from "@/components/kobe/KobeSection";
import RosterSection from "@/components/roster/RosterSection";
import { ApplySection } from "@/components/apply/ApplySection";
import { ScrollCompanion } from "@/components/apply/ScrollCompanion";
import { Navbar } from "@/components/ui/Navbar";

export default function Home() {
  return (
    <main className="w-full">
      <Navbar />
      <HeroSection />
      <TracksSection />
      <MonthTimeline />
      <RunwaySection />
      <KobeSection />
      <RosterSection />
      <ApplySection />
      <ScrollCompanion />
    </main>
  );
}
