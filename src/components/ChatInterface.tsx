import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Send, X, Star, Bot, User, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import aLogo from "@/assets/A.png";
import hyunLogo from "@/assets/hyunandassociates.png";
import haLogo from "@/assets/HA.png";
import fullLogo from "@/assets/FullLogo_Transparent1.png";

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
  const [chat, setChat] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [conversationId, setConversationId] = useState<string>("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [error, setError] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<{name: string, isReturning: boolean} | null>(null);
  const [showNameResponse, setShowNameResponse] = useState(false);
  const [detectedName, setDetectedName] = useState<string>("");
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);
  const [showServicesInfo, setShowServicesInfo] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [serviceCounts, setServiceCounts] = useState<{[key: string]: number}>({});
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [dynamicCards, setDynamicCards] = useState<Array<{id: string, title: string, description: string, type: string}>>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What services do you offer?",
    "How do I schedule a consultation?",
    "Tell me about your AI solutions",
    "What makes you different from competitors?"
  ];

  const servicesData = [
    {
      id: "general-it",
      title: "General IT Consulting",
      description: "We help businesses, entrepreneurs, or employees utilize unique hardware or software solutions to help drive efficiency and productivity.",
      image: "/src/assets/Deliver.jpeg"
    },
    {
      id: "agentic-ai",
      title: "Agentic AI Solutions",
      description: "Our premier solution that incorporates a unique and custom AI experience that can execute tasks so that you don't have to.",
      image: "/src/assets/AI Icon.jpg"
    },
    {
      id: "automation",
      title: "Automation Solutions",
      description: "Our most cost effective solution. If you have a repetitious tasks, we can incorporate robotic processes to execute them for you.",
      image: "/src/assets/automation icon.jpg"
    },
    {
      id: "data-transformation",
      title: "Data Transformation Solutions",
      description: "The most productive way to consolidate data and bring analytics that matters.",
      image: "/src/assets/Data Transformation Icon.png"
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

  const handleServiceClick = (serviceId: string) => {
    const service = servicesData.find(s => s.id === serviceId);
    if (!service) return;

    // Update service counts
    setServiceCounts(prev => ({
      ...prev,
      [serviceId]: (prev[serviceId] || 0) + 1
    }));

    // Add to selected services
    setSelectedServices(prev => new Set([...prev, serviceId]));

    // Flip the card
    setFlippedCards(prev => new Set([...prev, serviceId]));

    // Add user message
    setChat(prev => [...prev, { role: 'user', text: service.title }]);
    
    // Add bot response
    setChat(prev => [...prev, { role: 'bot', text: service.description }]);
    
    // Speak the response
    speakText(service.description);

    // Show follow-up options after a delay
    setTimeout(() => {
      showServiceFollowUp();
    }, 3000);
  };

  const showServiceFollowUp = () => {
    const selectedCount = selectedServices.size;
    const totalServices = servicesData.length;
    const hasMultipleSelections = Object.values(serviceCounts).some(count => count > 1);
    const personalizedGreeting = userInfo ? `${userInfo.name}, ` : "";
    
    let response = "";
    let showScheduleButton = true;

    if (hasMultipleSelections) {
      const mostSelected = Object.entries(serviceCounts).reduce((a, b) => serviceCounts[a[0]] > serviceCounts[b[0]] ? a : b);
      const service = servicesData.find(s => s.id === mostSelected[0]);
      response = `${personalizedGreeting}Looks like you really want to learn more about ${service?.title}, would you like to talk with our consultant regarding ${service?.title}?`;
    } else if (selectedCount === 1) {
      const service = servicesData.find(s => selectedServices.has(s.id));
      response = `${personalizedGreeting}Since you learned about ${service?.title}, you can respond by saying the other offering or if you want to schedule an appointment, say schedule appointment.`;
    } else if (selectedCount > 1 && selectedCount < totalServices) {
      const serviceNames = Array.from(selectedServices).map(id => servicesData.find(s => s.id === id)?.title).join(' and ');
      response = `${personalizedGreeting}Since you learned more about ${serviceNames}, you can respond by saying the other offering or if you want to schedule an appointment, say schedule appointment.`;
    } else if (selectedCount === totalServices) {
      response = `${personalizedGreeting}Since you went through and learned about all of our offerings, would you like to schedule a time with our consultant?`;
    }

    setChat(prev => [...prev, { role: 'bot', text: response }]);
    speakText(response);
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

  const handleNoResponse = () => {
    const response = "Is there anything more I can help you with?";
    setChat(prev => [...prev, { role: 'user', text: 'No' }]);
    setChat(prev => [...prev, { role: 'bot', text: response }]);
    speakText(response);
  };

  const handleYesResponse = () => {
    const personalizedGreeting = userInfo ? `${userInfo.name}, ` : "";
    const response = `${personalizedGreeting}I'd be happy to help you schedule an appointment. Let me redirect you to our booking system.`;
    setChat(prev => [...prev, { role: 'user', text: 'Yes' }]);
    setChat(prev => [...prev, { role: 'bot', text: response }]);
    speakText(response);
    
    setTimeout(() => {
      window.open('https://outlook.office.com/bookwithme/user/719f78311287410ab589cb1be4871a00@hyunandassociatesllc.com?anonymous&ismsaljsauthenabled&ep=bwmEmailSignature', '_blank');
    }, 2000);
  };

  // Ultra-intelligent function to parse ANY backend response and extract service information
  const parseResponseForServices = (text: string) => {
    const detectedServices: Array<{id: string, title: string, description: string, type: string}> = [];
    let remainingText = text;

    // Multi-layered intelligent detection system
    
    // Layer 1: Advanced Pattern Recognition
    const advancedPatterns = [
      // Structured formats
      /(\*\*[^*]+\*\*):\s*([^.\n]+[.!?]?)/g,
      /([A-Z][A-Za-z\s&]+):\s*([^.\n]+[.!?]?)/g,
      /[•\-\*]\s*([A-Z][A-Za-z\s&]+):\s*([^.\n]+[.!?]?)/g,
      /\d+\.\s*([A-Z][A-Za-z\s&]+):\s*([^.\n]+[.!?]?)/g,
      /(\*[^*]+\*):\s*([^.\n]+[.!?]?)/g,
      // Natural language patterns
      /(we|our|i|my)\s+([^,]+?)(?:,|:|\s+is|\s+are|\s+includes|\s+offers|\s+provides)/gi,
      /(specialize|focus|expert|expertise|capability|capabilities)\s+(?:in|on|with)\s+([^.!?]+)/gi,
      /(offer|provide|deliver|help|assist|support)\s+([^.!?]+)/gi
    ];

    // Layer 2: Contextual Intelligence
    const contextualKeywords = [
      // Business terms
      'solution', 'service', 'offering', 'capability', 'expertise', 'specialization',
      'consulting', 'advisory', 'support', 'implementation', 'deployment', 'integration',
      'optimization', 'transformation', 'automation', 'digitalization', 'modernization',
      // Technology terms
      'ai', 'artificial intelligence', 'machine learning', 'data', 'analytics', 'cloud',
      'cybersecurity', 'software', 'hardware', 'platform', 'system', 'application',
      'database', 'network', 'infrastructure', 'architecture', 'development', 'engineering',
      // Process terms
      'workflow', 'process', 'methodology', 'framework', 'approach', 'strategy',
      'management', 'administration', 'monitoring', 'maintenance', 'support', 'training'
    ];

    // Layer 3: Semantic Analysis Engine
    const analyzeSemanticContent = (text: string) => {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 15);
      const detected = [];

      sentences.forEach(sentence => {
        const trimmed = sentence.trim();
        
        // Calculate service likelihood score
        let serviceScore = 0;
        
        // Check for business/service language patterns
        const businessPatterns = [
          /we (provide|offer|deliver|specialize|focus|help|assist|support)/i,
          /our (services|solutions|offerings|capabilities|expertise)/i,
          /we can (help|assist|support|provide|deliver|implement)/i,
          /(service|solution|offering|capability|expertise|specialization)/i,
          /(consulting|advisory|support|implementation|deployment)/i
        ];
        
        businessPatterns.forEach(pattern => {
          if (pattern.test(trimmed)) serviceScore += 2;
        });
        
        // Check for technology/business keywords
        contextualKeywords.forEach(keyword => {
          if (trimmed.toLowerCase().includes(keyword)) serviceScore += 1;
        });
        
        // Check for action verbs that indicate services
        const actionVerbs = ['provide', 'offer', 'deliver', 'implement', 'develop', 'create', 'build', 'design', 'optimize', 'transform', 'automate', 'integrate'];
        actionVerbs.forEach(verb => {
          if (trimmed.toLowerCase().includes(verb)) serviceScore += 1;
        });
        
        // Check for benefit/outcome language
        const benefitWords = ['improve', 'enhance', 'increase', 'reduce', 'optimize', 'streamline', 'accelerate', 'boost', 'maximize', 'minimize'];
        benefitWords.forEach(word => {
          if (trimmed.toLowerCase().includes(word)) serviceScore += 1;
        });
        
        // If score is high enough, extract service information
        if (serviceScore >= 3 && trimmed.length > 20 && trimmed.length < 300) {
          // Extract service name intelligently
          let serviceName = 'Service';
          
          // Try to extract from common patterns
          const namePatterns = [
            /(?:we|our|i|my)\s+([^,]+?)(?:,|:|\s+is|\s+are)/i,
            /(?:specialize|focus|expert|expertise)\s+(?:in|on|with)\s+([^.!?]+)/i,
            /(?:offer|provide|deliver|help|assist|support)\s+([^.!?]+)/i,
            /([A-Z][A-Za-z\s&]+?)(?:\s+services?|\s+solutions?|\s+consulting)/i
          ];
          
          for (const pattern of namePatterns) {
            const match = trimmed.match(pattern);
            if (match && match[1]) {
              serviceName = match[1].trim();
              break;
            }
          }
          
          // Clean up service name
          serviceName = serviceName
            .replace(/^(we|our|i|my)\s+/i, '')
            .replace(/[.!?]+$/, '')
            .trim();
          
          if (serviceName.length > 3 && serviceName.length < 60) {
            detected.push({
              title: serviceName,
              description: trimmed,
              score: serviceScore
            });
          }
        }
      });
      
      return detected;
    };

    // Layer 4: Pattern-based extraction
    advancedPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const title = match[1].replace(/[*]/g, '').trim();
        const description = match[2] ? match[2].trim() : match[0].trim();
        
        // Intelligent validation
        const hasContextualKeywords = contextualKeywords.some(keyword => 
          title.toLowerCase().includes(keyword) || 
          description.toLowerCase().includes(keyword)
        );
        
        const isValidLength = title.length >= 3 && title.length <= 60 && 
                             description.length >= 10 && description.length <= 250;
        
        const isNotDuplicate = !detectedServices.some(service => 
          service.title.toLowerCase() === title.toLowerCase()
        );
        
        if ((hasContextualKeywords || title.length > 5) && isValidLength && isNotDuplicate) {
          const serviceId = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          detectedServices.push({
            id: serviceId,
            title: title,
            description: description,
            type: 'service'
          });
          
          remainingText = remainingText.replace(match[0], '').trim();
        }
      }
    });

    // Layer 5: Semantic analysis for unstructured content
    if (detectedServices.length === 0) {
      const semanticResults = analyzeSemanticContent(text);
      
      semanticResults.forEach(result => {
        const serviceId = result.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        detectedServices.push({
          id: serviceId,
          title: result.title,
          description: result.description,
          type: 'service'
        });
        
        remainingText = remainingText.replace(result.description, '').trim();
      });
    }

    // Clean up remaining text
    remainingText = remainingText
      .replace(/\n\s*\n/g, '\n')
      .replace(/^\s+|\s+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      services: detectedServices,
      remainingText: remainingText
    };
  };

  // Function to handle dynamic card clicks
  const handleDynamicCardClick = (cardId: string) => {
    const card = dynamicCards.find(c => c.id === cardId);
    if (!card) return;

    // Add user message
    setChat(prev => [...prev, { role: 'user', text: card.title }]);
    
    // Add bot response with more details
    const personalizedGreeting = userInfo ? `${userInfo.name}, ` : "";
    const response = `${personalizedGreeting}${card.description}. Would you like to learn more about this service or explore our other offerings?`;
    setChat(prev => [...prev, { role: 'bot', text: response }]);
    
    // Speak the response
    speakText(response);
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      // Clean the text (remove HTML tags and special characters)
      const cleanText = text.replace(/<[^>]*>/g, '').replace(/[^\w\s.,!?]/g, '');
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      // Function to set voice and speak
      const speakWithVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices count:', voices.length);
        
        // Use specific voice (index 181 - Google US English)
        if (voices.length > 181 && voices[181]) {
          utterance.voice = voices[181];
          console.log('Using voice:', voices[181].name, voices[181].lang);
        } else {
          // Fallback: try to find Google US English by name
          const googleVoice = voices.find(voice => 
            voice.name.includes('Google') && 
            voice.name.includes('US English')
          );
          if (googleVoice) {
            utterance.voice = googleVoice;
            console.log('Using Google US English voice:', googleVoice.name);
          } else {
            console.log('Voice index 181 not available, using default voice');
            console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
          }
        }
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
      };
      
      // Check if voices are loaded, if not wait for them
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Voices not loaded yet, wait for them
        window.speechSynthesis.onvoiceschanged = () => {
          speakWithVoice();
          // Remove the event listener after first use
          window.speechSynthesis.onvoiceschanged = null;
        };
      } else {
        // Voices already loaded
        speakWithVoice();
      }
    }
  };

  // Stop speaking function
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Speech-to-text functions
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = false;
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
        setMessage(prev => prev + finalTranscript);
        console.log('Final transcript:', finalTranscript);
      } else if (interimTranscript) {
        // Show interim results in a temporary way
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
      setIsListening(false);
      console.log('Speech recognition ended');
    };

    setRecognition(recognitionInstance);
    recognitionInstance.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

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
      setDynamicCards([]);
      // Stop any ongoing speech recognition
      if (recognition) {
        recognition.stop();
        setIsListening(false);
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
               
                // Parse the response for services and create dynamic cards
                const parsedResponse = parseResponseForServices(fullText);
                
                if (parsedResponse.services.length > 0) {
                  // Add the remaining text as the bot message
                  setChat((prev) => [...prev, { role: 'bot', text: parsedResponse.remainingText }]);
                  
                  // Set the dynamic cards for display
                  setDynamicCards(parsedResponse.services);
                  
                  // Speak the remaining text (without the service descriptions)
                  speakText(parsedResponse.remainingText);
                } else {
                  // No services detected, add full text as normal
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
    // Don't set showWelcome to false - keep in initial state
  };

  // Safe HTML rendering function with sanitization
  const renderSafeHTML = (text: string, showCursor: boolean = false) => {
    // Configure marked to disable math rendering to avoid KaTeX quirks mode warning
    const parsedHTML = marked.parse(text, {
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
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Ultra-Intelligent Dynamic Service Cards from ANY Backend Response */}
                  {dynamicCards.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[85%] w-full">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="mb-4"
                        >
                          <div className="flex items-center gap-2 text-sm text-[#af71f1] font-medium">
                            <div className="w-2 h-2 bg-[#af71f1] rounded-full animate-pulse"></div>
                            <span>Intelligently detected services</span>
                          </div>
                        </motion.div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {dynamicCards.map((card, index) => (
                            <motion.div
                              key={card.id}
                              initial={{ opacity: 0, y: 20, scale: 0.95, rotateX: -15 }}
                              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                              transition={{ 
                                duration: 0.5, 
                                delay: 0.1 + index * 0.1,
                                type: "spring",
                                stiffness: 100,
                                damping: 15
                              }}
                              className="relative w-full h-52 cursor-pointer group perspective-1000"
                              onClick={() => handleDynamicCardClick(card.id)}
                            >
                              <div className="w-full h-full rounded-xl transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-2xl group-hover:-translate-y-2">
                                <div className="bg-gradient-to-br from-white via-[#faf9ff] to-[#f0ebff] rounded-xl p-6 h-full flex flex-col justify-between border border-[#e0d4ff] hover:border-[#af71f1] transition-all duration-500 shadow-lg group-hover:shadow-xl">
                                  {/* Header with icon and title */}
                                  <div className="flex items-start gap-3 mb-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#af71f1] to-[#9c5ee0] rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                                      <span className="text-white font-bold text-lg">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-bold text-lg text-[#0c202b] group-hover:text-[#af71f1] transition-colors duration-300 leading-tight">
                                        {card.title}
                                      </h3>
                                    </div>
                                  </div>
                                  
                                  {/* Description */}
                                  <div className="flex-1 mb-4">
                                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-4 group-hover:text-gray-800 transition-colors duration-300">
                                      {card.description}
                                    </p>
                                  </div>
                                  
                                  {/* Interactive footer */}
                                  <div className="flex items-center justify-between">
                                    <div className="text-xs text-[#af71f1] font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                      Click to explore
                                    </div>
                                    <div className="w-6 h-6 bg-gradient-to-br from-[#af71f1] to-[#9c5ee0] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                  </div>
                                  
                                  {/* Hover effect overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-br from-[#af71f1]/5 to-[#9c5ee0]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
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
                  
                  <div ref={chatEndRef} />
                  
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
                          className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200"
                        >
                          <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-white font-bold text-lg">1</span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2 text-red-800">Diagnose</h3>
                          <p className="text-sm text-red-700">Our initial consultation is to listen, ask questions, and document every hiccup in your current processes, making sure that there is a problem we can handle.</p>
                        </motion.div>

                        {/* Step 2: Design */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200"
                        >
                          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-white font-bold text-lg">2</span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2 text-blue-800">Design</h3>
                          <p className="text-sm text-blue-700">This stage, we collaborate on the scope of how the work should be handling things, the deliverables of our services, and pricing to fit within a particular budget.</p>
                        </motion.div>

                        {/* Step 3: Deliver */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200"
                        >
                          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-white font-bold text-lg">3</span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2 text-green-800">Deliver</h3>
                          <p className="text-sm text-green-700">That means, we execute on developing, iterating, and deploying the solution and your team so that it works for you and your company.</p>
                        </motion.div>

                        {/* Step 4: Direct */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                          className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200"
                        >
                          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-white font-bold text-lg">4</span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2 text-purple-800">Direct</h3>
                          <p className="text-sm text-purple-700">Direct is the most critical stage as this pertains to embedding lasting change by training, understanding best practices, and to provided proactive support.</p>
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
                        <button
                          onClick={handleScheduleClick}
                          className="px-6 py-3 bg-gradient-to-r from-[#af71f1] to-[#9c5ee0] text-white rounded-full font-semibold text-sm hover:from-[#9c5ee0] hover:to-[#8b4dd1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Schedule an appointment
                        </button>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Services Info - Interactive Service Cards */}
                  {showServicesInfo && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mt-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {servicesData.map((service, index) => (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                            className="relative w-full h-48 cursor-pointer"
                            onClick={() => handleServiceClick(service.id)}
                          >
                            <div 
                              className={`w-full h-full rounded-lg transition-all duration-500 ease-in-out ${
                                flippedCards.has(service.id) 
                                  ? 'transform rotate-y-180' 
                                  : 'transform rotate-y-0'
                              }`}
                              style={{ transformStyle: 'preserve-3d' }}
                            >
                              {/* Front of card */}
                              <div 
                                className={`absolute inset-0 w-full h-full ${
                                  flippedCards.has(service.id) ? 'hidden' : 'block'
                                }`}
                              >
                                <div className="bg-gradient-to-br from-[#fbfbfb] to-[#f7efff] rounded-lg p-6 h-full flex flex-col justify-center items-center border border-[#af71f1] hover:shadow-lg transition-shadow">
                                  <div className="w-16 h-16 bg-[#af71f1] rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-white font-bold text-xl">{index + 1}</span>
                                  </div>
                                  <h3 className="font-semibold text-lg text-center text-[#0c202b] mb-2">
                                    {service.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 text-center">
                                    Click to learn more
                                  </p>
                                </div>
                              </div>

                              {/* Back of card - Description */}
                              <div 
                                className={`absolute inset-0 w-full h-full ${
                                  flippedCards.has(service.id) ? 'block' : 'hidden'
                                }`}
                              >
                                <div className="bg-gradient-to-br from-[#af71f1] to-[#9c5ee0] rounded-lg p-6 h-full flex flex-col justify-center text-white">
                                  <h3 className="font-semibold text-lg mb-3 text-center">
                                    {service.title}
                                  </h3>
                                  <p className="text-sm text-center leading-relaxed">
                                    {service.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Dynamic Follow-up Buttons - Show after service interactions */}
                  {showServicesInfo && selectedServices.size > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex flex-wrap justify-center gap-3 mt-4"
                    >
                      <button
                        onClick={handleScheduleClick}
                        className="px-6 py-3 bg-gradient-to-r from-[#af71f1] to-[#9c5ee0] text-white rounded-full font-semibold text-sm hover:from-[#9c5ee0] hover:to-[#8b4dd1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Schedule an appointment
                      </button>
                    </motion.div>
                  )}

                  {/* Yes/No Buttons - Show after specific service follow-up responses */}
                  {chat.length > 0 && (
                    (() => {
                      const lastMessage = chat[chat.length - 1]?.text;
                      const hasMultipleSelections = Object.values(serviceCounts).some(count => count > 1);
                      const selectedCount = selectedServices.size;
                      const totalServices = servicesData.length;
                      
                      // Show Yes/No buttons for multiple selections or all services learned
                      if (hasMultipleSelections || (selectedCount === totalServices && lastMessage?.includes("schedule a time"))) {
                        return (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-wrap justify-center gap-3 mt-4"
                          >
                            <button
                              onClick={handleYesResponse}
                              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold text-sm hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              Yes
                            </button>
                            <button
                              onClick={handleNoResponse}
                              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold text-sm hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              No
                            </button>
                          </motion.div>
                        );
                      }
                      return null;
                    })()
                  )}

                  {/* Final Options - Show after "No" response */}
                  {chat.length > 0 && chat[chat.length - 1]?.text === "Is there anything more I can help you with?" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex flex-wrap justify-center gap-3 mt-4"
                    >
                      <button
                        onClick={() => {
                          setShowCompanyInfo(true);
                          setShowServicesInfo(false);
                          setShowNameResponse(false);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-[#af71f1] to-[#9c5ee0] text-white rounded-full font-semibold text-sm hover:from-[#9c5ee0] hover:to-[#8b4dd1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Learn more about the company
                      </button>
                      <button
                        onClick={() => {
                          setShowServicesInfo(true);
                          setShowCompanyInfo(false);
                          setShowNameResponse(false);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-[#af71f1] to-[#9c5ee0] text-white rounded-full font-semibold text-sm hover:from-[#9c5ee0] hover:to-[#8b4dd1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Learn more about our services
                      </button>
                      <button
                        onClick={handleScheduleClick}
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
                  {isListening && (
                    <div className="flex items-center gap-2 text-red-500 text-sm mb-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span>Listening... Speak now</span>
                    </div>
                  )}
                  
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