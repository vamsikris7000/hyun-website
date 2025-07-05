import { useState } from "react";
import { Mic, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface = ({ isOpen, onClose }: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const suggestions = [
    "What services do you offer?",
    "How do I schedule a consultation?",
    "Tell me about your solutions"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-4 md:inset-8 bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end rounded-2xl overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-foreground/10">
                <div className="text-center flex-1">
                  <div className="text-2xl font-light text-foreground mb-1">
                    H<span className="inline-block transform scale-y-150">∧</span>
                  </div>
                  <div className="text-xs font-medium tracking-[0.2em] text-foreground/80">
                    HYUN ASSOCIATES
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-foreground hover:bg-foreground/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Chat Content */}
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                <div className="text-center mb-8">
                  <p className="text-lg text-foreground/90 font-light">
                    Who do I have the pleasure of{" "}
                    <span className="italic">speaking with</span>?
                  </p>
                </div>

                {/* Input field */}
                <div className="w-full max-w-2xl mb-6">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder=""
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full h-14 px-6 pr-24 text-lg bg-white/90 backdrop-blur-sm border-none rounded-full shadow-lg focus:shadow-xl transition-all duration-300 placeholder:text-foreground/50"
                    />
                    <div className="absolute right-3 top-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 rounded-full hover:bg-accent-purple/20"
                      >
                        <Mic className="w-4 h-4 text-accent-purple" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSend}
                        className="w-8 h-8 p-0 rounded-full bg-foreground hover:bg-foreground/90 text-background"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Suggestion buttons */}
                <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="px-6 py-2 text-sm bg-white/60 backdrop-blur-sm border-foreground/20 text-foreground hover:bg-white/80 rounded-full transition-all duration-300"
                      onClick={() => setMessage(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatInterface;