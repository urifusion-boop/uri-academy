import { HeroSection } from '@/components/HeroSection';
import { TrustBar } from '@/components/TrustBar';
import { ProcessSection } from '@/components/ProcessSection';
import { RoadmapSection } from '@/components/RoadmapSection';
import { CurriculumSection } from '@/components/CurriculumSection';
import { GraduatesRosterSection } from '@/components/GraduatesRosterSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { PricingSection } from '@/components/PricingSection';
import { CTASection } from '@/components/CTASection';

export function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navbar is handled by PublicLayout */}
      <HeroSection />
      <TrustBar />
      <ProcessSection />
      <RoadmapSection />
      <CurriculumSection />
      <GraduatesRosterSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      {/* Footer is handled by PublicLayout */}
    </main>
  );
}
