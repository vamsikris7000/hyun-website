import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import aLogo from "@/assets/A.png";

const AboutUs = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const valuePropositionItems = [
    {
      id: 1,
      icon: "https://c.animaapp.com/29VIedzy/img/icon@2x.png",
      title: "Insight-Driven Strategy",
      description: "Identifying key challenges and uncover real opportunities for smarter business solutions.",
    },
    {
      id: 2,
      icon: "https://c.animaapp.com/29VIedzy/img/icon-1@2x.png",
      title: "AI & Automation",
      description: "Applying intelligent tech to boost efficiency and enhance customer interactions.",
    },
    {
      id: 3,
      icon: "https://c.animaapp.com/29VIedzy/img/icon-2@2x.png",
      title: "Measurable Outcomes",
      description: "Our solutions drive clear results—better performance, better ROI.",
    },
    {
      id: 4,
      icon: "https://c.animaapp.com/29VIedzy/img/icon-3@2x.png",
      title: "Sustainable Growth",
      description: "We build systems that scale and adapt as your business evolves.",
    },
  ];

  return (
    <div className="bg-white w-full min-h-screen">
      <Header onBookDemo={() => setIsChatOpen(true)} />
      
      {/* Chat Interface */}
      {isChatOpen && (
        <ChatInterface
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="bg-white w-full max-w-[1600px] mx-auto relative">
        {/* Background gradients */}
        <div className="absolute w-[1219px] h-[677px] top-[300px] right-0 opacity-50 hidden lg:block">
          <div className="relative h-[677px]">
            <div className="absolute w-[516px] h-[518px] top-[110px] left-[703px] bg-[#efe9c0] rounded-[258px/259px] blur-[138px]" />
            <div className="absolute w-[614px] h-[616px] top-0 left-[279px] bg-[#d0a4ff] rounded-[307px/308px] blur-[138px]" />
            <div className="absolute w-[614px] h-[616px] top-[61px] left-0 bg-[#c0e9ef] rounded-[307px/308px] blur-[138px]" />
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative w-full min-h-screen flex items-center justify-center pt-32">
          <div className="flex flex-col w-full max-w-[1200px] items-start gap-16 px-4 lg:px-8">
            <h1 className="relative self-stretch font-semibold italic text-black text-[60px] md:text-[80px] lg:text-[90px] tracking-[0] leading-[60px] md:leading-[80px] lg:leading-[90px] font-serif">
              <span className="font-bold">About </span>
              <span className="font-semibold italic">Us</span>
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-48 h-1 bg-gradient-to-r from-[#c0e9ef] to-[#d0a4ff]"></div>
              <h2 className="font-normal text-black text-3xl md:text-4xl lg:text-5xl tracking-[0] leading-tight font-serif">
                <span className="font-semibold">We specialize in helping businesses navigate complexity</span>
                <span className="font-semibold italic"> with clarity.</span>
              </h2>
            </div>

            <p className="font-normal text-[#292929cc] text-lg tracking-[0] leading-[28.8px] max-w-4xl">
              <span className="font-normal text-[#292929cc] text-lg tracking-[0] leading-[28.8px]">
                We go beyond surface-level fixes to create intelligent, scalable
                solutions that truly move the needle. By combining
              </span>
              <span className="font-bold">
                {" "}
                strategic insight with the power of AI and automation
              </span>
              <span className="font-normal text-[#292929cc] text-lg tracking-[0] leading-[28.8px]">
                , we help you optimize operations, improve customer experiences, and
                drive long-term growth.
              </span>
            </p>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {valuePropositionItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center">
                    <img
                      className="w-full h-full object-contain"
                      alt="Icon"
                      src={item.icon}
                    />
                  </div>
                  <h3 className="font-medium text-[#292929] text-2xl tracking-[-0.48px] leading-[26.4px] mb-4">
                    {item.title}
                  </h3>
                  <p className="font-normal text-[#292929cc] text-sm tracking-[0] leading-[22.4px]">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <img
                  className="w-full max-w-[543px] h-auto aspect-[0.76] object-cover rounded-lg"
                  alt="Hyun Suh - CEO and President"
                  src="https://c.animaapp.com/29VIedzy/img/imgi-2-20210923-220847-1.png"
                />
                <p className="mt-4 font-medium text-[#292929] text-xl tracking-[-0.40px] leading-[22.0px] text-center lg:text-left">
                  Hyun Suh - CEO and President
                </p>
              </div>
              
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-48 h-1 bg-gradient-to-r from-[#c0e9ef] to-[#d0a4ff]"></div>
                  <h2 className="font-normal text-black text-3xl md:text-4xl lg:text-5xl tracking-[0] leading-tight font-serif">
                    <span className="font-semibold">Face Behind</span>
                    <br />
                    <span className="font-semibold italic">the Vision</span>
                  </h2>
                </div>
                
                <div className="font-normal text-[#292929cc] text-lg tracking-[0] leading-[28.8px] space-y-4">
                  <p>
                    <span className="font-normal text-[#292929cc] text-lg tracking-[0] leading-[28.8px]">
                      I'm a seasoned managerial and sales professional with almost{" "}
                    </span>
                    <span className="font-semibold">10 years</span>
                    <span className="font-normal text-[#292929cc] text-lg tracking-[0] leading-[28.8px]">
                      {" "}
                      of experience in team leadership and sales across various sectors. I've been recognized for effectively training staff, creating impactful sales strategies, and maintaining lasting client relations. Throughout my career, I've consistently exceeded performance goals and{" "}
                    </span>
                    <span className="font-semibold">maximized operational output</span>
                    <span className="font-normal text-[#292929cc] text-lg tracking-[0] leading-[28.8px]">
                      {" "}
                      with minimal resources.
                    </span>
                  </p>
                  
                  <p>
                    <span className="font-normal text-[#292929cc] text-lg tracking-[0] leading-[28.8px]">
                      My expertise includes financial analysis, technology solutions, statistical analysis, team collaboration and leadership, and interpersonal communication.{" "}
                    </span>
                    <span className="font-semibold">Effective administration</span>
                    <span className="font-normal text-[#292929cc] text-lg tracking-[0] leading-[28.8px]">
                      {" "}
                      in these areas requires strong communication, customer service skills, business acumen, systems analysis, project management, and resource management.
                    </span>
                  </p>
                  
                  <p>
                    <span className="font-normal text-[#292929cc] text-lg tracking-[0] leading-[28.8px]">
                      In my most recent role as{" "}
                    </span>
                    <span className="font-semibold">Sales Manager</span>
                    <span className="font-normal text-[#292929cc] text-lg tracking-[0] leading-[28.8px]">
                      {" "}
                      at Service Corporation International, I facilitated training for new and existing staff, ensuring they were educated on best practices and equipped to exceed sales targets. I analyzed performance metrics and data reports to create optimal sales plans and identify problem areas. I also worked closely with senior leadership and interdepartmental teams to drive business forward with minimal expenditures.
                    </span>
                  </p>
                </div>
                
                <div className="mt-8">
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="px-7 py-[15px] inline-flex items-center justify-center gap-2.5 bg-[#0c202b] rounded hover:bg-[#0c202b]/90 transition-colors duration-200"
                  >
                    <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                      <img
                        className="relative w-6 h-6 aspect-[1]"
                        alt="Frame"
                        src="https://c.animaapp.com/29VIedzy/img/frame.svg"
                      />
                      <div className="relative w-fit font-semibold text-white text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                        CONTACT NOW
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="py-16 px-4 lg:px-8 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-5 mb-6">
                  <img
                    src={aLogo}
                    alt="A Logo"
                    className="w-[112.5px] h-[75px] aspect-[1.5] relative mix-blend-multiply object-contain"
                  />
                  <div className="relative w-[180.68px] h-[46.46px] mix-blend-multiply aspect-[3.89] bg-[#0c202b] rounded text-white flex items-center justify-center text-sm font-semibold">
                    HYUN
                  </div>
                </div>
                <p className="text-[#292929cc] text-base leading-6 max-w-md">
                  We specialize in helping businesses navigate complexity with clarity, 
                  combining strategic insight with AI and automation to drive sustainable growth.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-[#0c202b] text-lg mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#home" className="text-[#292929cc] hover:text-[#0c202b] transition-colors">Home</a></li>
                  <li><a href="/solutions" className="text-[#292929cc] hover:text-[#0c202b] transition-colors">Solutions</a></li>
                  <li><a href="/about" className="text-[#292929cc] hover:text-[#0c202b] transition-colors">About Us</a></li>
                  <li><a href="/partners" className="text-[#292929cc] hover:text-[#0c202b] transition-colors">Partners</a></li>
                  <li><a href="/contact" className="text-[#292929cc] hover:text-[#0c202b] transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-[#0c202b] text-lg mb-4">Contact Info</h3>
                <div className="space-y-2 text-[#292929cc]">
                  <p>Email: info@hyunassociates.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>Address: 123 Business St, City, State 12345</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-12 pt-8 text-center">
              <p className="text-[#292929cc] text-sm">
                © 2024 Hyun and Associates LLC. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AboutUs;
