import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const logos = [
  { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
  { name: "HubSpot", logo: "https://www.vectorlogo.zone/logos/hubspot/hubspot-icon.svg" },
  { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { name: "Notion", logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" },
  { name: "Slack", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" },
  { name: "Zoom", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg" },
  { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
  { name: "Linear", logo: "https://asset.brandfetch.io/iduDa181eM/idYasGjTjU.png" },
];

export const TrustBar = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-xs md:text-sm font-medium tracking-widest text-muted-foreground uppercase mb-10"
        >
          Graduates prepared for roles at
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16"
        >
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 0.6, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              className="grayscale hover:grayscale-0 transition-all duration-300 cursor-default"
            >
              <img
                src={logo.logo}
                alt={logo.name}
                className="h-6 md:h-8 w-auto object-contain"
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
