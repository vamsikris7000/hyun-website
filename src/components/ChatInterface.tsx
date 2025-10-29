import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Send, X, Star, Bot, User, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import aLogo from "@/assets/A.png";
import hyunLogo from "@/assets/hyunandassociates.png";
import haLogo from "@/assets/HA.png";
import fullLogo from "@/assets/FullLogo_Transparent1.png";
import diagnoseIcon from "@/assets/Diagnose.jpeg";
import designIcon from "@/assets/Design.png";
import deliverIcon from "@/assets/Deliver.jpeg";
import aiIcon from "@/assets/AI Icon.jpg";
import automationIcon from "@/assets/automation icon.jpg";
import dataTransformationIcon from "@/assets/Data Transformation Icon.png";

// Animated Logo Component with smooth transition
const AnimatedLogo = ({ isWelcome, className = "" }: { isWelcome: boolean; className?: string }) => {
  return (
    <motion.img
      src={haLogo}
      alt="Hyun and Associates Logo"
      className={`object-contain ${className}`}
      layoutId="ha-logo" // This enables layout animations between components
      initial={false}
      animate={{
        scale: isWelcome ? 1 : 0.75, // Scale from 1 to 0.75 (128px to 96px)
        opacity: 1,
        rotate: isWelcome ? 0 : -2, // Subtle rotation for natural feel
        y: isWelcome ? 0 : -10 // Slight upward movement
      }}
      transition={{
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1], // Custom easing for smooth transition
        layout: { 
          duration: 0.8, 
          ease: [0.4, 0, 0.2, 1],
          type: "spring",
          stiffness: 100,
          damping: 20
        },
        opacity: { duration: 0.3, delay: isWelcome ? 0 : 0.1 }
      }}
      style={{
        width: isWelcome ? 128 : 96,
        height: isWelcome ? 128 : 96,
        filter: isWelcome ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))'
      }}
    />
  );
};

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface = ({ isOpen, onClose }: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: 'user' | 'bot', text: string }[]>(() => {
    // Load chat from sessionStorage on component mount
    if (typeof window !== 'undefined') {
      const savedChat = sessionStorage.getItem('hyun-chat-history');
      return savedChat ? JSON.parse(savedChat) : [];
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [conversationId, setConversationId] = useState<string>("");
  const [showWelcome, setShowWelcome] = useState(() => {
    // Don't show welcome if there's existing chat history
    if (typeof window !== 'undefined') {
      const savedChat = sessionStorage.getItem('hyun-chat-history');
      return !savedChat || JSON.parse(savedChat).length === 0;
    }
    return true;
  });
  const [error, setError] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<{name: string, isReturning: boolean} | null>(() => {
    // Load user info from sessionStorage on component mount
    if (typeof window !== 'undefined') {
      const savedUserInfo = sessionStorage.getItem('hyun-user-info');
      return savedUserInfo ? JSON.parse(savedUserInfo) : null;
    }
    return null;
  });
  const [showNameResponse, setShowNameResponse] = useState(false);
  const [detectedName, setDetectedName] = useState<string>("");
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);
  const [showServicesInfo, setShowServicesInfo] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [serviceCounts, setServiceCounts] = useState<{[key: string]: number}>({});
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [structuredContent, setStructuredContent] = useState<Array<{id: string, title: string, content: string, type: 'card'}>>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const autoSendTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const manuallyStoppedRef = useRef<boolean>(false);

  // Save chat to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && chat.length > 0) {
      sessionStorage.setItem('hyun-chat-history', JSON.stringify(chat));
    }
  }, [chat]);

  // Save user info to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && userInfo) {
      sessionStorage.setItem('hyun-user-info', JSON.stringify(userInfo));
    }
  }, [userInfo]);

  const suggestedQuestions = [
    "What makes you different from competitors?",
    "How do I schedule a consultation?",
    "About the Company",
    "What services do you offer?"
  ];

  const servicesData = [
    {
      id: "general-it",
      title: "General IT Consulting",
      keywords: ["IT", "Consulting"],
      description: "We help with utilizing unique hardware and software solutions to drive efficiency and productivity.",
      icon: deliverIcon
    },
    {
      id: "agentic-ai",
      title: "Agentic AI Solutions",
      keywords: ["Agentic", "AI"],
      description: "Our premier custom solution that execute tasks for you so that you don't have to.",
      icon: aiIcon
    },
    {
      id: "automation",
      title: "Automation Solutions",
      keywords: ["Automation"],
      description: "Simple and cost effective way to execute repetitious tasks.",
      icon: automationIcon
    },
    {
      id: "data-transformation",
      title: "Data Transformation Services",
      keywords: ["Data", "Transformation"],
      description: "The most productive way to bring data and analytics that matters.",
      icon: dataTransformationIcon
    }
  ];


  // User recognition functions
  const getUserIdentifier = () => {
    // Create a unique identifier based on IP and browser fingerprint
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('user-fingerprint', 10, 10);
    const fingerprint = canvas.toDataURL();
    
    // Combine with other browser characteristics
    const browserInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      fingerprint: fingerprint.slice(-20) // Last 20 chars for uniqueness
    };
    
    return btoa(JSON.stringify(browserInfo)).slice(0, 32);
  };

  const saveUserInfo = (name: string) => {
    const userIdentifier = getUserIdentifier();
    const userData = {
      name: name,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      visitCount: 1,
      identifier: userIdentifier
    };
    
    // Check if user exists
    const existingUser = localStorage.getItem(`hyun_user_${userIdentifier}`);
    if (existingUser) {
      const existingData = JSON.parse(existingUser);
      userData.visitCount = existingData.visitCount + 1;
      userData.firstVisit = existingData.firstVisit;
    }
    
    localStorage.setItem(`hyun_user_${userIdentifier}`, JSON.stringify(userData));
    setUserInfo({ name: name, isReturning: !!existingUser });
  };

  const checkUserInfo = () => {
    const userIdentifier = getUserIdentifier();
    const existingUser = localStorage.getItem(`hyun_user_${userIdentifier}`);
    
    if (existingUser) {
      const userData = JSON.parse(existingUser);
      // Update last visit
      userData.lastVisit = new Date().toISOString();
      localStorage.setItem(`hyun_user_${userIdentifier}`, JSON.stringify(userData));
      
      setUserInfo({ name: userData.name, isReturning: true });
      return userData.name;
    }
    
    setUserInfo(null);
    return null;
  };

  const handleNameIntroduction = (name: string) => {
    setDetectedName(name);
    setShowNameResponse(true);
    setShowWelcome(false);
    
    // Add user message to chat
    setChat(prev => [...prev, { role: 'user', text: `My name is ${name}` }]);
    
    // Add pre-built response
    const response = `It's a pleasure to meet with you ${name}. Would you like to learn more about our company, our services, schedule an appointment, or would you like to explore the website?`;
    setChat(prev => [...prev, { role: 'bot', text: response }]);
    
    // Speak the response
    speakText(response);
    
    // Save user info
    saveUserInfo(name);
    
    // Scroll to bottom after adding messages
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const handleOptionClick = (option: string) => {
    let response = "";
    let action = "";
    
    // Add personalized greeting for known users
    const personalizedGreeting = userInfo ? `${userInfo.name}, ` : "";
    
    switch (option) {
      case "company":
        response = `${personalizedGreeting}Hyun and Associates is a company that specialize in changing the way people work so that people don't have to work for technology. We let innovative technologies work for you. To do that, we have a four step process that guides people towards their solution.`;
        action = "company_info";
        setShowCompanyInfo(true);
        setShowNameResponse(false);
        break;
      case "services":
        response = `${personalizedGreeting}With Hyun and Associates, we primarily focus on four main things, General IT Consulting, Agentic AI Solutions, Automation Solutions, and Data Transformation. Which of these options would like to learn more about?`;
        action = "services_info";
        setShowServicesInfo(true);
        setShowNameResponse(false);
        break;
      case "appointment":
        response = `${personalizedGreeting}I'd be happy to help you schedule an appointment. Let me redirect you to our booking system.`;
        action = "schedule_appointment";
        break;
      case "explore":
        response = `${personalizedGreeting}Great! I'll close this chat so you can explore our website. Feel free to come back anytime if you have questions.`;
        action = "explore_website";
        break;
    }
    
    // Add user message
    setChat(prev => [...prev, { role: 'user', text: option }]);
    
    // Add bot response
    setChat(prev => [...prev, { role: 'bot', text: response }]);
    
    // Speak the response
    speakText(response);
    
    // Scroll to bottom after adding messages
    setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    // Handle actions
    if (action === "schedule_appointment") {
      setTimeout(() => {
        window.open('https://outlook.office.com/bookwithme/user/719f78311287410ab589cb1be4871a00@hyunandassociatesllc.com?anonymous&ismsaljsauthenabled&ep=bwmEmailSignature', '_blank');
      }, 2000);
    } else if (action === "explore_website") {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };



  const handleScheduleClick = () => {
    const personalizedGreeting = userInfo ? `${userInfo.name}, ` : "";
    const response = `${personalizedGreeting}I'd be happy to help you schedule an appointment. Let me redirect you to our booking system.`;
    setChat(prev => [...prev, { role: 'user', text: 'Schedule appointment' }]);
    setChat(prev => [...prev, { role: 'bot', text: response }]);
    speakText(response);
    
    setTimeout(() => {
      window.open('https://outlook.office.com/bookwithme/user/719f78311287410ab589cb1be4871a00@hyunandassociatesllc.com?anonymous&ismsaljsauthenabled&ep=bwmEmailSignature', '_blank');
    }, 2000);
  };

  const handleCompanyFollowUp = () => {
    const personalizedGreeting = userInfo ? `${userInfo.name}, ` : "";
    const response = `${personalizedGreeting}Since you had the chance to learn more about the company, would you like to learn more about our services or would you like to schedule an appointment with our consultant?`;
    setChat(prev => [...prev, { role: 'bot', text: response }]);
    speakText(response);
  };

  const handleServiceClick = (serviceId: string) => {
    const service = servicesData.find(s => s.id === serviceId);
    if (!service) return;

    // Toggle flip state for the card
    setFlippedCards(prev => {
      const newFlipped = new Set(prev);
      if (newFlipped.has(serviceId)) {
        newFlipped.delete(serviceId);
      } else {
        newFlipped.add(serviceId);
      }
      return newFlipped;
    });
    
    // Update selected services
    const newSelectedServices = new Set(selectedServices);
    newSelectedServices.add(serviceId);
    setSelectedServices(newSelectedServices);

    // Update service counts
    setServiceCounts(prev => ({
      ...prev,
      [serviceId]: (prev[serviceId] || 0) + 1
    }));
  };

  const handleServiceFollowUp = () => {
    const personalizedGreeting = userInfo ? `${userInfo.name}, ` : "";
    const allServicesSelected = selectedServices.size === servicesData.length;
    
    if (allServicesSelected) {
      const response = `${personalizedGreeting}Since you've learned about all of our services, would you like to schedule an appointment with our consultant?`;
      setChat(prev => [...prev, { role: 'bot', text: response }]);
      speakText(response);
    } else {
      const response = `${personalizedGreeting}Would you like to learn more about our other services or would you like to schedule an appointment?`;
      setChat(prev => [...prev, { role: 'bot', text: response }]);
      speakText(response);
    }
  };




  // Function to parse structured content and convert to cards
  const parseStructuredContent = (text: string) => {
    const structuredSections: Array<{id: string, title: string, content: string, type: 'card'}> = [];
    let remainingText = text;

    // Pattern 1: Markdown headings with content (## Heading followed by content)
    const headingPattern = /(#{1,3})\s+(.+?)(?=\n#{1,3}|\n\n|\n-|\n\*|\n\d+\.|$)/gs;
    let match;
    
    while ((match = headingPattern.exec(text)) !== null) {
      const headingLevel = match[1].length;
      const title = match[2].trim();
      const content = match[0].replace(match[1] + ' ' + match[2], '').trim();
      
      // Only process if there's substantial content after the heading
      if (content.length > 10 && title.length > 2 && title.length < 100) {
        const sectionId = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        structuredSections.push({
          id: sectionId,
          title: title,
          content: content,
          type: 'card'
        });
        
        // Remove this section from remaining text
        remainingText = remainingText.replace(match[0], '').trim();
      }
    }

    // Pattern 2: Bold/strong text followed by content
    const boldPattern = /(\*\*|__)(.+?)\1\s*([^\n]+(?:\n(?!\*\*|__)[^\n]+)*)/g;
    while ((match = boldPattern.exec(text)) !== null) {
      const title = match[2].trim();
      const content = match[3].trim();
      
      if (content.length > 10 && title.length > 2 && title.length < 100) {
        const sectionId = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        structuredSections.push({
          id: sectionId,
          title: title,
          content: content,
          type: 'card'
        });
        
        remainingText = remainingText.replace(match[0], '').trim();
      }
    }

    // Pattern 3: Lines that look like section headers (all caps or title case)
    const sectionHeaderPattern = /^([A-Z][A-Za-z\s&]+):\s*([^\n]+(?:\n(?!^[A-Z][A-Za-z\s&]+:)[^\n]+)*)/gm;
    while ((match = sectionHeaderPattern.exec(text)) !== null) {
      const title = match[1].trim();
      const content = match[2].trim();
      
      if (content.length > 10 && title.length > 2 && title.length < 100) {
        const sectionId = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        structuredSections.push({
          id: sectionId,
          title: title,
          content: content,
          type: 'card'
        });
        
        remainingText = remainingText.replace(match[0], '').trim();
      }
    }

    // Clean up remaining text
    remainingText = remainingText
      .replace(/\n\s*\n/g, '\n')
      .replace(/^\s+|\s+$/g, '')
      .replace(/\s+/g, ' ');

    return {
      sections: structuredSections,
      remainingText: remainingText
    };
  };

  // Function to handle card clicks
  const handleCardClick = (title: string) => {
    console.log('Card clicked:', title);
    const question = `Can you explain brief about ${title}?`;
    console.log('Generated question:', question);
    
    // Set the question in the message input instead of auto-sending
    setMessage(question);
    
    // Focus on the input field
    setTimeout(() => {
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  };

  // Function to render structured content as cards
  const renderStructuredContent = (sections: Array<{id: string, title: string, content: string, type: 'card'}>) => {
    return sections.map((section, index) => (
      <motion.div
        key={section.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.1 + index * 0.1,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="flex justify-start mb-4"
      >
        <div className="w-full">
          <Card 
            className="bg-gradient-to-br from-white to-[#faf9ff] border-[#e0d4ff] hover:border-[#af71f1] transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer hover:scale-105"
            onClick={() => handleCardClick(section.title)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-[#0c202b] flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-[#af71f1] to-[#9c5ee0] rounded-full"></div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-gray-700 leading-relaxed">
                {section.content.split('\n').map((line, lineIndex) => {
                  const trimmedLine = line.trim();
                  if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
                    return (
                      <div key={lineIndex} className="flex items-start gap-2 mb-2">
                        <div className="w-1.5 h-1.5 bg-[#af71f1] rounded-full mt-2 flex-shrink-0"></div>
                        <span>{trimmedLine.substring(1).trim()}</span>
                      </div>
                    );
                  } else if (trimmedLine.match(/^\d+\./)) {
                    return (
                      <div key={lineIndex} className="flex items-start gap-2 mb-2">
                        <div className="w-5 h-5 bg-gradient-to-r from-[#af71f1] to-[#9c5ee0] rounded-full flex items-center justify-center text-xs text-white font-semibold flex-shrink-0 mt-0.5">
                          {trimmedLine.match(/^\d+/)?.[0]}
                        </div>
                        <span>{trimmedLine.replace(/^\d+\.\s*/, '').trim()}</span>
                      </div>
                    );
                  } else if (trimmedLine.length > 0) {
                    return (
                      <p key={lineIndex} className="mb-2 last:mb-0">
                        {trimmedLine}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    ));
  };

  // ElevenLabs Text-to-speech function
  const speakText = async (text: string) => {
    if (!text.trim()) return;
    
    // Only speak if microphone is listening
    if (!isListening) {
      console.log('TTS disabled - microphone is off');
      return;
    }
    
    try {
      setIsSpeaking(true);
      
      // Clean the text
      const cleanText = text.replace(/<[^>]*>/g, '').replace(/[^\w\s.,!?]/g, '');
      
      // Get ElevenLabs configuration from environment variables
      const elevenLabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      const elevenLabsVoiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;
      
      if (!elevenLabsApiKey || !elevenLabsVoiceId) {
        throw new Error('ElevenLabs API key or voice ID not configured');
      }
      
      // ElevenLabs API call
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      // Get the audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create and play audio
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl); // Clean up
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl); // Clean up
        console.error('Audio playback error');
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      setIsSpeaking(false);
      
      // Fallback to browser TTS if ElevenLabs fails (only if mic is listening)
      if ('speechSynthesis' in window && isListening) {
        const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Stop speaking function
  const stopSpeaking = () => {
    // Stop browser TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Stop any playing audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
      setIsSpeaking(false);
  };

  // Speech-to-text functions
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    
    // Clear manual stop flag when starting
    manuallyStoppedRef.current = false;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      setIsListening(true);
      console.log('Speech recognition started');
    };

    recognitionInstance.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setMessage(prev => {
          const newMessage = prev + finalTranscript;
          console.log('Final transcript:', finalTranscript);
          
          // Clear any existing timeout
          if (autoSendTimeoutRef.current) {
            clearTimeout(autoSendTimeoutRef.current);
          }
          
          // Set new timeout for auto-send after 2.5 seconds of silence
          autoSendTimeoutRef.current = setTimeout(() => {
            if (newMessage.trim() && isListening) {
              setMessage(newMessage);
              setTimeout(() => handleSend(), 100); // Small delay to ensure state is updated
            }
          }, 2500);
          
          return newMessage;
        });
      } else if (interimTranscript) {
        // Clear timeout when interim results are detected (user is still speaking)
        if (autoSendTimeoutRef.current) {
          clearTimeout(autoSendTimeoutRef.current);
          autoSendTimeoutRef.current = null;
        }
        console.log('Interim transcript:', interimTranscript);
      }
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('Microphone permission denied. Please allow microphone access and try again.');
      }
    };

    recognitionInstance.onend = () => {
      console.log('Speech recognition ended');
      // Only restart listening automatically if not manually stopped and chat is still open
      if (isOpen && !manuallyStoppedRef.current) {
        setTimeout(() => {
          if (isOpen && !manuallyStoppedRef.current) {
            startListening();
          }
        }, 100);
      } else {
        setIsListening(false);
      }
    };

    setRecognition(recognitionInstance);
    recognitionInstance.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
    // Mark as manually stopped
    manuallyStoppedRef.current = true;
    // Clear any pending auto-send timeout
    if (autoSendTimeoutRef.current) {
      clearTimeout(autoSendTimeoutRef.current);
      autoSendTimeoutRef.current = null;
    }
    // Stop any ongoing TTS when microphone is turned off
    stopSpeaking();
  };

  // Debounced scroll function to prevent excessive scrolling during streaming
  const scrollToBottom = useCallback(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    // Fallback: scroll the chat container to bottom
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, []);

  // Debounce scroll calls
  const debouncedScroll = useCallback(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [scrollToBottom]);

  useEffect(() => {
    // Check for existing user when component mounts
    if (isOpen) {
      checkUserInfo();
    }
  }, [isOpen]);

  // Preload voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Force voice loading
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Create a temporary utterance to trigger voice loading
        const tempUtterance = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(tempUtterance);
        window.speechSynthesis.cancel();
      }
    }
  }, []);

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
      setUserInfo(null);
      setShowNameResponse(false);
      setDetectedName("");
      setShowCompanyInfo(false);
      setShowServicesInfo(false);
      setSelectedServices(new Set());
      setServiceCounts({});
      setFlippedCards(new Set());
      setStructuredContent([]);
      // Clear sessionStorage when chat is manually reset
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('hyun-chat-history');
        sessionStorage.removeItem('hyun-user-info');
      }
      // Stop any ongoing speech recognition
      stopListening();
      // Clear any pending auto-send timeout
      if (autoSendTimeoutRef.current) {
        clearTimeout(autoSendTimeoutRef.current);
        autoSendTimeoutRef.current = null;
      }
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
      // Cleanup speech recognition on unmount
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isOpen, recognition]);

  // Separate effect for scrolling
  useEffect(() => {
    if (chat.length > 0 || streamedText) {
      const timeoutId = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [chat, streamedText, scrollToBottom]);

  // Start listening automatically when chat first opens
  useEffect(() => {
    if (isOpen) {
      startListening();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!message.trim() || message.length > 2000) return;
    const userMsg = message;
    
    // Check if user is introducing themselves (only if we don't know them yet)
    if (!userInfo && !showWelcome) {
      const namePattern = /(?:my name is|i'm|i am|call me|i go by)\s+([a-zA-Z]+)/i;
      const nameMatch = userMsg.match(namePattern);
      if (nameMatch) {
        const name = nameMatch[1];
        handleNameIntroduction(name);
        setMessage("");
        return; // Don't proceed with normal chat flow
      }
    }

    // Check for pre-built responses first (works for both known and unknown users)
    const lowerMsg = userMsg.toLowerCase();
    if (lowerMsg.includes('learn more about the company') || lowerMsg.includes('company')) {
      handleOptionClick("company");
      setMessage("");
      return;
    }
    if (lowerMsg.includes('learn more about our services') || lowerMsg.includes('services')) {
      handleOptionClick("services");
      setMessage("");
      return;
    }
    if (lowerMsg.includes('schedule') || lowerMsg.includes('appointment')) {
      handleOptionClick("appointment");
      setMessage("");
      return;
    }
    if (lowerMsg.includes('explore') || lowerMsg.includes('website')) {
      handleOptionClick("explore");
      setMessage("");
      return;
    }
    
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
               
                // First, parse for structured content (headings, sections)
                const structuredParsed = parseStructuredContent(fullText);
                
                if (structuredParsed.sections.length > 0) {
                  // Add the remaining text as the bot message
                  setChat((prev) => [...prev, { role: 'bot', text: structuredParsed.remainingText }]);
                  
                  // Set the structured content for display (only if new content found)
                  if (structuredParsed.sections.length > 0) {
                    setStructuredContent(structuredParsed.sections);
                  }
                  
                  // Just speak the remaining text
                  speakText(structuredParsed.remainingText);
                } else {
                  // No structured content, add full text as normal
                  setChat((prev) => [...prev, { role: 'bot', text: fullText }]);
              speakText(fullText);
                }
                
                setStreamedText('');
            }
          } catch (err) {
            console.log('Error parsing line:', line, err);
          }
        }
      }
      
      // Don't show error messages - let the Dify API handle responses
      // The error was causing false positives even when API was working
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
    setShowWelcome(false); // Hide welcome screen and show chat interface
    // Automatically send the message after setting it
    setTimeout(() => {
      handleSend();
    }, 100); // Small delay to ensure message is set
  };

  // Safe HTML rendering function with sanitization
  const renderSafeHTML = (text: string, showCursor: boolean = false) => {
    // Clean up unwanted formatting from text
    let cleanedText = text
      // Remove bold markdown (**text**)
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      // Remove numbered lists (1. 2. 3. 4. 5. 6.)
      .replace(/\d+\.\s*/g, '')
      // Remove colons at the end of sentences
      .replace(/:\s*$/gm, '')
      // Remove colons followed by newlines
      .replace(/:\s*\n/g, '\n')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      // Clean up multiple newlines
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    // Configure marked to disable math rendering to avoid KaTeX quirks mode warning
    const parsedHTML = marked.parse(cleanedText, {
      breaks: true,
      gfm: true
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
          <LayoutGroup>
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
                  <AnimatedLogo isWelcome={true} />
                </div>

                {userInfo ? (
                  // Returning user greeting
                  <>
                    <h1 className="font-normal text-black text-4xl md:text-5xl lg:text-6xl text-center leading-tight mb-6">
                      Hi {userInfo.name} and welcome back to
                      <br />
                      Hyun & Associates
                    </h1>

                    <p className="font-normal text-black text-xl md:text-2xl text-center leading-relaxed mb-12">
                      <span className="font-semibold">
                        where we let innovative technologies work for you.{" "}
                      </span>
                      <span className="font-bold italic">
                        Would you like to learn more about the company, our services, schedule an appointment, or would you like to explore the website?
                      </span>
                    </p>
                  </>
                ) : (
                  // New user greeting
                  <>
                <h1 className="font-normal text-black text-4xl md:text-5xl lg:text-6xl text-center leading-tight mb-6">
                  Welcome to
                  <br />
                  Hyun & Associates
                </h1>

                <p className="font-normal text-black text-xl md:text-2xl text-center leading-relaxed mb-12">
                  <span className="font-semibold">
                        where we let innovative technologies work for you.{" "}
                  </span>
                  <span className="font-bold italic">
                        Whom do I have the pleasure of speaking with today?
                  </span>
                </p>
                  </>
                )}

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
                        className="flex-1 px-6 py-4 pr-20 bg-transparent text-black text-lg placeholder-gray-400 focus:outline-none rounded-full"
                        aria-label="Chat input"
                      />
                      <button
                        type="button"
                        className={`absolute right-14 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                          isListening 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-[#af71f1]'
                        }`}
                        onClick={isListening ? stopListening : startListening}
                        aria-label={isListening ? "Stop listening" : "Start voice input"}
                      >
                        <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
                      </button>
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
                    {(userInfo ? [
                      "Tell me about your services",
                      "Schedule a consultation",
                      "Learn about AI solutions",
                      "Explore the website"
                    ] : suggestedQuestions).map((question, index) => (
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
                <AnimatedLogo isWelcome={false} />
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
                        <div className="max-w-[70%] bg-white text-black rounded-2xl rounded-br-md px-4 py-3 shadow-lg border border-gray-200">
                          <p className="text-base leading-relaxed whitespace-pre-line break-words">{msg.text}</p>
                        </div>
                      ) : (
                        <div className="max-w-[80%] flex items-start gap-3">
                          <div className="w-2 h-2 bg-[#d0a4ff] rounded-full mt-2 flex-shrink-0"></div>
                          <div className="bg-transparent rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="text-black text-base leading-relaxed break-words">
                              <span dangerouslySetInnerHTML={{ __html: renderSafeHTML(msg.text) }} />
                            </div>
                            
                            {/* Add cards as part of the bot message */}
                            {structuredContent.length > 0 && (
                              <div className="mt-4 max-w-4xl">
                                {renderStructuredContent(structuredContent)}
                              </div>
                            )}
                            
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
                        <div className="bg-transparent rounded-2xl rounded-bl-md px-4 py-3">
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
                  
                  {/* Option Buttons - Show after name introduction */}
                  {showNameResponse && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex flex-wrap justify-center gap-3 mt-6"
                    >
                      <button
                        onClick={() => handleOptionClick("company")}
                        className="px-6 py-3 bg-gradient-to-r from-[#af71f1] to-[#9c5ee0] text-white rounded-full font-semibold text-sm hover:from-[#9c5ee0] hover:to-[#8b4dd1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Learn more about the company
                      </button>
                      <button
                        onClick={() => handleOptionClick("services")}
                        className="px-6 py-3 bg-gradient-to-r from-[#af71f1] to-[#9c5ee0] text-white rounded-full font-semibold text-sm hover:from-[#9c5ee0] hover:to-[#8b4dd1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Learn more about our services
                      </button>
                      <button
                        onClick={() => handleOptionClick("appointment")}
                        className="px-6 py-3 bg-gradient-to-r from-[#af71f1] to-[#9c5ee0] text-white rounded-full font-semibold text-sm hover:from-[#9c5ee0] hover:to-[#8b4dd1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Schedule an appointment
                      </button>
                      <button
                        onClick={() => handleOptionClick("explore")}
                        className="px-6 py-3 bg-gradient-to-r from-[#af71f1] to-[#9c5ee0] text-white rounded-full font-semibold text-sm hover:from-[#9c5ee0] hover:to-[#8b4dd1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Explore website
                      </button>
                    </motion.div>
                  )}

                  {/* Company Info - 4 Step Process Panels */}
                  {showCompanyInfo && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mt-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Step 1: Diagnose */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="bg-gradient-to-br from-[#fbfbfb] to-[#f7efff] p-6 rounded-lg border border-[#af71f1] hover:border-[#9c5ee0] transition-all duration-300"
                        >
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                            <img
                              className="w-8 h-8 object-contain"
                              alt="Diagnose Icon"
                              src={diagnoseIcon}
                            />
                          </div>
                          <h3 className="font-semibold text-lg mb-2 text-[#0c202b]">Diagnose</h3>
                          <p className="text-sm text-gray-700">Our initial consultation is to listen, ask questions, and document every hiccup in your current processes, making sure that there is a problem we can handle.</p>
                        </motion.div>

                        {/* Step 2: Design */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className="bg-gradient-to-br from-[#fbfbfb] to-[#f7efff] p-6 rounded-lg border border-[#af71f1] hover:border-[#9c5ee0] transition-all duration-300"
                        >
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <img
                              className="w-8 h-8 object-contain"
                              alt="Design Icon"
                              src={designIcon}
                            />
                          </div>
                          <h3 className="font-semibold text-lg mb-2 text-[#0c202b]">Design</h3>
                          <p className="text-sm text-gray-700">This stage, we collaborate on the scope of how the work should be handling things, the deliverables of our services, and pricing to fit within a particular budget.</p>
                        </motion.div>

                        {/* Step 3: Deliver */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="bg-gradient-to-br from-[#fbfbfb] to-[#f7efff] p-6 rounded-lg border border-[#af71f1] hover:border-[#9c5ee0] transition-all duration-300"
                        >
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <img
                              className="w-8 h-8 object-contain"
                              alt="Deliver Icon"
                              src={deliverIcon}
                            />
                          </div>
                          <h3 className="font-semibold text-lg mb-2 text-[#0c202b]">Deliver</h3>
                          <p className="text-sm text-gray-700">That means, we execute on developing, iterating, and deploying the solution and your team so that it works for you and your company.</p>
                        </motion.div>

                        {/* Step 4: Direct */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                          className="bg-gradient-to-br from-[#fbfbfb] to-[#f7efff] p-6 rounded-lg border border-[#af71f1] hover:border-[#9c5ee0] transition-all duration-300"
                        >
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <img
                              className="w-8 h-8 object-contain"
                              alt="Direct Icon"
                              src={designIcon}
                            />
                          </div>
                          <h3 className="font-semibold text-lg mb-2 text-[#0c202b]">Direct</h3>
                          <p className="text-sm text-gray-700">Direct is the most critical stage as this pertains to embedding lasting change by training, understanding best practices, and to provided proactive support.</p>
                        </motion.div>
                      </div>

                      {/* Company Follow-up Buttons */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="flex flex-wrap justify-center gap-3"
                      >
                        <button
                          onClick={() => {
                            handleCompanyFollowUp();
                            setShowCompanyInfo(false);
                            setShowNameResponse(true);
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-[#af71f1] to-[#9c5ee0] text-white rounded-full font-semibold text-sm hover:from-[#9c5ee0] hover:to-[#8b4dd1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Learn more about our services
                        </button>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Services Info - Service Cards */}
                  {showServicesInfo && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mt-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {servicesData.map((service, index) => (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                            className="relative w-full h-64 cursor-pointer group"
                            onClick={() => handleServiceClick(service.id)}
                          >
                            <div className="w-full h-full rounded-lg transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl">
                              <div className="bg-gradient-to-br from-[#fbfbfb] to-[#f7efff] rounded-lg p-6 h-full flex flex-col justify-center items-center border border-[#af71f1] hover:border-[#9c5ee0] transition-all duration-300">
                                {!flippedCards.has(service.id) ? (
                                  // Front of card - Title and emoji
                                  <>
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ${
                                      service.id === 'general-it' ? 'bg-red-100' :
                                      service.id === 'agentic-ai' ? 'bg-blue-100' :
                                      service.id === 'automation' ? 'bg-green-100' :
                                      'bg-purple-100'
                                    }`}>
                                      <img
                                        className="w-8 h-8 object-contain"
                                        alt={`${service.title} Icon`}
                                        src={service.icon}
                                      />
                                    </div>
                                    <h3 className="font-semibold text-lg text-center text-[#0c202b] group-hover:text-[#af71f1] transition-colors duration-300">
                                      {service.title}
                                    </h3>
                                  </>
                                ) : (
                                  // Back of card - Description
                                  <p className="text-sm text-gray-700 text-center leading-relaxed">
                                    {service.description}
                                  </p>
                                )}
                                {selectedServices.has(service.id) && (
                                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Service Follow-up Buttons */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="flex flex-wrap justify-center gap-3"
                      >
                        <button
                          onClick={handleScheduleClick}
                          className="px-6 py-3 bg-gradient-to-r from-[#af71f1] to-[#9c5ee0] text-white rounded-full font-semibold text-sm hover:from-[#9c5ee0] hover:to-[#8b4dd1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Schedule an appointment
                        </button>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Chat End Reference - Always at the very bottom */}
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
                        className="w-full px-4 py-3 pr-16 bg-gray-50 border border-gray-200 rounded-full text-base placeholder:text-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-[#af71f1] focus:border-transparent"
                        disabled={isLoading}
                      />
                      <button
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                          isListening 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-[#af71f1]'
                        }`}
                        onClick={isListening ? stopListening : startListening}
                        aria-label={isListening ? "Stop listening" : "Start voice input"}
                        type="button"
                        disabled={isLoading}
                      >
                        <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                      </button>
                    </div>
                    {/* Stop Speaking Button */}
                    {isSpeaking && (
                      <button
                        className="w-12 h-12 flex items-center justify-center bg-red-500 rounded-full hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={stopSpeaking}
                        aria-label="Stop speaking"
                        type="button"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    )}
                    
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
                  
                  {/* Listening Indicator */}
                  
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
          
          {/* Voice Chat Widget - Only in chat interface */}
          </LayoutGroup>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatInterface;