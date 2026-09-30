import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle, ChevronRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Question, AnswerRecord } from "@/data/testData";

interface TestInterfaceProps {
  questions: Question[];
  onComplete: (answers: AnswerRecord[], totalTime: number) => void;
}

const TestInterface = ({ questions, onComplete }: TestInterfaceProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [questionTime, setQuestionTime] = useState(0);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const startTimeRef = useRef(Date.now());

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTime((Date.now() - startTimeRef.current) / 1000);
      setQuestionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Tab switch detection
  useEffect(() => {
    const handler = () => {
      if (document.hidden) {
        setTabWarnings((p) => p + 1);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  const handleNext = useCallback(() => {
    const record: AnswerRecord = {
      questionId: question.id,
      selectedIndex: selectedOption,
      timeSpent: questionTime,
      isCorrect: selectedOption === question.correctIndex,
    };
    const newAnswers = [...answers, record];
    setAnswers(newAnswers);

    if (isLast) {
      onComplete(newAnswers, Math.round(totalTime));
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setQuestionTime(0);
    }
  }, [question, selectedOption, questionTime, answers, isLast, totalTime, onComplete]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="glass border-b border-glass-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Question <span className="text-foreground font-semibold">{currentIndex + 1}</span> / {questions.length}
          </span>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-mono">{formatTime(totalTime)}</span>
          </div>
          {tabWarnings > 0 && (
            <span className="text-xs text-destructive flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {tabWarnings} tab switch{tabWarnings > 1 ? "es" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Warning overlay */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-card px-6 py-3 border border-destructive/50"
          >
            <p className="text-destructive text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Tab switch detected! Stay focused.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl w-full space-y-8"
        >
          <div className="glass-card p-8">
            <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
              <span className="px-2 py-1 rounded bg-muted">{question.topic}</span>
              <span className="px-2 py-1 rounded bg-muted capitalize">{question.difficulty}</span>
              <span className="ml-auto flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formatTime(questionTime)}
              </span>
            </div>
            <h3 className="text-xl font-semibold leading-relaxed">{question.text}</h3>
          </div>

          <div className="space-y-3">
            {question.options.map((opt, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedOption(i)}
                className={`w-full text-left glass-card p-5 transition-all ${
                  selectedOption === i
                    ? "ring-2 ring-primary shadow-glow"
                    : "hover:ring-1 hover:ring-glass-border"
                }`}
              >
                <span className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
                    selectedOption === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt}</span>
                </span>
              </motion.button>
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-5 disabled:opacity-40"
            >
              {isLast ? (
                <>Finish Test <Flag className="ml-2 w-4 h-4" /></>
              ) : (
                <>Next <ChevronRight className="ml-2 w-4 h-4" /></>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestInterface;
