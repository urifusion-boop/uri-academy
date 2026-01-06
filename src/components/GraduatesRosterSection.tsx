import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import graduate1 from "@/assets/graduate-1.jpg";
import graduate2 from "@/assets/graduate-2.jpg";
import graduate3 from "@/assets/graduate-3.jpg";
import graduate4 from "@/assets/graduate-4.jpg";

const graduates = [
  { src: graduate1, name: "Sarah Johnson", role: "SDR at Salesforce" },
  { src: graduate2, name: "Michael Chen", role: "AE at HubSpot" },
  { src: graduate3, name: "Amara Okafor", role: "BDR at Stripe" },
  { src: graduate4, name: "David Kim", role: "SDR at Notion" },
  { src: graduate1, name: "Emma Williams", role: "AE at Slack" },
  { src: graduate2, name: "James Adeyemi", role: "SDR at Figma" },
];

export const GraduatesRosterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white text-sm font-bold">U</span>
              </div>
              <span className="text-white/90 font-medium">Uri Graduates</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-8">
              Check out our current roster of graduates
            </h2>
            
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 border-white font-semibold group"
            >
              <Link to="/graduates">
                Browse Graduates
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
          
          {/* Right Side - Hexagonal Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-3 gap-4 max-w-md ml-auto">
              {/* Row 1 */}
              <div className="col-start-2">
                <HexagonImage src={graduates[0].src} alt={graduates[0].name} delay={0.3} isInView={isInView} />
              </div>
              <div className="col-start-3">
                <HexagonImage src={graduates[1].src} alt={graduates[1].name} delay={0.4} isInView={isInView} />
              </div>
              
              {/* Row 2 */}
              <div className="col-start-1">
                <HexagonImage src={graduates[2].src} alt={graduates[2].name} delay={0.5} isInView={isInView} />
              </div>
              <div className="col-start-2">
                <HexagonImage src={graduates[3].src} alt={graduates[3].name} delay={0.6} isInView={isInView} />
              </div>
              <div className="col-start-3">
                <HexagonImage src={graduates[4].src} alt={graduates[4].name} delay={0.7} isInView={isInView} />
              </div>
              
              {/* Row 3 */}
              <div className="col-start-2">
                <HexagonImage src={graduates[5].src} alt={graduates[5].name} delay={0.8} isInView={isInView} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

interface HexagonImageProps {
  src: string;
  alt: string;
  delay: number;
  isInView: boolean;
}

const HexagonImage = ({ src, alt, delay, isInView }: HexagonImageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="relative aspect-square"
    >
      <div 
        className="w-full h-full overflow-hidden border-4 border-white/20 shadow-lg"
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
      </div>
    </motion.div>
  );
};
