import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import graduate1 from "@/assets/graduate-1.jpg";
import graduate2 from "@/assets/graduate-2.jpg";
import graduate3 from "@/assets/graduate-3.jpg";
import graduate4 from "@/assets/graduate-4.jpg";

interface HeroSectionProps {
  onApplyClick: () => void;
}

const graduateSets = [
  [
    { src: graduate1, alt: "Uri Academy Graduate - Sales Professional" },
    { src: graduate2, alt: "Uri Academy Graduate - SDR" },
  ],
  [
    { src: graduate3, alt: "Uri Academy Graduate - Account Executive" },
    { src: graduate4, alt: "Uri Academy Graduate - Tech Sales" },
  ],
];

export const HeroSection = ({ onApplyClick }: HeroSectionProps) => {
  const [activeSet, setActiveSet] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSet((prev) => (prev === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentGraduates = graduateSets[activeSet];

  return (
    <section className="relative min-h-screen flex items-center bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 lg:pr-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 items-center min-h-screen">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-left max-w-xl pt-24 lg:pt-0"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight"
            >
              <span className="text-primary">Launch your</span>
              <br />
              <span className="text-primary">career in</span>{" "}
              <span className="text-foreground">tech sales</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-8 text-xl md:text-2xl font-bold text-foreground"
            >
              We find you a job, train you, AND pay you.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              The world has enough junior coders. It's starving for people who can actually sell the product. Join the Uri Residency to master modern B2B sales, build a portfolio of closed deals, and unlock remote roles in the African, US & UK market.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-10"
            >
              <Button variant="hero" size="xl" onClick={onApplyClick}>
                Apply Today
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Right Side - Photo Grid - Mobile */}
          <div className="grid grid-cols-2 gap-1 lg:hidden pb-8">
            <AnimatePresence mode="wait">
              {currentGraduates.map((graduate, index) => (
                <motion.div
                  key={`${activeSet}-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="aspect-[4/5] overflow-hidden rounded-lg"
                >
                  <img
                    src={graduate.src}
                    alt={graduate.alt}
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Right Side - Photo Grid - Desktop (Absolute positioned) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
        className="hidden lg:block absolute right-0 top-0 bottom-0 w-[48%]"
      >
        <div className="grid grid-cols-2 h-full">
          <AnimatePresence mode="wait">
            {currentGraduates.map((graduate, index) => (
              <motion.div
                key={`desktop-${activeSet}-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="overflow-hidden"
              >
                <img
                  src={graduate.src}
                  alt={graduate.alt}
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};
