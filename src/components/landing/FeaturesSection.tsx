import { motion } from "framer-motion";
import {
  Brain,
  Target,
  TrendingUp,
  Zap,
  BookOpen,
  BarChart3,
  Clock,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Thinking Pattern Detection",
    description: "AI classifies you as Overthinker, Guesser, or Balanced Performer with cognitive profiling.",
  },
  {
    icon: Target,
    title: "Performance Heatmap",
    description: "Visual topic-wise accuracy and time analysis to spot weak areas instantly.",
  },
  {
    icon: Zap,
    title: "Wrong Answer Analysis",
    description: 'Personalized explanations like "You confused concept A with B" for every mistake.',
  },
  {
    icon: TrendingUp,
    title: "Mistake Memory System",
    description: "Tracks repeated mistakes across tests to identify deep-rooted knowledge gaps.",
  },
  {
    icon: BookOpen,
    title: "AI Study Plan Generator",
    description: "Personalized day-by-day improvement plans based on your unique weakness profile.",
  },
  {
    icon: BarChart3,
    title: "30-Day Progress Tracker",
    description: "Brain fitness tracker showing accuracy growth, speed improvements, and streaks.",
  },
  {
    icon: Clock,
    title: "Time Intelligence",
    description: "Detects overthinking and guessing patterns with actionable time management tips.",
  },
  {
    icon: MessageSquare,
    title: "AI Mentor Coach",
    description: "Chat-based AI assistant for concept explanations, study tips, and practice questions.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-primary/[0.02]" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powered by <span className="gradient-text">Intelligence</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every feature is designed to transform how you learn, not just how you score.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 group hover:shadow-glow transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
