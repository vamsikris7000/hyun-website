import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Send, X, Star, Bot, User, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import aLogo from "@/assets/A.png";
import hyunLogo from "@/assets/hyunandassociates.png";
import haLogo from "@/assets/HA.png";
import fullLogo from "@/assets/FullLogo_Transparent1.png";

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface = ({ isOpen, onClose }: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [conversationId, setConversationId] = useState<string>("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [error, setError] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What services do you offer?",
    "How do I schedule a consultation?",
    "Tell me about your AI solutions",
    "What makes you different from competitors?"
  ];

  // Debounced scroll function to prevent excessive scrolling during streaming
  const scrollToBottom = useCallback(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Debounce scroll calls
  const debouncedScroll = useCallback(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [scrollToBottom]);

  useEffect(() => {
    // Prevent background scroll when chat is open
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      // Reset chat state when closed
      setShowWelcome(true);
      setMessage("");
      setChat([]);
      setStreamedText("");
      setIsLoading(false);
      setError("");
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  // Separate effect for scrolling
  useEffect(() => {
    if (chat.length > 0 || streamedText) {
      const timeoutId = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [chat, streamedText, scrollToBottom]);

  const handleSend = async () => {
    if (!message.trim() || message.length > 2000) return;
    const userMsg = message;
    setChat((prev) => [...prev, { role: 'user', text: userMsg }]);
    setMessage("");
    setIsLoading(true);
    setStreamedText("");
    setError("");
    setShowWelcome(false);

    try {
      console.log('Sending request to backend...', { userMsg, conversationId, isFirstMessage: !conversationId });
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      // Use Netlify Functions in production, local backend in development
      const chatUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3001/chat'
        : '/.netlify/functions/chatbot-proxy';
      
      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: {},
          query: userMsg,
          response_mode: 'streaming',
          conversation_id: conversationId || undefined,
          user: 'abc-123',
          files: [
            {
              type: 'image',
              transfer_method: 'remote_url',
              url: 'https://cloud.dify.ai/logo/logo-site.png',
            },
          ],
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log('Response received:', response.status, response.statusText);
      
      // Handle 404 responses by clearing conversation ID
      if (response.status === 404) {
        console.log('Conversation not found, clearing conversation ID');
        setConversationId('');
      }
      
      if (!response.body) throw new Error('No response body');
      const reader = response.body.getReader();
      let fullText = '';
      let decoder = new TextDecoder();
      let hasReceivedData = false;
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        console.log('Received chunk:', chunk);
        hasReceivedData = true;
        
        const lines = chunk.split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            // Remove 'data: ' prefix if present
            const cleanLine = line.startsWith('data: ') ? line.slice(6) : line;
            const data = JSON.parse(cleanLine);
            console.log('Parsed data:', data);
            
            // Extract conversation ID from the response
            if (data.conversation_id) {
              setConversationId(data.conversation_id);
            }
            
            if (data.event === 'agent_message' && data.answer) {
              fullText += data.answer;
              setStreamedText(fullText);
              console.log('Streaming text updated:', fullText);
            }
            if (data.event === 'message_end') {
              console.log('Message ended, adding to chat:', fullText);
              setChat((prev) => [...prev, { role: 'bot', text: fullText }]);
              setStreamedText('');
            }
          } catch (err) {
            console.log('Error parsing line:', line, err);
          }
        }
      }
      
      // Only show error if absolutely no data was received
      if (!hasReceivedData) {
        console.log('No streaming data received, this might be an API issue');
        setError('No response received from the chat service. Please try again.');
      }
    } catch (err) {
      console.error('Chat error:', err);
      // Don't show error messages - let the user try again
      setStreamedText("");
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (question: string) => {
    setMessage(question);
    setShowWelcome(false);
  };

  // Safe HTML rendering function with sanitization
  const renderSafeHTML = (text: string, showCursor: boolean = false) => {
    // Configure marked to disable math rendering to avoid KaTeX quirks mode warning
    const parsedHTML = marked.parse(text, {
      breaks: true,
      gfm: true,
      // Disable math rendering to prevent KaTeX quirks mode warning
      math: false
    });
    const cursorHTML = showCursor ? '<span class="animate-pulse text-black/60 ml-1">|</span>' : '';
    const fullHTML = parsedHTML + cursorHTML;
    return DOMPurify.sanitize(fullHTML);
  };



  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white"
        >
          {/* Simplified background gradients */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#efe9c0] rounded-full blur-3xl opacity-60" />
            <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#d0a4ff] rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#c0e9ef] rounded-full blur-3xl opacity-60" />
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 z-50 text-black hover:bg-white/20 rounded-full w-10 h-10 p-0 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </Button>

          {showWelcome ? (
            /* Welcome Screen */
            <div className="flex flex-col items-center justify-center h-full relative z-10 px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-4xl w-full"
              >
                {/* Logo */}
                <div className="flex flex-col items-center gap-4 mb-8">
                  <img
                    className="w-64 h-20 object-contain"
                    alt="Hyun and Associates Full Logo"
                    src={fullLogo}
                  />
                </div>

                <h1 className="font-normal text-black text-4xl md:text-5xl lg:text-6xl text-center leading-tight mb-6">
                  Welcome to
                  <br />
                  Hyun and Associates
                </h1>

                <p className="font-normal text-black text-xl md:text-2xl text-center leading-relaxed mb-12">
                  <span className="font-semibold">
                    Who do I have the pleasure{" "}
                  </span>
                  <span className="font-bold italic">
                    of speaking with?
                  </span>
                </p>

                <div className="flex flex-col w-full items-center gap-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="relative w-full max-w-2xl"
                  >
                    <div className="relative flex items-center bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1 px-6 py-4 bg-transparent text-black text-lg placeholder-gray-400 focus:outline-none rounded-full"
                        aria-label="Chat input"
                      />
                      <button
                        type="submit"
                        className="m-2 w-10 h-10 bg-[#af71f1] rounded-full flex items-center justify-center hover:bg-[#9c5ee0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#af71f1] focus:ring-offset-2"
                        aria-label="Send message"
                      >
                        <Send className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </form>

                  <div className="flex flex-wrap justify-center items-center gap-3 w-full max-w-3xl">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(question)}
                        className="px-4 py-2 rounded-lg border border-[#af71f1] hover:bg-[#af71f1] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#af71f1] focus:ring-offset-2 text-sm font-normal text-[#af71f1] whitespace-nowrap"
                        type="button"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
                </motion.div>
              </div>
          ) : (
            /* Chat Interface */
            <div className="flex flex-col h-full relative z-10">
              {/* Header with Logo */}
              <div className="flex items-center justify-between p-4">
                <img
                  className="w-48 h-16 object-contain"
                  alt="Hyun and Associates Full Logo"
                  src={fullLogo}
                />
                {conversationId && (
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    ID: {conversationId.slice(0, 8)}...
                  </div>
                )}
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-6">
                  {chat.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'user' ? (
                        <div className="max-w-[70%] bg-[#af71f1] text-white rounded-2xl rounded-br-md px-4 py-3 shadow-lg">
                          <p className="text-base leading-relaxed whitespace-pre-line break-words">{msg.text}</p>
                        </div>
                      ) : (
                        <div className="max-w-[80%] flex items-start gap-3">
                          <div className="w-2 h-2 bg-[#d0a4ff] rounded-full mt-2 flex-shrink-0"></div>
                          <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-3 shadow-lg">
                            <div className="text-black text-base leading-relaxed break-words">
                              <span dangerouslySetInnerHTML={{ __html: renderSafeHTML(msg.text) }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {/* Consolidated Response State - Loading, Streaming, or Error */}
                  {(isLoading || error) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[80%] flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          error ? 'bg-red-500' : 'bg-[#d0a4ff]'
                        }`}></div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-3 shadow-lg">
                          {error ? (
                            <div className="flex items-start gap-2 text-red-600 text-base leading-relaxed">
                              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span className="break-words">{error}</span>
                            </div>
                          ) : streamedText ? (
                            <div className="text-black text-base leading-relaxed break-words">
                              <span dangerouslySetInnerHTML={{ __html: renderSafeHTML(streamedText, true) }} />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-black text-base leading-relaxed">
                              <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                              <span>Thinking...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>
              </div>
              
              {/* Input Area - Fixed at bottom */}
              <div className="border-t border-gray-100 p-4 bg-white/95 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-full text-base placeholder:text-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-[#af71f1] focus:border-transparent"
                        disabled={isLoading}
                      />
                      <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#af71f1] transition-colors"
                        onClick={() => console.log("Microphone clicked")}
                        aria-label="Voice input"
                        type="button"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      className="w-12 h-12 flex items-center justify-center bg-[#af71f1] rounded-full hover:bg-[#9c5ee0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#af71f1] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSend}
                      disabled={isLoading || !message.trim()}
                      aria-label="Send message"
                      type="button"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : (
                        <Send className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {suggestedQuestions.slice(0, 2).map((question, index) => (
                      <button
                        key={index}
                        className="px-3 py-1.5 text-sm rounded-full border border-[#af71f1] text-[#af71f1] hover:bg-[#af71f1] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#af71f1] focus:ring-offset-2"
                        onClick={() => handleSuggestionClick(question)}
                        type="button"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatInterface;