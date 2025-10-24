import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import spectrumAiLogo from "@/assets/xpectrumai.png";
import aiIcon from "@/assets/AI Icon.jpg";
import automationIcon from "@/assets/automation icon.jpg";
import dataTransformationIcon from "@/assets/Data Transformation Icon.png";
import deliverIcon from "@/assets/Deliver.jpeg";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(true); // Set to true to show chatbot by default
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="bg-white w-full max-w-[1600px] mx-auto relative">

        {/* Header */}
        <Header onBookDemo={() => setIsChatOpen(true)} />

        {/* Hero Section */}
        <section id="home" className="relative w-full min-h-screen flex items-center justify-center pt-32">
          {/* Background gradients */}
          <div className="absolute w-[1219px] h-[677px] top-[210px] right-0 hidden lg:block">
            <div className="relative h-[677px]">
              <div className="absolute w-[516px] h-[518px] top-[110px] left-[703px] bg-[#efe9c0] rounded-[258px/259px] blur-[138px]" />
              <div className="absolute w-[614px] h-[616px] top-0 left-[279px] bg-[#d0a4ff] rounded-[307px/308px] blur-[138px]" />
              <div className="absolute w-[614px] h-[616px] top-[61px] left-0 bg-[#c0e9ef] rounded-[307px/308px] blur-[138px]" />
            </div>
          </div>

          {/* Hero Content */}
          <div className="flex flex-col w-full max-w-[869px] items-start gap-[68px] px-4 lg:px-8">
            <h1 className="relative self-stretch font-normal text-black text-[60px] md:text-[80px] lg:text-[90px] tracking-[0] leading-[60px] md:leading-[80px] lg:leading-[90px] font-serif">
              <span className="font-semibold">Let innovative technologies work for you.</span>
            </h1>

            <div className="inline-flex items-center gap-[30px] relative flex-[0_0_auto] flex-col sm:flex-row">
              <Button 
                onClick={() => setIsChatOpen(true)}
                className="px-7 py-[15px] bg-[#0c202b] inline-flex items-center justify-center gap-2.5 rounded text-white font-semibold text-[15px] hover:bg-[#0c202b]/90"
              >
                <span className="text-xl">»</span>
                GET STARTED
              </Button>

              <button 
                className="inline-flex flex-col items-start gap-0.5 relative flex-[0_0_auto] bg-transparent border-none cursor-pointer"
                onClick={() => window.open('https://outlook.office.com/bookwithme/user/719f78311287410ab589cb1be4871a00@hyunandassociatesllc.com?anonymous&ismsaljsauthenabled&ep=bwmEmailSignature', '_blank')}
              >
                <div className="flex items-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
                  <span className="relative w-3.5 h-6 text-[#0c202b] text-xl">▶</span>
                  <div className="relative w-fit font-semibold text-[#0c202b] text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                    VIEW DEMO
                  </div>
                </div>
                <div className="relative self-stretch w-full h-px mb-[-0.50px] bg-[#0c202b] opacity-30" />
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16 max-w-6xl mx-auto">
            <div className="flex flex-col w-full lg:w-1/2">
              <div className="flex items-center mb-8">
                <span className="text-base font-semibold tracking-[6.40px] text-[#9e9e9e] uppercase">ABOUT</span>
                <div className="flex-1 ml-4">
                  <div className="h-0.5 bg-gradient-to-r from-[#c0e9ef] to-[#d0a4ff]"></div>
                </div>
              </div>
              <h2 className="font-normal text-black text-2xl lg:text-3xl tracking-[0] leading-tight mb-6 font-serif">
                Our mission is to let innovative technologies work for businesses{" "}
                <span className="italic">by solving their core IT processing challenges.</span>
              </h2>
            </div>
            
            <div className="flex flex-col w-full lg:w-1/2 gap-6">
              <p className="font-normal text-black text-lg tracking-[0] leading-[28.8px]">
                We incorporate our four-step process and utilize technologies that enable businesses to
                focus on what truly matters. Our four main areas of focus:
              </p>
              <ul className="font-normal text-black text-lg tracking-[0] leading-[28.8px] list-disc list-inside space-y-2">
                <li>General IT Consulting</li>
                <li>Agentic AI Solutions</li>
                <li>Automation Solutions</li>
                <li>Data Transformation Solutions</li>
              </ul>
              <Button 
                variant="outline"
                onClick={() => navigate('/about')}
                className="px-7 py-[15px] border border-solid border-[#0c202b] inline-flex items-center justify-center gap-2.5 rounded font-semibold text-[#0c202b] text-[15px] hover:bg-[#0c202b]/5 w-fit"
              >
                <span className="text-xl">»</span>
                MORE ABOUT US
              </Button>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="py-20 px-4 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-semibold text-[#9e9e9e] tracking-[6.40px] leading-4 text-sm mb-4">SOLUTIONS</p>
              <h2 className="font-normal text-black text-3xl md:text-4xl lg:text-5xl tracking-[0] leading-tight font-serif">
                <span className="font-semibold">Our Areas of Practice</span>
              </h2>
            </div>

            {/* Services Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* General IT Consulting */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onClick={() => setExpandedCard(expandedCard === 1 ? null : 1)}
                className="relative w-full h-[348px] bg-gradient-to-br from-[#fbfbfb] to-[#f7efff] rounded-lg p-8 flex flex-col transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-[#d0a4ff]/30 hover:bg-gradient-to-br hover:from-[#f0f0f0] hover:to-[#e8d5ff] hover:-translate-y-1 cursor-pointer group"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-8 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3">
                  <img
                    className="w-10 h-10"
                    alt="Icon"
                    src={deliverIcon}
                  />
                </div>
                <div className="font-semibold text-black text-2xl tracking-[-0.40px] leading-[28px] mb-6 transition-all duration-300 ease-in-out group-hover:text-[#0c202b] group-hover:translate-y-[-2px] text-center">
                  General IT Consulting
                </div>
                <motion.div 
                  initial={false}
                  animate={{ 
                    opacity: expandedCard === 1 ? 1 : 0,
                    height: expandedCard === 1 ? "auto" : 0,
                    marginTop: expandedCard === 1 ? 0 : -20
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="font-normal text-black text-base tracking-[0] leading-[24px] text-center">
                    We help businesses, entrepreneurs, or employees utilize unique hardware or software solutions to help drive efficiency and productivity.
                  </div>
                </motion.div>
                {expandedCard !== 1 && (
                  <div className="mt-auto text-center">
                    <div className="text-sm text-gray-500 font-medium">Click to learn more</div>
                  </div>
                )}
              </motion.div>

              {/* Agentic AI Solutions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={() => setExpandedCard(expandedCard === 2 ? null : 2)}
                className="relative w-full h-[348px] bg-gradient-to-br from-[#fbfbfb] to-[#f7efff] rounded-lg p-8 flex flex-col transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-[#d0a4ff]/30 hover:bg-gradient-to-br hover:from-[#f0f0f0] hover:to-[#e8d5ff] hover:-translate-y-1 cursor-pointer group"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-8 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3">
                  <img
                    className="w-10 h-10"
                    alt="Icon"
                    src={aiIcon}
                  />
                </div>
                <div className="font-semibold text-black text-2xl tracking-[-0.40px] leading-[28px] mb-6 transition-all duration-300 ease-in-out group-hover:text-[#0c202b] group-hover:translate-y-[-2px] text-center">
                  Agentic AI Solutions
                </div>
                <motion.div 
                  initial={false}
                  animate={{ 
                    opacity: expandedCard === 2 ? 1 : 0,
                    height: expandedCard === 2 ? "auto" : 0,
                    marginTop: expandedCard === 2 ? 0 : -20
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="font-normal text-black text-base tracking-[0] leading-[24px] text-center">
                    Our premier solution that incorporates a unique and custom AI experience that can execute tasks so that you don't have to.
                  </div>
                </motion.div>
                {expandedCard !== 2 && (
                  <div className="mt-auto text-center">
                    <div className="text-sm text-gray-500 font-medium">Click to learn more</div>
                  </div>
                )}
              </motion.div>

              {/* Automation Solutions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onClick={() => setExpandedCard(expandedCard === 3 ? null : 3)}
                className="relative w-full h-[348px] bg-gradient-to-br from-[#fbfbfb] to-[#f7efff] rounded-lg p-8 flex flex-col transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-[#d0a4ff]/30 hover:bg-gradient-to-br hover:from-[#f0f0f0] hover:to-[#e8d5ff] hover:-translate-y-1 cursor-pointer group"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-8 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3">
                  <img
                    className="w-10 h-10"
                    alt="Icon"
                    src={automationIcon}
                  />
                </div>
                <div className="font-semibold text-black text-2xl tracking-[-0.40px] leading-[28px] mb-6 transition-all duration-300 ease-in-out group-hover:text-[#0c202b] group-hover:translate-y-[-2px] text-center">
                  Automation Solutions
                </div>
                <motion.div 
                  initial={false}
                  animate={{ 
                    opacity: expandedCard === 3 ? 1 : 0,
                    height: expandedCard === 3 ? "auto" : 0,
                    marginTop: expandedCard === 3 ? 0 : -20
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="font-normal text-black text-base tracking-[0] leading-[24px] text-center">
                    Our most cost effective solution. If you have a repetitious tasks, we can incorporate robotic processes to execute them for you.
                  </div>
                </motion.div>
                {expandedCard !== 3 && (
                  <div className="mt-auto text-center">
                    <div className="text-sm text-gray-500 font-medium">Click to learn more</div>
                  </div>
                )}
              </motion.div>

              {/* Data Transformation Solutions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                onClick={() => setExpandedCard(expandedCard === 4 ? null : 4)}
                className="relative w-full h-[348px] bg-gradient-to-br from-[#fbfbfb] to-[#f7efff] rounded-lg p-8 flex flex-col transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-[#d0a4ff]/30 hover:bg-gradient-to-br hover:from-[#f0f0f0] hover:to-[#e8d5ff] hover:-translate-y-1 cursor-pointer group"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-8 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3">
                  <img
                    className="w-10 h-10"
                    alt="Icon"
                    src={dataTransformationIcon}
                  />
                </div>
                <div className="font-semibold text-black text-2xl tracking-[-0.40px] leading-[28px] mb-6 transition-all duration-300 ease-in-out group-hover:text-[#0c202b] group-hover:translate-y-[-2px] text-center">
                  Data Transformation Solutions
                </div>
                <motion.div 
                  initial={false}
                  animate={{ 
                    opacity: expandedCard === 4 ? 1 : 0,
                    height: expandedCard === 4 ? "auto" : 0,
                    marginTop: expandedCard === 4 ? 0 : -20
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="font-normal text-black text-base tracking-[0] leading-[24px] text-center">
                    The most productive way to consolidate data and bring analytics that matters.
                  </div>
                </motion.div>
                {expandedCard !== 4 && (
                  <div className="mt-auto text-center">
                    <div className="text-sm text-gray-500 font-medium">Click to learn more</div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section id="partners" className="py-20 px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-16">
              <span className="text-base font-semibold tracking-[6.40px] text-[#9e9e9e] uppercase">PARTNERS</span>
              <div className="flex-1 ml-4">
                <div className="h-0.5 bg-gradient-to-r from-[#c0e9ef] to-[#d0a4ff]"></div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-center text-center max-w-xs">
                <img
                  src={spectrumAiLogo}
                  alt="Spectrum AI"
                  className="h-16 mb-4 object-contain mix-blend-darken"
                />
                <p className="font-normal text-black text-lg tracking-[0] leading-[28.8px]">
                  Intelligent VOIP AI &amp; Workflow Automation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 px-4 lg:px-8 relative overflow-hidden">
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
              <span className="font-semibold">Let's innovate your business and change the way you work.</span>
            </h2>
            <p className="font-normal text-black text-lg text-center tracking-[0] leading-[28.8px] mb-8">
              Reach out to Hyun & Associates now.
            </p>
            <Button 
              onClick={() => window.open('https://outlook.office.com/bookwithme/user/719f78311287410ab589cb1be4871a00@hyunandassociatesllc.com?anonymous&ismsaljsauthenabled&ep=bwmEmailSignature', '_blank')}
              className="bg-[#0c202b] inline-flex items-center justify-center gap-2.5 rounded px-7 py-[15px] text-white font-semibold text-[15px] hover:bg-[#0c202b]/90"
            >
              📞 Schedule Now
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
            </div>
          </div>
        </footer>
      </div>

      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;