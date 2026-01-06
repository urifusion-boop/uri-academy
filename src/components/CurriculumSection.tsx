import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Laptop, Globe, Zap } from "lucide-react";

const curriculumItems = [
  {
    icon: Laptop,
    title: "Tech-Stack Fluency",
    description: "Mastery of Uri, HubSpot, and LinkedIn Sales Nav. You'll leave knowing the tools that top SDRs use daily.",
    highlights: ["Uri Platform", "HubSpot CRM", "LinkedIn Sales Navigator", "Outreach.io"],
  },
  {
    icon: Globe,
    title: "Cultural Camouflage",
    description: "How to communicate with US/UK prospects without the \"outsider\" friction. Master tone, timing, and context.",
    highlights: ["Western Communication Styles", "Time Zone Management", "Cultural Nuances", "Email Etiquette"],
  },
  {
    icon: Zap,
    title: "Real-World Practice",
    description: "No simulations. You will prospect real companies and launch full outbound campaigns that generate revenue.",
    highlights: ["Live Lead Generation", "Real Quota Targets", "Commission Earnings", "Portfolio Building"],
  },
];

export const CurriculumSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="curriculum" ref={ref} className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            What You'll <span className="text-gradient">Learn</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A curriculum designed by operators who have hired and trained hundreds of SDRs.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {curriculumItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group"
            >
              <div className="bg-card rounded-2xl border border-border p-8 h-full card-hover">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors duration-300">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {item.description}
                </p>
                
                {/* Highlights */}
                <div className="flex flex-wrap gap-2">
                  {item.highlights.map((highlight, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium px-3 py-1.5 rounded-full bg-accent text-accent-foreground"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
