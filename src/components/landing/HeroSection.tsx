import { motion } from "framer-motion";
import { ArrowRight, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBrain from "@/assets/hero-brain.png";

interface HeroSectionProps {
  onStartTest: () => void;
}

const HeroSection = ({ onStartTest }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 text-sm"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">AI-Powered Adaptive Learning</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Don't Just Take Tests.{" "}
              <span className="gradient-text">Understand Your Mind.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              AI-powered platform that tracks mistakes, analyzes behavior, and
              builds smarter learners. Where every mistake becomes your strength.
            </p>

            {/* Animated journey */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 flex-wrap"
            >
              {["Test", "AI Analysis", "Weakness Detection", "Growth"].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="glass-card px-3 py-1.5 text-sm font-medium">
                    {step}
                  </span>
                  {i < 3 && <ArrowRight className="w-4 h-4 text-primary" />}
                </div>
              ))}
            </motion.div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                onClick={onStartTest}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg glow"
              >
                <Brain className="w-5 h-5 mr-2" />
                Start Smart Test
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-glass-border text-foreground hover:bg-muted px-8 py-6 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Meet AI Mentor
              </Button>
            </div>
          </motion.div>

          {/* Right: Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative floating">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px]" />
              <img
                src={heroBrain}
                alt="AI Brain Visualization"
                className="relative w-[500px] h-[500px] object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
