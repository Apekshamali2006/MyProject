import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Sparkles, ArrowLeft, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIMentorProps {
  onBack: () => void;
}

const INITIAL_MESSAGE: Message = {
  id: "1",
  role: "assistant",
  content: "Hello! I'm your Abhyas AI Mentor. I've analyzed your recent learning patterns. How can I help you improve today? You can ask me about specific topics, study strategies, or even to explain a concept you're struggling with.",
  timestamp: new Date(),
};

const SUGGESTIONS = [
  "How can I improve my time management?",
  "Explain Quantum Physics simply",
  "Create a 7-day study plan for Math",
  "Analyze my common mistakes",
];

export const AIMentor = ({ onBack }: AIMentorProps) => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (content: string = inputValue) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Mock AI Response Logic
    setTimeout(() => {
      const { response, action } = getMockResponse(content, lastAction);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLastAction(action);
      setIsTyping(false);
    }, 1500);
  };

  const getMockResponse = (input: string, context: string | null): { response: string, action: string | null } => {
    const lowInput = input.toLowerCase();
    
    // Synonyms for confirmation
    const isYes = lowInput.match(/\b(yes|sure|ok|okay|yep|yeah|fine|do it|generate|show me|go ahead)\b/);
    const isNo = lowInput.match(/\b(no|nah|not now|later|stop|cancel)\b/);

    // Context-specific handling for confirmation
    if (context === "suggest_plan" && isYes) {
      return {
        response: "Perfect! Here's your personalized 5-day intensive study plan:\n\n📅 Day 1: Concept Mastery (Focus on Logic & Probability)\n📅 Day 2: Pattern Recognition (Review past 3 test mistakes)\n📅 Day 3: Speed Training (Timed mock session with 20 questions)\n📅 Day 4: Weakness Deep-Dive (Advanced problem solving)\n📅 Day 5: Final Strategy & Mental Prep.\n\nI've added these to your dashboard. Shall we start with the Day 1 review now?",
        action: "start_module"
      };
    }

    if (context === "suggest_practice" && isYes) {
      return {
        response: "Starting a targeted practice session for you... I've picked 10 questions where you previously struggled with calculation steps. Ready to begin?",
        action: "start_test"
      };
    }

    // Direct Intent: Study Plan
    if (lowInput.includes("plan") || lowInput.includes("schedule") || lowInput.includes("days")) {
      const dayMatch = lowInput.match(/\d+/);
      const days = dayMatch ? dayMatch[0] : "5";
      
      // If user is asking for a plan specifically, give it directly if it sounds like a command
      if (lowInput.includes("give") || lowInput.includes("show") || lowInput.includes("create")) {
        return {
          response: `Absolutely! Here is your ${days}-day plan:\n\n• Days 1-${Math.ceil(Number(days)/2)}: Focus on core conceptual gaps.\n• Days ${Math.ceil(Number(days)/2) + 1}-${Number(days) - 1}: Mixed practice & mistake analysis.\n• Final Day: Full-length mock test.\n\nWould you like a more detailed breakdown for each day?`,
          action: "suggest_plan"
        };
      }
      
      return {
        response: `I can definitely help with that! A personalized ${days}-day plan should focus 40% on your weakest areas and 60% on mixed revision. Would you like me to generate a detailed schedule for this?`,
        action: "suggest_plan"
      };
    }

    // Direct Intent: Explanations
    if (lowInput.includes("explain") || lowInput.includes("what is") || lowInput.includes("how does")) {
      const topicMatch = input.split(/explain|what is|how does/i);
      const topic = topicMatch.length > 1 ? topicMatch[1].trim() : "that topic";
      
      return {
        response: `To explain ${topic} simply: it's like a system where every component has a specific role to play. Instead of memorizing, think of the 'why' behind it. I have a visualization tool for this—want to see it?`,
        action: "suggest_module"
      };
    }

    // Direct Intent: Mistake Analysis
    if (lowInput.includes("mistake") || lowInput.includes("wrong") || lowInput.includes("errors")) {
      return {
        response: "I've analyzed your last 3 tests. You tend to lose marks on 'application-based' questions in the final 10 minutes of the test. This suggests a slight drop in focus. Would you like a 5-minute focus exercise or a practice set?",
        action: "suggest_practice"
      };
    }

    // Direct Intent: Time Management
    if (lowInput.includes("time") || lowInput.includes("fast") || lowInput.includes("slow")) {
      return {
        response: "You spend 30% more time on 'Probability' than the average user. Try the '2-minute rule': if you don't see the path in 2 minutes, flag it and move on. Want to try a timed session with this rule?",
        action: "suggest_demo"
      };
    }

    // Direct Intent: Greetings
    if (lowInput.match(/\b(hi|hello|hey|greetings|morning|afternoon|evening)\b/)) {
      return {
        response: "Hello! I'm your Abhyas AI Mentor. I've been tracking your progress, and you're doing great in Verbal but could use some work in Quant. What should we tackle first?",
        action: "suggest_options"
      };
    }

    // Handle "no" or rejection
    if (isNo) {
      return {
        response: "No problem! We can do that later. What else can I help you with? I can analyze your mistakes, create a study plan, or explain a difficult concept.",
        action: "suggest_options"
      };
    }

    // Fallback with specific suggestions
    return {
      response: "I'm not quite sure how to help with that yet, but I'm learning! I can currently:\n1. Create a custom study plan (e.g., 'Give me a 5 day plan')\n2. Analyze your test mistakes\n3. Help with time management\n4. Explain complex topics\n\nWhich one would you like to try?",
      action: "suggest_options"
    };
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      <div className="container mx-auto px-4 max-w-4xl flex-1 flex flex-col mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold flex items-center gap-2">
                Meet Your AI Mentor <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              </h1>
              <p className="text-sm text-muted-foreground">Personalized guidance powered by Abhyas AI</p>
            </div>
          </div>
          <Badge variant="secondary" className="px-3 py-1 gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            AI Online
          </Badge>
        </motion.div>

        <Card className="flex-1 flex flex-col glass border-glass-border overflow-hidden relative">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6" ref={scrollRef}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "assistant" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {msg.role === "assistant" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === "assistant" 
                      ? "bg-muted/50 text-foreground rounded-tl-none" 
                      : "bg-primary text-primary-foreground rounded-tr-none"
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <span className="text-[10px] opacity-50 mt-2 block">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-muted/50 rounded-2xl p-4 rounded-tl-none">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-glass-border bg-background/50 backdrop-blur-sm">
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTIONS.map((s) => (
                  <Button 
                    key={s} 
                    variant="outline" 
                    size="sm" 
                    className="text-xs rounded-full border-primary/20 hover:border-primary"
                    onClick={() => handleSend(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Ask your mentor anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="bg-muted/50 border-glass-border focus-visible:ring-primary"
              />
              <Button onClick={() => handleSend()} size="icon" className="shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
