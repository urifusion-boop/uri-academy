import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { TrustBar } from '@/components/TrustBar';
import { ProcessSection } from '@/components/ProcessSection';
import { RoadmapSection } from '@/components/RoadmapSection';
import { CurriculumSection } from '@/components/CurriculumSection';
import { GraduatesRosterSection } from '@/components/GraduatesRosterSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { PricingSection } from '@/components/PricingSection';
import { CTASection } from '@/components/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />
      <main className="flex-grow pt-20">
        <HeroSection />
        <TrustBar />
        <ProcessSection />
        <RoadmapSection />
        <CurriculumSection />
        <GraduatesRosterSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
