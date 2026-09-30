import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Calendar, Target, CheckSquare, Brain } from "lucide-react";
import type { TestResult } from "@/data/testData";

interface StudyPlanProps {
  result: TestResult;
}

const StudyPlan = ({ result }: StudyPlanProps) => {
  const weakConcepts = result.questions
    .filter((q, i) => !result.answers[i]?.isCorrect)
    .map((q) => q.concept)
    .filter((v, i, a) => a.indexOf(v) === i);

  if (weakConcepts.length === 0) return null;

  const accuracy = Math.round(
    (result.answers.filter((a) => a.isCorrect).length / result.answers.length) * 100
  );

  const avgTime = Math.round(
    result.answers.reduce((s, a) => s + a.timeSpent, 0) / result.answers.length
  );

  // Generate a detailed multi-day plan
  const generateDayPlan = (concept: string, dayNum: number, totalConcepts: number) => {
    const tasks = [];
    const phase = dayNum <= Math.ceil(totalConcepts * 0.4) ? "foundation" :
      dayNum <= Math.ceil(totalConcepts * 0.7) ? "practice" : "mastery";

    if (phase === "foundation") {
      tasks.push(
        { icon: "📖", text: `Read and understand the theory of "${concept}" from your textbook or notes.`, duration: "30 min" },
        { icon: "📝", text: `Write down all key formulas, definitions, and principles related to ${concept}.`, duration: "15 min" },
        { icon: "🧩", text: `Solve 5 basic conceptual questions on ${concept}. Focus on understanding, not speed.`, duration: "20 min" },
        { icon: "🔄", text: `Review your wrong answers from this test for ${concept}. Understand WHY you got them wrong.`, duration: "15 min" },
      );
    } else if (phase === "practice") {
      tasks.push(
        { icon: "⚡", text: `Quick revision of ${concept} formulas and concepts (flash cards recommended).`, duration: "10 min" },
        { icon: "🎯", text: `Solve 10 medium-difficulty problems on ${concept}. Time yourself.`, duration: "30 min" },
        { icon: "🔗", text: `Practice 3 problems that combine ${concept} with previously revised topics.`, duration: "20 min" },
        { icon: "📊", text: `Track your accuracy. Target: ≥70% before moving on.`, duration: "10 min" },
      );
    } else {
      tasks.push(
        { icon: "🏆", text: `Take a mini-test (5 hard questions) on ${concept}. Target: 80%+ accuracy.`, duration: "15 min" },
        { icon: "🧠", text: `Attempt previous year questions related to ${concept}.`, duration: "25 min" },
        { icon: "📋", text: `Create a 1-page summary/cheat sheet for ${concept} from memory.`, duration: "15 min" },
        { icon: "✅", text: `If scoring 80%+, move to the next weak area. If not, repeat Day ${dayNum - 1}.`, duration: "5 min" },
      );
    }

    return { phase, tasks };
  };

  const weeklyPlan = weakConcepts.map((concept, i) => ({
    day: i + 1,
    concept,
    ...generateDayPlan(concept, i + 1, weakConcepts.length),
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> AI-Powered Study Plan
        </h3>
        <span className="text-xs text-muted-foreground glass px-3 py-1 rounded-full">
          {weakConcepts.length} concepts to improve
        </span>
      </div>

      {/* Overview card */}
      <div className="glass-card p-5 border border-primary/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <Calendar className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">{weeklyPlan.length} Days</p>
            <p className="text-xs text-muted-foreground">Study Duration</p>
          </div>
          <div>
            <Target className="w-5 h-5 mx-auto text-success mb-1" />
            <p className="text-lg font-bold">{accuracy}% → 85%+</p>
            <p className="text-xs text-muted-foreground">Accuracy Goal</p>
          </div>
          <div>
            <Brain className="w-5 h-5 mx-auto text-accent mb-1" />
            <p className="text-lg font-bold">{weakConcepts.length}</p>
            <p className="text-xs text-muted-foreground">Weak Concepts</p>
          </div>
          <div>
            <CheckSquare className="w-5 h-5 mx-auto text-warning mb-1" />
            <p className="text-lg font-bold">~{weeklyPlan.length * 60} min</p>
            <p className="text-xs text-muted-foreground">Total Study Time</p>
          </div>
        </div>
      </div>

      {/* Daily plan cards */}
      <div className="space-y-4">
        {weeklyPlan.map((day) => (
          <div key={day.day} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">D{day.day}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold">Day {day.day}: {day.concept}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    day.phase === "foundation" ? "bg-info/20 text-info" :
                    day.phase === "practice" ? "bg-warning/20 text-warning" :
                    "bg-success/20 text-success"
                  }`}>
                    {day.phase === "foundation" ? "📖 Foundation" :
                     day.phase === "practice" ? "🎯 Practice" : "🏆 Mastery"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ~{day.tasks.reduce((s, t) => s + parseInt(t.duration), 0)} min
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2 ml-2">
              {day.tasks.map((task, ti) => (
                <div key={ti} className="flex items-start gap-3 text-sm">
                  <span className="text-base shrink-0">{task.icon}</span>
                  <p className="text-muted-foreground flex-1">{task.text}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{task.duration}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* What to do next */}
      <div className="glass-card p-5 border border-primary/20">
        <p className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span>
            <strong>Start today:</strong> Focus on <span className="text-primary">{weakConcepts[0]}</span>.
            {avgTime > 20 ? " You're spending too much time per question — practice speed drills after concept revision." :
             avgTime < 8 ? " You're answering too quickly — slow down and read each question carefully." :
             " Maintain your pace but focus on accuracy for weak areas."}
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default StudyPlan;
