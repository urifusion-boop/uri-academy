import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    quote: "Within days after our kick off call, Uri promptly provided us with candidates based on our ideal SDR profile. We initially had head count for 1 however were so impressed with 2 candidates Uri had supplied, we ended up hiring both.",
  },
  {
    quote: "Wouldn't be where I am today without Uri. They opened the door for me to start at an incredible company and gave me a lot of training and mentorship as I transitioned into the role.",
  },
  {
    quote: "Uri helped me get my foot in the door after graduating from college. Their program taught me the fundamentals of being a successful SDR and how to go beyond. I am truly grateful for all the support they offered.",
  },
];

export const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-foreground/5 rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground tracking-tight leading-tight italic">
            We're here to ensure
            <br />
            you're successful
          </h2>
          
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Uri's training platform and sales coaches are here to provide you as much 1:1 personalized training as you need during the first 3 months of your career.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-background rounded-xl p-6 lg:p-8"
            >
              <p className="text-foreground/80 leading-relaxed text-sm lg:text-base">
                {testimonial.quote}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
