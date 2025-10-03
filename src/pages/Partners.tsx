import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import spectrumAiLogo from "@/assets/xpectrumai.png";
import goCreateLogo from "@/assets/goreate.png";

const Partners = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="bg-white w-full max-w-[1600px] mx-auto relative">
        {/* Header */}
        <Header onBookDemo={() => setIsChatOpen(true)} />

        {/* Hero Section */}
        <section className="relative w-full min-h-screen flex items-center justify-center pt-32">
          {/* Background gradients */}
          <div className="absolute w-[1219px] h-[677px] top-[300px] right-0 opacity-50 hidden lg:block">
            <div className="relative h-[677px]">
              <div className="absolute w-[516px] h-[518px] top-[110px] left-[703px] bg-[#efe9c0] rounded-[258px/259px] blur-[138px]" />
              <div className="absolute w-[614px] h-[616px] top-0 left-[279px] bg-[#d0a4ff] rounded-[307px/308px] blur-[138px]" />
              <div className="absolute w-[614px] h-[616px] top-[61px] left-0 bg-[#c0e9ef] rounded-[307px/308px] blur-[138px]" />
            </div>
          </div>



          {/* Hero Content */}
          <div className="flex flex-col w-full max-w-[1200px] items-start gap-16 px-4 lg:px-8">
            <h1 className="relative self-stretch font-semibold italic text-black text-[60px] md:text-[80px] lg:text-[90px] tracking-[0] leading-[60px] md:leading-[80px] lg:leading-[90px] font-serif">
              Partners
            </h1>

            {/* Partners Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Partner 1 - Spectrum AI */}
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={spectrumAiLogo}
                    alt="Spectrum AI"
                    className="h-12 object-contain mix-blend-darken"
                  />
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-[#c0e9ef] to-[#d0a4ff]"></div>
                </div>
                <p className="font-normal text-black text-lg tracking-[0] leading-[28.8px] mb-6">
                  Xpectrum AI builds a 24/7 Digital Workforce that engages customers across phone, SMS, email, chat, and more — in a more human way. We ensure you never lose leads due to limited working hours and help you generate more revenue. Your growth is our mission.
                </p>
                <button 
                  onClick={() => window.open('https://xpectrum-ai.com/', '_blank')}
                  className="px-7 py-[15px] border border-solid border-[#0c202b] inline-flex items-center justify-center gap-2.5 rounded font-semibold text-[#0c202b] text-[15px] hover:bg-[#0c202b]/5 w-fit cursor-pointer transition-colors relative z-10"
                  style={{ pointerEvents: 'auto' }}
                >
                  <span className="text-xl">»</span>
                  VISIT WEBSITE
                </button>
              </div>

              {/* Partner 2 - GoCreate */}
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={goCreateLogo}
                    alt="GoCreate"
                    className="h-12 object-contain mix-blend-darken"
                  />
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-[#c0e9ef] to-[#d0a4ff]"></div>
                </div>
                <p className="font-normal text-black text-lg tracking-[0] leading-[28.8px] mb-6">
                  Building stunning, custom WordPress websites for authors—designed to
                  showcase your books, grow your email list, and connect with readers.
                  With a focus on clean design, performance, and easy management,
                  GoCreate helps writers establish a powerful online presence that works
                  as hard as they do.
                </p>
                <button 
                  onClick={() => window.open('https://gocoreate.com/', '_blank')}
                  className="px-7 py-[15px] border border-solid border-[#0c202b] inline-flex items-center justify-center gap-2.5 rounded font-semibold text-[#0c202b] text-[15px] hover:bg-[#0c202b]/5 w-fit cursor-pointer transition-colors relative z-10"
                  style={{ pointerEvents: 'auto' }}
                >
                  <span className="text-xl">»</span>
                  VISIT WEBSITE
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
          {/* Background gradients */}
          <div className="absolute w-[1223px] h-[541px] top-0 left-[189px] opacity-70 hidden lg:block">
            <div className="relative h-[541px]">
              <div className="absolute w-[516px] h-[518px] top-[23px] left-[707px] bg-[#efe9c0] rounded-[258px/259px] blur-[168px]" />
              <div className="absolute w-[522px] h-[523px] top-0 left-80 bg-[#d0a4ff] rounded-[261px/261.5px] blur-[168px]" />
              <div className="absolute w-[488px] h-[489px] top-[23px] left-0 bg-[#c0e9ef] rounded-[244px/244.5px] blur-[168px]" />
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="font-normal text-black text-3xl md:text-4xl lg:text-5xl tracking-[0] leading-tight font-serif mb-6">
              <span className="font-semibold">Interested in partnering </span>
              <span className="font-semibold italic">with us?</span>
            </h2>
            <p className="font-normal text-black text-lg text-center tracking-[0] leading-[28.8px] mb-8">
              Let's create impactful solutions together.
            </p>
            <Button 
              onClick={() => window.open('https://outlook.office.com/bookwithme/user/719f78311287410ab589cb1be4871a00@hyunandassociatesllc.com?anonymous&ismsaljsauthenabled&ep=bwmEmailSignature', '_blank')}
              className="bg-[#0c202b] inline-flex items-center justify-center gap-2.5 rounded px-7 py-[15px] text-white font-semibold text-[15px] hover:bg-[#0c202b]/90"
            >
              Schedule Now
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 lg:px-8 bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <p className="opacity-55 font-medium text-black text-sm tracking-[0] leading-[18.9px] mb-4 md:mb-0">
                © 2025 Hyun And Associates Llc. All Rights Reserved.
              </p>

              <div className="inline-flex items-center justify-center gap-2">
                <div className="opacity-55 font-medium text-black text-sm tracking-[0] leading-[normal]">
                  Powered by
                </div>
                <div className="w-[95.06px] h-[19.95px] bg-[#0c202b] rounded text-white text-xs flex items-center justify-center">
                  HYUN
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-8">
              <div className="flex items-center gap-[45px] flex-wrap justify-center">
                <Link to="/" className="text-[15px] font-medium text-[#0c202b] tracking-[0] leading-[normal] hover:opacity-70 transition-opacity">
                  HOME
                </Link>
                <Link to="/solutions" className="font-medium text-[#0c202b] text-[15px] tracking-[0] leading-[normal] hover:opacity-70 transition-opacity">
                  SOLUTIONS
                </Link>
                <Link to="/about" className="font-medium text-[#0c202b] text-[15px] tracking-[0] leading-[normal] hover:opacity-70 transition-opacity">
                  ABOUT US
                </Link>
                <Link to="/partners" className="font-medium text-[#0c202b] text-[15px] tracking-[0] leading-[normal] hover:opacity-70 transition-opacity">
                  PARTNERS
                </Link>
                <Link to="/contact" className="font-medium text-[#0c202b] text-[15px] tracking-[0] leading-[normal] hover:opacity-70 transition-opacity">
                  CONTACT
                </Link>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-[#c0e9ef] to-[#d0a4ff]" />
            </div>

            <div className="flex items-center justify-center gap-[45.88px] mt-8 opacity-35">
              <img
                className="w-[259.24px] h-[55.06px] aspect-[4.71] mix-blend-multiply"
                alt="Spectrum AI"
                src={spectrumAiLogo}
              />
              <img
                className="h-[55.06px] w-auto object-contain mix-blend-multiply"
                alt="GoCreate"
                src={goCreateLogo}
              />
            </div>
          </div>
        </footer>
      </div>

      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Floating Chat Button - Only show when chat is closed */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#0c202b] hover:bg-[#0c202b]/90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
          aria-label="Open chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Partners;
