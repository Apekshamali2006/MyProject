import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from "recharts";
import type { TestResult } from "@/data/testData";

interface PerformanceChartProps {
  result: TestResult;
}

const COLORS = {
  correct: "hsl(150, 70%, 45%)",
  wrong: "hsl(0, 75%, 55%)",
  skipped: "hsl(220, 15%, 55%)",
  primary: "hsl(250, 85%, 65%)",
  accent: "hsl(280, 75%, 60%)",
};

const PerformanceChart = ({ result }: PerformanceChartProps) => {
  const { timeData, conceptData, pieData } = useMemo(() => {
    const timeData = result.questions.map((q, i) => ({
      name: `Q${i + 1}`,
      time: result.answers[i]?.timeSpent || 0,
      correct: result.answers[i]?.isCorrect ? 1 : 0,
      fill: result.answers[i]?.isCorrect ? COLORS.correct : COLORS.wrong,
    }));

    // Group by concept
    const conceptMap: Record<string, { correct: number; total: number; time: number }> = {};
    result.questions.forEach((q, i) => {
      const a = result.answers[i];
      if (!conceptMap[q.concept]) conceptMap[q.concept] = { correct: 0, total: 0, time: 0 };
      conceptMap[q.concept].total++;
      conceptMap[q.concept].time += a?.timeSpent || 0;
      if (a?.isCorrect) conceptMap[q.concept].correct++;
    });

    const conceptData = Object.entries(conceptMap).map(([concept, data]) => ({
      concept: concept.length > 15 ? concept.slice(0, 15) + "…" : concept,
      accuracy: Math.round((data.correct / data.total) * 100),
      avgTime: Math.round(data.time / data.total),
    }));

    const correct = result.answers.filter(a => a.isCorrect).length;
    const skipped = result.answers.filter(a => a.selectedIndex === null).length;
    const wrong = result.answers.length - correct - skipped;

    const pieData = [
      { name: "Correct", value: correct, fill: COLORS.correct },
      { name: "Wrong", value: wrong, fill: COLORS.wrong },
      ...(skipped > 0 ? [{ name: "Skipped", value: skipped, fill: COLORS.skipped }] : []),
    ];

    return { timeData, conceptData, pieData };
  }, [result]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Score Distribution Pie */}
      <div className="glass-card p-6">
        <h4 className="text-sm font-semibold text-muted-foreground mb-4">Score Distribution</h4>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "hsl(230, 25%, 10%)", border: "1px solid hsl(230, 20%, 22%)", borderRadius: "8px", color: "#fff" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Time per Question Bar */}
      <div className="glass-card p-6">
        <h4 className="text-sm font-semibold text-muted-foreground mb-4">Time per Question (seconds)</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={timeData}>
            <XAxis dataKey="name" tick={{ fill: "hsl(220, 15%, 55%)", fontSize: 12 }} />
            <YAxis tick={{ fill: "hsl(220, 15%, 55%)", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "hsl(230, 25%, 10%)", border: "1px solid hsl(230, 20%, 22%)", borderRadius: "8px", color: "#fff" }} />
            <Bar dataKey="time" radius={[4, 4, 0, 0]}>
              {timeData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Concept-wise Radar */}
      {conceptData.length >= 3 && (
        <div className="glass-card p-6 md:col-span-2">
          <h4 className="text-sm font-semibold text-muted-foreground mb-4">Topic-wise Accuracy (%)</h4>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={conceptData}>
              <PolarGrid stroke="hsl(230, 20%, 22%)" />
              <PolarAngleAxis dataKey="concept" tick={{ fill: "hsl(220, 15%, 55%)", fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "hsl(220, 15%, 55%)", fontSize: 10 }} />
              <Radar name="Accuracy" dataKey="accuracy" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;
