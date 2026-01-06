import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import uriLogo from "@/assets/uri-logo.png";

export const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center">
              <img src={uriLogo} alt="Uri Academy" className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="text-background/60 text-sm mt-2">
              The Human Edge in the Age of AI.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <Link to="/about" className="text-background/60 hover:text-background transition-colors text-sm">
              About
            </Link>
            <Link to="/what-is-uri" className="text-background/60 hover:text-background transition-colors text-sm">
              What is Uri?
            </Link>
            <Link to="/learn-more" className="text-background/60 hover:text-background transition-colors text-sm">
              Learn More
            </Link>
            <Link to="/for-businesses" className="text-background/60 hover:text-background transition-colors text-sm">
              For Businesses
            </Link>
            <Link to="/graduates" className="text-background/60 hover:text-background transition-colors text-sm">
              Graduates
            </Link>
            <Link to="/privacy" className="text-background/60 hover:text-background transition-colors text-sm">
              Privacy
            </Link>
            <Link to="/terms" className="text-background/60 hover:text-background transition-colors text-sm">
              Terms
            </Link>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 pt-8 border-t border-background/10 text-center text-background/40 text-sm"
        >
          © {new Date().getFullYear()} Uri Academy. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
};