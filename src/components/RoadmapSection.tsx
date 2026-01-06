import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Download, Flame, Award } from "lucide-react";

const phases = [
  {
    icon: Download,
    period: "Weeks 1-3",
    title: "The Download",
    items: [
      "Deep dive into Cold Email Copywriting",
      "Cultural Nuance (Western Markets)",
      "CRM Management & Data Hygiene",
      "Sales Psychology Fundamentals",
    ],
  },
  {
    icon: Flame,
    period: "Weeks 4-5",
    title: "Live Fire",
    items: [
      "You are assigned a quota",
      "You use Uri to hunt leads",
      "You book real meetings",
      "Earn your first commissions",
    ],
  },
  {
    icon: Award,
    period: "Week 6+",
    title: "Placement",
    items: [
      "Interview preparation",
      "Portfolio review & polish",
      "Intro to hiring partners",
      "Career coaching & support",
    ],
  },
];

export const RoadmapSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="roadmap" ref={ref} className="py-20 md:py-28 bg-secondary/20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            The <span className="text-gradient">Roadmap</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Your journey from beginner to placement-ready in just 6 weeks.
          </p>
        </motion.div>
        
        {/* Desktop Timeline */}
        <div className="hidden md:block relative">
          {/* Timeline Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="absolute top-6 left-0 right-0 h-0.5 bg-primary origin-left"
          />
          
          <div className="grid md:grid-cols-3 gap-8">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + 0.15 * index }}
                className="relative pt-16"
              >
                {/* Timeline Dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + 0.15 * index }}
                  className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-background shadow-glow"
                />
                
                <div className="bg-card rounded-2xl border border-border p-6 h-full card-hover">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <phase.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-primary">{phase.period}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4">{phase.title}</h3>
                  
                  <ul className="space-y-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Mobile Vertical Stepper */}
        <div className="md:hidden relative pl-8">
          {/* Vertical Line */}
          <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-border" />
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="absolute top-0 bottom-0 left-3 w-0.5 bg-primary origin-top"
          />
          
          <div className="space-y-8">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + 0.15 * index }}
                className="relative"
              >
                {/* Timeline Dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + 0.15 * index }}
                  className="absolute -left-8 top-4 w-6 h-6 rounded-full bg-primary border-4 border-background shadow-glow"
                />
                
                <div className="bg-card rounded-2xl border border-border p-6 card-hover">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <phase.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-primary">{phase.period}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4">{phase.title}</h3>
                  
                  <ul className="space-y-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
