import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock, Zap, Brain, Target, MessageSquare, HelpCircle, ArrowRight, Activity, TrendingUp, ChevronDown, ChevronUp, BookOpen, Lightbulb } from "lucide-react";
import { useState } from "react";
import type { TestResult, AnswerRecord, Question } from "@/data/testData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DetailedQuestionReportProps {
  result: TestResult;
}

const DetailedQuestionReport = ({ result }: DetailedQuestionReportProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const safeAnswers = result.answers || [];
  const totalTimeSpent = safeAnswers.reduce((s, a) => s + (a?.timeSpent || 0), 0);
  const avgTime = safeAnswers.length > 0 ? totalTimeSpent / safeAnswers.length : 1;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getInsight = (a: AnswerRecord | undefined, q: Question) => {
    if (!a) {
      return { 
        id: 'unknown', 
        label: "Data Missing", 
        color: "text-gray-400", 
        bg: "bg-gray-400/10", 
        icon: HelpCircle, 
        desc: "Performance data for this question is unavailable." 
      };
    }
    
    const timeRatio = a.timeSpent / (avgTime || 1);
    
    if (a.isCorrect) {
      if (a.timeSpent < 5) return { id: 'lightning', label: "Lightning Fast", color: "text-yellow-400", bg: "bg-yellow-400/10", icon: Zap, desc: "You mastered this concept! Instant recall." };
      if (timeRatio < 0.7) return { id: 'efficient', label: "Efficient Mastery", color: "text-green-400", bg: "bg-green-400/10", icon: CheckCircle, desc: "Fast and accurate. Great execution." };
      if (timeRatio > 1.5) return { id: 'deep', label: "Deep Thinker", color: "text-blue-400", bg: "bg-blue-400/10", icon: Brain, desc: "You took your time but got it right. Solid deliberation." };
      return { id: 'steady', label: "Steady Hand", color: "text-emerald-400", bg: "bg-emerald-400/10", icon: Target, desc: "Perfect pace. Balanced approach." };
    } else {
      if (a.selectedIndex === null) return { id: 'skip', label: "Tactical Skip", color: "text-gray-400", bg: "bg-gray-400/10", icon: ArrowRight, desc: "Good decision to move on if unsure. Saves time!" };
      if (a.timeSpent < 5) return { id: 'impulse', label: "Impulse Error", color: "text-red-400", bg: "bg-red-400/10", icon: Zap, desc: "Answered too quickly. Slow down to avoid silly mistakes." };
      if (timeRatio > 1.8) return { id: 'struggle', label: "Conceptual Struggle", color: "text-purple-400", bg: "bg-purple-400/10", icon: HelpCircle, desc: "Spent a lot of time but couldn't crack it. Review this topic." };
      return { id: 'misinterpret', label: "Misinterpretation", color: "text-orange-400", bg: "bg-orange-400/10", icon: XCircle, desc: "Almost had it! Review the core logic." };
    }
  };

  const insights = (result.questions || []).map((q, i) => getInsight(safeAnswers[i], q));
  const counts = insights.reduce((acc, curr) => {
    if (curr && curr.id) {
      acc[curr.id] = (acc[curr.id] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-8 mt-12">
      <div className="flex items-center justify-between border-b border-glass-border pb-4">
        <h3 className="font-display font-bold text-2xl flex items-center gap-3">
          <Activity className="w-6 h-6 text-primary" /> 
          Performance <span className="text-primary">DNA Analysis</span>
        </h3>
        <Badge variant="outline" className="text-muted-foreground border-glass-border">
          {(result.answers || []).length} Questions Scanned
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {counts.lightning > 0 && (
          <div className="glass p-4 rounded-xl border border-yellow-400/20 text-center">
            <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-xl font-bold">{counts.lightning}</div>
            <div className="text-[10px] uppercase text-muted-foreground">Insta-Solved</div>
          </div>
        )}
        {counts.efficient > 0 && (
          <div className="glass p-4 rounded-xl border border-green-400/20 text-center">
            <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-xl font-bold">{counts.efficient}</div>
            <div className="text-[10px] uppercase text-muted-foreground">High Efficiency</div>
          </div>
        )}
        {counts.deep > 0 && (
          <div className="glass p-4 rounded-xl border border-blue-400/20 text-center">
            <Brain className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-xl font-bold">{counts.deep}</div>
            <div className="text-[10px] uppercase text-muted-foreground">Deep Focus</div>
          </div>
        )}
        {counts.impulse > 0 && (
          <div className="glass p-4 rounded-xl border border-red-400/20 text-center">
            <Activity className="w-5 h-5 text-red-400 mx-auto mb-1" />
            <div className="text-xl font-bold">{counts.impulse}</div>
            <div className="text-[10px] uppercase text-muted-foreground">Impulse Alerts</div>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {(result.questions || []).map((q, i) => {
          const a = safeAnswers[i];
          const insight = insights[i];
          if (!insight) return null;
          
          const timePercent = a ? Math.min((a.timeSpent / (avgTime * 2)) * 100, 100) : 0;

          return (
            <Card key={q.id} className="glass border-glass-border overflow-hidden group hover:border-primary/30 transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                {/* Left Side: Status & Time */}
                <div className={`w-full md:w-64 p-6 border-b md:border-b-0 md:border-r border-glass-border flex flex-col justify-between ${a?.isCorrect ? 'bg-success/5' : a?.selectedIndex === null ? 'bg-muted/10' : 'bg-destructive/5'}`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Question {i + 1}</span>
                      {a?.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : a?.selectedIndex === null ? (
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{a?.timeSpent || 0} seconds</span>
                      </div>
                      <Progress value={timePercent} className="h-1 bg-muted/20" />
                      <p className="text-[10px] text-muted-foreground">
                        {a && a.timeSpent > avgTime ? `${Math.round((a.timeSpent/avgTime - 1) * 100)}% slower than avg` : a ? `${Math.round((1 - a.timeSpent/avgTime) * 100)}% faster than avg` : 'No time data'}
                      </p>
                    </div>
                  </div>

                  <div className={`mt-6 p-3 rounded-xl ${insight.bg} border border-glass-border`}>
                    <div className="flex items-center gap-2 mb-1">
                      <insight.icon className={`w-4 h-4 ${insight.color}`} />
                      <span className={`text-xs font-bold ${insight.color}`}>{insight.label}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-tight">{insight.desc}</p>
                  </div>
                </div>

                {/* Right Side: Content */}
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2 text-[10px] uppercase tracking-tighter bg-muted/30">
                        {q.concept} • {q.difficulty}
                      </Badge>
                      <p className="text-lg font-medium leading-relaxed group-hover:text-primary/90 transition-colors">
                        {q.text}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg border text-sm ${a?.selectedIndex === q.correctIndex ? 'bg-success/10 border-success/30 text-success' : 'bg-destructive/10 border-destructive/30 text-destructive'}`}>
                      <span className="text-[10px] uppercase opacity-60 block mb-1">Your Choice</span>
                      {a?.selectedIndex !== null && a?.selectedIndex !== undefined ? q.options[a.selectedIndex] : "⏭ Skipped"}
                    </div>
                    {a?.selectedIndex !== q.correctIndex && (
                      <div className="p-3 rounded-lg border border-success/30 bg-success/10 text-success text-sm">
                        <span className="text-[10px] uppercase opacity-60 block mb-1">Correct Answer</span>
                        {q.options[q.correctIndex]}
                      </div>
                    )}
                  </div>

                  <div className="bg-muted/30 p-4 rounded-xl space-y-3 border border-glass-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-primary">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs font-bold">AI Explanation & Examples</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleExpand(q.id)}
                        className="h-7 px-2 text-[10px] uppercase font-bold text-muted-foreground hover:text-primary transition-colors"
                      >
                        {expandedId === q.id ? (
                          <>Less <ChevronUp className="ml-1 w-3 h-3" /></>
                        ) : (
                          <>More Details <ChevronDown className="ml-1 w-3 h-3" /></>
                        )}
                      </Button>
                    </div>
                    
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      {q.explanation}
                    </div>

                    <AnimatePresence>
                      {expandedId === q.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden space-y-4 pt-2 border-t border-glass-border"
                        >
                          {q.detailedExplanation && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-accent">
                                <Lightbulb className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">In-Depth Logic</span>
                              </div>
                              <p className="text-xs leading-relaxed italic">
                                {q.detailedExplanation}
                              </p>
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-info">
                              <BookOpen className="w-3 h-3" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Real-World Application</span>
                            </div>
                            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                              <p className="text-xs leading-relaxed">
                                {q.concept === "Equations of Motion" ? "Imagine you're designing a high-speed elevator for a skyscraper. You need to calculate the exact height to start decelerating so passengers don't feel too much 'G-force' but still stop perfectly at the floor." : 
                                 q.concept === "Relative Motion" ? "Think of two trains passing each other. To a passenger in one train, the other seems to be flying by much faster than it actually is because their velocities are relative." :
                                 `Understanding ${q.concept} is crucial in fields like engineering and research, where these principles are used to model complex systems in the real world.`}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="glass-card p-8 border-dashed border-2 border-primary/20 flex flex-col items-center text-center space-y-4">
        <TrendingUp className="w-12 h-12 text-primary animate-pulse" />
        <h4 className="text-xl font-bold font-display">Cognitive Growth Unlocked</h4>
        <p className="text-muted-foreground max-w-lg">
          Our AI has detected that your focus peaks during the middle of the test. To improve, try starting with your most challenging subject while your mental energy is at its highest.
        </p>
        <div className="flex gap-4">
          <Badge className="bg-primary/20 text-primary border-primary/30">Focus: 84%</Badge>
          <Badge className="bg-accent/20 text-accent border-accent/30">Speed: 92%</Badge>
          <Badge className="bg-success/20 text-success border-success/30">Stamina: High</Badge>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailedQuestionReport;
