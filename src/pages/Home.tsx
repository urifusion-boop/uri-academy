import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TrustBar } from "@/components/TrustBar";
import { ProcessSection } from "@/components/ProcessSection";
import { RoadmapSection } from "@/components/RoadmapSection";
import { CurriculumSection } from "@/components/CurriculumSection";
import { GraduatesRosterSection } from "@/components/GraduatesRosterSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { ApplicationModal } from "@/components/ApplicationModal";

export function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyClick = () => {
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar onApplyClick={handleApplyClick} />
      <HeroSection onApplyClick={handleApplyClick} />
      <TrustBar />
      <ProcessSection />
      <RoadmapSection />
      <CurriculumSection />
      <GraduatesRosterSection />
      <TestimonialsSection />
      <CTASection onApplyClick={handleApplyClick} />
      <Footer />
      <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
