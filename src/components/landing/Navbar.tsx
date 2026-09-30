import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onStartTest: () => void;
  onOpenMentor: () => void;
}

const Navbar = ({ onStartTest, onOpenMentor }: NavbarProps) => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass-border">
    <div className="container mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = "/"}>
        <Brain className="w-7 h-7 text-primary" />
        <span className="font-display font-bold text-xl">Abhyas AI</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
        <button onClick={onOpenMentor} className="hover:text-foreground transition-colors">AI Mentor</button>
        <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
      </div>
      <Button onClick={onStartTest} className="bg-primary hover:bg-primary/90 text-primary-foreground">
        Start Test
      </Button>
    </div>
  </nav>
);

export default Navbar;
