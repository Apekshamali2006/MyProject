import { motion } from "framer-motion";
import { XCircle, CheckCircle, Zap, Lightbulb, HelpCircle } from "lucide-react";
import type { TestResult } from "@/data/testData";

interface WrongAnswerAnalysisProps {
  result: TestResult;
}

const WrongAnswerAnalysis = ({ result }: WrongAnswerAnalysisProps) => {
  const wrongQuestions = result.questions
    .map((q, i) => ({ question: q, answer: result.answers[i], index: i }))
    .filter(({ answer }) => !answer.isCorrect);

  if (wrongQuestions.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-success text-xl">🎉 Perfect Score! All answers correct.</p>
        <p className="text-muted-foreground mt-2">Outstanding performance — you've mastered every concept tested.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-6">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <XCircle className="w-5 h-5 text-destructive" /> Wrong Answer Analysis ({wrongQuestions.length} questions)
      </h3>

      {wrongQuestions.map(({ question: q, answer: a, index: i }) => (
        <div key={q.id} className="glass-card p-6 border border-destructive/20 space-y-4">
          {/* Question header */}
          <div className="flex items-start gap-3">
            <span className="bg-destructive/20 text-destructive text-xs font-bold px-2 py-1 rounded shrink-0">Q{i + 1}</span>
            <p className="font-medium leading-relaxed">{q.text}</p>
          </div>

          {/* Your answer vs Correct */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-muted-foreground block">Your answer</span>
                <strong className="text-sm">{a.selectedIndex !== null ? q.options[a.selectedIndex] : "⏭ Skipped"}</strong>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
              <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-muted-foreground block">Correct answer</span>
                <strong className="text-sm">{q.options[q.correctIndex]}</strong>
              </div>
            </div>
          </div>

          {/* Quick explanation */}
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <p className="text-muted-foreground flex items-start gap-2">
              <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>{q.explanation}</span>
            </p>
          </div>

          {/* Detailed explanation */}
          {q.detailedExplanation && (
            <div className="p-4 glass rounded-lg border border-primary/20">
              <h5 className="text-sm font-semibold flex items-center gap-2 mb-3 text-primary">
                <Lightbulb className="w-4 h-4" /> Detailed Explanation
              </h5>
              <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {q.detailedExplanation}
              </div>
            </div>
          )}

          {/* Related practice questions */}
          {q.relatedQuestions && q.relatedQuestions.length > 0 && (
            <div className="p-4 glass rounded-lg border border-accent/20">
              <h5 className="text-sm font-semibold flex items-center gap-2 mb-3 text-accent">
                <HelpCircle className="w-4 h-4" /> Practice These to Master the Concept
              </h5>
              <ol className="space-y-2 text-sm text-muted-foreground">
                {q.relatedQuestions.map((rq, ri) => (
                  <li key={ri} className="flex items-start gap-2">
                    <span className="bg-accent/20 text-accent text-xs font-bold w-5 h-5 rounded flex items-center justify-center shrink-0">{ri + 1}</span>
                    <span>{rq}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Time spent insight */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>⏱ Time spent: <strong className="text-foreground">{a.timeSpent}s</strong></span>
            <span>📚 Concept: <strong className="text-foreground">{q.concept}</strong></span>
            {a.timeSpent < 5 && <span className="text-warning">⚡ Answered too quickly — read carefully!</span>}
            {a.timeSpent > 30 && <span className="text-accent">🧠 Spent too long — revisit fundamentals.</span>}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default WrongAnswerAnalysis;
