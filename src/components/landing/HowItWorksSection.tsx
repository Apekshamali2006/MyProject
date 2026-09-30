import { motion } from "framer-motion";
import { ClipboardCheck, Cpu, Search, Rocket } from "lucide-react";

const steps = [
  { icon: ClipboardCheck, title: "Take a Smart Test", desc: "Choose subject, topic, and difficulty. Our distraction-free interface tracks every detail." },
  { icon: Cpu, title: "AI Analyzes You", desc: "Deep analysis of your thinking patterns, time distribution, and conceptual gaps." },
  { icon: Search, title: "Weaknesses Revealed", desc: "Get a cognitive profile with heatmaps, mistake memory, and personalized insights." },
  { icon: Rocket, title: "Grow Smarter Daily", desc: "Follow AI-generated study plans. Track 30-day progress like a brain fitness app." },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How <span className="gradient-text-accent">It Works</span>
          </h2>
          <p className="text-muted-foreground text-lg">Four steps to unlock your learning potential</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6 glow">
                <s.icon className="w-9 h-9 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 md:right-auto md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                {i + 1}
              </div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
