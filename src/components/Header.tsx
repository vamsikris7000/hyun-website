import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HeaderProps {
  onBookDemo: () => void;
}

const Header = ({ onBookDemo }: HeaderProps) => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
            <span className="text-background font-bold text-lg">H</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#home" className="text-foreground hover:text-accent-blue transition-colors">HOME</a>
          <a href="#solutions" className="text-foreground hover:text-accent-blue transition-colors">SOLUTIONS</a>
          <a href="#partners" className="text-foreground hover:text-accent-blue transition-colors">PARTNERS</a>
          <a href="#contact" className="text-foreground hover:text-accent-blue transition-colors">CONTACT</a>
        </nav>
        
        <Button 
          onClick={onBookDemo}
          className="bg-foreground text-background hover:bg-foreground/90"
        >
          BOOK A DEMO
        </Button>
      </div>
    </motion.header>
  );
};

export default Header;