import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Gauge, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subjects, topicsBySubject, type TestConfig } from "@/data/testData";

interface TestSetupProps {
  onStart: (config: TestConfig) => void;
  onBack: () => void;
}

const difficulties = [
  { value: "easy" as const, label: "Easy", desc: "Concept Building", color: "text-success" },
  { value: "medium" as const, label: "Medium", desc: "Practice", color: "text-warning" },
  { value: "hard" as const, label: "Hard", desc: "Exam Level", color: "text-destructive" },
];

const questionCounts = [5, 10, 15, 20];

const TestSetup = ({ onStart, onBack }: TestSetupProps) => {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [questionCount, setQuestionCount] = useState(10);

  const topics = subject ? topicsBySubject[subject] || [] : [];
  const canStart = subject && topic && difficulty;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 dot-grid">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 max-w-2xl w-full space-y-8"
      >
        <div>
          <button onClick={onBack} className="text-muted-foreground text-sm hover:text-foreground mb-4 block">
            ← Back to Home
          </button>
          <h2 className="text-3xl font-bold">
            Configure Your <span className="gradient-text">Smart Test</span>
          </h2>
          <p className="text-muted-foreground mt-2">Personalize your test for maximum learning impact</p>
        </div>

        {/* Subject */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-3">
            <BookOpen className="w-4 h-4 text-primary" /> Subject
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {subjects.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSubject(s.id); setTopic(""); }}
                className={`glass-card p-4 text-center transition-all ${
                  subject === s.id ? "ring-2 ring-primary shadow-glow" : "hover:ring-1 hover:ring-glass-border"
                }`}
              >
                <span className="text-2xl block mb-1">{s.icon}</span>
                <span className="text-sm font-medium">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Topic */}
        {topics.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <label className="flex items-center gap-2 text-sm font-medium mb-3">
              <Gauge className="w-4 h-4 text-primary" /> Topic
            </label>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    topic === t ? "bg-primary text-primary-foreground" : "glass hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Difficulty */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-3">
            <Gauge className="w-4 h-4 text-primary" /> Difficulty
          </label>
          <div className="grid grid-cols-3 gap-3">
            {difficulties.map((d) => (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className={`glass-card p-4 text-center transition-all ${
                  difficulty === d.value ? "ring-2 ring-primary shadow-glow" : "hover:ring-1 hover:ring-glass-border"
                }`}
              >
                <span className={`text-sm font-semibold ${d.color}`}>{d.label}</span>
                <span className="text-xs text-muted-foreground block mt-1">{d.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-3">
            <Hash className="w-4 h-4 text-primary" /> Number of Questions
          </label>
          <div className="flex gap-3">
            {questionCounts.map((c) => (
              <button
                key={c}
                onClick={() => setQuestionCount(c)}
                className={`w-14 h-14 rounded-xl text-sm font-semibold transition-all ${
                  questionCount === c ? "bg-primary text-primary-foreground glow" : "glass hover:bg-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => canStart && onStart({ subject, topic, difficulty, questionCount })}
          disabled={!canStart}
          className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground glow disabled:opacity-40"
        >
          Launch Smart Test <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default TestSetup;
