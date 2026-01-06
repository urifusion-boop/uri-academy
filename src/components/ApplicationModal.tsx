import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationModal = ({ isOpen, onClose }: ApplicationModalProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
      setName("");
      setExperience("");
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-background rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Apply for Residency</h2>
                <p className="text-sm text-muted-foreground mt-1">Join Cohort 1 • Limited spots</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Application Received!</h3>
                  <p className="text-muted-foreground">
                    We'll review your application and get back to you within 48 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium mb-2">
                      Tell us about your sales experience (if any)
                    </label>
                    <textarea
                      id="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                      placeholder="Share your background, goals, and why you're interested in tech sales..."
                    />
                  </div>
                  
                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    Submit Application
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    By applying, you agree to our terms and conditions.
                    We'll never share your information.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
