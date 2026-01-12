import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto -translate-y-20 md:-translate-y-24"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight"
          >
            <span className="text-primary">Launch your</span>
            <br />
            <span className="text-primary">career in</span>{' '}
            <span className="text-foreground">tech sales</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 text-xl md:text-2xl font-bold text-foreground"
          >
            We train you, give you experience and place you
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            The world has enough junior coders. It's starving for people who can
            actually sell the product. Join the Uri Residency to master modern
            B2B sales, build a portfolio of closed deals, and unlock remote
            roles in the African, US & UK market.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10"
          >
            <Link to="/register">
              <Button variant="hero" size="xl">
                Apply Today
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
