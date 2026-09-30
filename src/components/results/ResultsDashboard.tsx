import { useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, Target, Clock, CheckCircle, BarChart3, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TestResult } from "@/data/testData";
import PerformanceChart from "./PerformanceChart";
import DetailedQuestionReport from "./DetailedQuestionReport";
import StudyPlan from "./StudyPlan";

interface ResultsDashboardProps {
  result: TestResult;
  onBackHome: () => void;
  onRetakeTest: () => void;
}

const ResultsDashboard = ({ result, onBackHome, onRetakeTest }: ResultsDashboardProps) => {
  const stats = useMemo(() => {
    const safeAnswers = result.answers || [];
    const correct = safeAnswers.filter((a) => a.isCorrect).length;
    const total = safeAnswers.length || 1;
    const accuracy = Math.round((correct / total) * 100);
    const totalTimeSpent = safeAnswers.reduce((s, a) => s + (a?.timeSpent || 0), 0);
    const avgTime = Math.round(totalTimeSpent / total);

    const fastAnswers = safeAnswers.filter((a) => a.timeSpent < 5);
    const slowAnswers = safeAnswers.filter((a) => a.timeSpent > 30);
    const wrongFast = fastAnswers.filter((a) => !a.isCorrect).length;
    const wrongSlow = slowAnswers.filter((a) => !a.isCorrect).length;

    let pattern = "Balanced Performer";
    let patternDesc = "You maintain a good balance between speed and accuracy.";
    let patternColor = "text-success";

    if (wrongFast > total * 0.3) {
      pattern = "Guesser";
      patternDesc = "You tend to answer too quickly without full analysis. Slow down on tricky questions.";
      patternColor = "text-warning";
    } else if (wrongSlow > total * 0.25) {
      pattern = "Overthinker";
      patternDesc = "You spend too much time on questions and still get them wrong. Trust your first instinct more.";
      patternColor = "text-accent";
    } else if (accuracy < 40) {
      pattern = "Conceptually Weak";
      patternDesc = "Core concepts need strengthening. Focus on fundamentals before attempting harder problems.";
      patternColor = "text-destructive";
    }

    return { correct, total: safeAnswers.length, accuracy, avgTime, pattern, patternDesc, patternColor, fastAnswers: fastAnswers.length, slowAnswers: slowAnswers.length };
  }, [result]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="min-h-screen p-6 dot-grid">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <button onClick={onBackHome} className="text-muted-foreground text-sm hover:text-foreground flex items-center gap-1 mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
            <h1 className="text-3xl font-bold">Your <span className="gradient-text">Intelligence Report</span></h1>
            <p className="text-muted-foreground mt-1">{result.config.topic} • {result.config.difficulty} • {result.config.questionCount} questions</p>
          </div>
          <Button onClick={onRetakeTest} variant="outline" className="border-glass-border">Retake Test</Button>
        </motion.div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Score", value: `${stats.correct}/${stats.total}`, icon: Target, color: "text-primary" },
            { label: "Accuracy", value: `${stats.accuracy}%`, icon: CheckCircle, color: stats.accuracy >= 70 ? "text-success" : stats.accuracy >= 40 ? "text-warning" : "text-destructive" },
            { label: "Total Time", value: formatTime(result.totalTime), icon: Clock, color: "text-info" },
            { label: "Avg/Question", value: `${stats.avgTime}s`, icon: BarChart3, color: "text-accent" },
          ].map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 text-center">
              <card.icon className={`w-6 h-6 mx-auto mb-2 ${card.color}`} />
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-muted-foreground text-sm">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Cognitive Profile */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-primary" /> Cognitive Profile
          </h3>
          <div className={`text-2xl font-bold mb-2 ${stats.patternColor}`}>{stats.pattern}</div>
          <p className="text-muted-foreground text-sm leading-relaxed">{stats.patternDesc}</p>
          <div className="mt-4 flex gap-4 text-sm">
            <div className="glass px-3 py-2 rounded-lg"><span className="text-muted-foreground">Fast answers:</span> <span className="font-semibold">{stats.fastAnswers}</span></div>
            <div className="glass px-3 py-2 rounded-lg"><span className="text-muted-foreground">Slow answers:</span> <span className="font-semibold">{stats.slowAnswers}</span></div>
          </div>
        </motion.div>

        {/* Performance Charts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" /> Performance Heatmap
          </h3>
          <PerformanceChart result={result} />
        </motion.div>

        {/* Detailed Question Report */}
        <DetailedQuestionReport result={result} />

        {/* AI Study Plan */}
        <StudyPlan result={result} />
      </div>
    </div>
  );
};

export default ResultsDashboard;
