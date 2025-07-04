import { useState } from "react";
import { Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
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
    "..."
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end">
      {/* Floating S elements */}
      <div className="absolute top-20 right-32 w-12 h-12 bg-foreground/20 rounded-full flex items-center justify-center text-foreground font-semibold backdrop-blur-sm">
        S
      </div>
      <div className="absolute top-80 left-20 w-12 h-12 bg-foreground/20 rounded-full flex items-center justify-center text-foreground font-semibold backdrop-blur-sm">
        S
      </div>
      <div className="absolute top-80 right-32 w-12 h-12 bg-foreground/20 rounded-full flex items-center justify-center text-foreground font-semibold backdrop-blur-sm">
        S
      </div>
      <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-foreground/20 rounded-full flex items-center justify-center text-foreground font-semibold backdrop-blur-sm">
        S
      </div>
      <div className="absolute bottom-40 right-1/4 w-12 h-12 bg-foreground/20 rounded-full flex items-center justify-center text-foreground font-semibold backdrop-blur-sm">
        S
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
        {/* Logo and branding */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="text-6xl font-light text-foreground mb-2">
              H<span className="inline-block transform scale-y-150">∧</span>
            </div>
            <div className="text-sm font-medium tracking-[0.3em] text-foreground/80">
              HYUN
            </div>
            <div className="text-sm font-medium tracking-[0.2em] text-foreground/80">
              ASSOCIATES
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4">
            Welcome to
          </h1>
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-16">
            Hyun and Associates
          </h2>
        </div>

        {/* Question */}
        <div className="text-center mb-12">
          <p className="text-lg text-foreground/90 font-light">
            Who do I have the pleasure of{" "}
            <span className="italic">speaking with</span>?
          </p>
        </div>

        {/* Input field */}
        <div className="w-full max-w-2xl mb-8">
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
  );
};

export default Index;