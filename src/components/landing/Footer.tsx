import { Brain } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg">Abhyas AI</span>
        </div>
        <p className="text-muted-foreground text-sm">
          Where Every Mistake Becomes Your Strength © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
