import { useState, useCallback } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Footer from "@/components/landing/Footer";
import { AIMentor } from "@/components/landing/AIMentor";
import TestSetup from "@/components/test/TestSetup";
import TestInterface from "@/components/test/TestInterface";
import ResultsDashboard from "@/components/results/ResultsDashboard";
import { generateQuestions, type TestConfig, type TestResult, type AnswerRecord, type Question } from "@/data/testData";

type View = "landing" | "setup" | "test" | "results" | "mentor";

const Index = () => {
  const [view, setView] = useState<View>("landing");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const handleStartSetup = useCallback(() => setView("setup"), []);
  const handleOpenMentor = useCallback(() => setView("mentor"), []);

  const handleStartTest = useCallback((config: TestConfig) => {
    setTestConfig(config);
    const qs = generateQuestions(config);
    setQuestions(qs);
    setView("test");
  }, []);

  const handleTestComplete = useCallback(
    (answers: AnswerRecord[], totalTime: number) => {
      if (!testConfig) return;
      setTestResult({
        config: testConfig,
        questions,
        answers,
        totalTime,
        completedAt: new Date(),
      });
      setView("results");
    },
    [testConfig, questions]
  );

  if (view === "setup") {
    return <TestSetup onStart={handleStartTest} onBack={() => setView("landing")} />;
  }

  if (view === "test") {
    return <TestInterface questions={questions} onComplete={handleTestComplete} />;
  }

  if (view === "results" && testResult) {
    return (
      <ResultsDashboard
        result={testResult}
        onBackHome={() => setView("landing")}
        onRetakeTest={() => setView("setup")}
      />
    );
  }

  if (view === "mentor") {
    return <AIMentor onBack={() => setView("landing")} />;
  }

  return (
    <div className="min-h-screen">
      <Navbar onStartTest={handleStartSetup} onOpenMentor={handleOpenMentor} />
      <HeroSection onStartTest={handleStartSetup} />
      <div id="features"><FeaturesSection /></div>
      <div id="how-it-works"><HowItWorksSection /></div>
      <div id="testimonials"><TestimonialsSection /></div>
      <Footer />
    </div>
  );
};

export default Index;
