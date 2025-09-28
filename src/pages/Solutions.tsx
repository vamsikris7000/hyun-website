import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import spectrumAiLogo from "@/assets/xpectrumai.png";
import goCreateLogo from "@/assets/gocreate.png";
import rectangle1 from "@/assets/rectangle-20355-1.png";
import rectangle2 from "@/assets/rectangle-20355-2.png";
import rectangle3 from "@/assets/rectangle-20355-3.png";
import rectangle4 from "@/assets/rectangle-20355-4.png";
import rectangle5 from "@/assets/rectangle-20355-5.png";
import rectangle6 from "@/assets/rectangle-20355.png";
import vector1 from "@/assets/vector-1.svg";
import vector2 from "@/assets/vector-2.svg";
import vector3 from "@/assets/vector-3.svg";
import vector4 from "@/assets/vector-4.svg";
import vector from "@/assets/vector.svg";

const Solutions = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const solutionsData = [
    {
      id: 1,
      title: "Leadership & Executive Coaching",
      description: null,
      image: rectangle6,
      iconBg: "#af71f1",
      cardBg: "#fbfbfb",
      border: "#af71f1",
      icon: null,
      featured: true,
    },
    {
      id: 2,
      title: "Organizational Culture Transformation",
      description: null,
      image: rectangle1,
      iconBg: "#eff1ff",
      cardBg: "linear-gradient(152deg,rgba(251,251,251,1) 0%,rgba(247,239,255,1) 100%)",
      border: "transparent",
      icon: vector,
    },
    {
      id: 3,
      title: "Strategic Communication Consulting",
      description: null,
      image: rectangle3,
      iconBg: "#ffefef",
      cardBg: "linear-gradient(152deg,rgba(251,251,251,1) 0%,rgba(247,239,255,1) 100%)",
      border: "transparent",
      icon: vector2,
    },
    {
      id: 4,
      title: "Team Development & Facilitation",
      description: null,
      image: rectangle2,
      iconBg: "#eff1ff",
      cardBg: "linear-gradient(152deg,rgba(251,251,251,1) 0%,rgba(247,239,255,1) 100%)",
      border: "transparent",
      icon: vector1,
    },
    {
      id: 5,
      title: "Change Management & Transformation",
      description: null,
      image: rectangle4,
      iconBg: "#f3efff",
      cardBg: "linear-gradient(152deg,rgba(251,251,251,1) 0%,rgba(247,239,255,1) 100%)",
      border: "transparent",
      icon: vector3,
    },
    {
      id: 6,
      title: "DEI Strategy and Implementation",
      description: null,
      image: rectangle5,
      iconBg: "#eff9ff",
      cardBg: "linear-gradient(152deg,rgba(251,251,251,1) 0%,rgba(247,239,255,1) 100%)",
      border: "transparent",
      icon: vector4,
    },
  ];

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
              Solutions
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-48 h-1 bg-gradient-to-r from-[#c0e9ef] to-[#d0a4ff]"></div>
              <h2 className="font-normal text-black text-3xl md:text-4xl lg:text-5xl tracking-[0] leading-tight font-serif">
                <span className="font-semibold">Our Areas of</span>
                <span className="font-semibold italic"> Practice</span>
              </h2>
            </div>
          </div>
        </section>

        {/* Solutions Grid Section */}
        <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
          {/* Background gradients */}
          <div className="absolute w-[1219px] h-[677px] top-0 left-0 opacity-50 hidden lg:block">
            <div className="relative h-[677px]">
              <div className="absolute w-[516px] h-[518px] top-[110px] left-[703px] bg-[#efe9c0] rounded-[258px/259px] blur-[138px]" />
              <div className="absolute w-[614px] h-[616px] top-0 left-[279px] bg-[#d0a4ff] rounded-[307px/308px] blur-[138px]" />
              <div className="absolute w-[614px] h-[616px] top-[61px] left-0 bg-[#c0e9ef] rounded-[307px/308px] blur-[138px]" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Solutions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutionsData.map((solution, index) => (
                <motion.div
                  key={solution.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-[370px] h-[425px] relative mx-auto"
                >
                  <div 
                    className={`w-[370px] h-[425px] rounded-lg relative transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer group ${
                      solution.featured 
                        ? "bg-[#fbfbfb] border border-solid border-[#af71f1] hover:border-[#9c5ee0] hover:shadow-[#af71f1]/20" 
                        : "bg-gradient-to-br from-[#fbfbfb] to-[#f7efff] hover:from-[#f8f8f8] hover:to-[#f0e8ff] hover:shadow-[#d0a4ff]/20"
                    }`}
                    style={{
                      background: solution.cardBg,
                      borderColor: solution.border,
                    }}
                  >
                    {/* Icon */}
                    {solution.icon && (
                      <div 
                        className="absolute w-10 h-10 top-[34px] left-[34px] rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3"
                        style={{ backgroundColor: solution.iconBg }}
                      >
                        <img
                          className="w-6 h-6 transition-all duration-300 ease-in-out group-hover:brightness-110"
                          alt="Icon"
                          src={solution.icon}
                        />
                      </div>
                    )}

                    {/* Title */}
                    <div className="absolute top-[108px] left-[34px] w-[255px]">
                      <h3 className="font-medium text-black text-2xl tracking-[-0.48px] leading-[26.4px] transition-all duration-300 ease-in-out group-hover:text-[#0c202b] group-hover:translate-y-[-2px]">
                        {solution.title}
                      </h3>
                    </div>

                    {/* Description - only for featured card */}
                    {solution.featured && solution.description && (
                      <div className="absolute top-[113px] left-[34px] w-[271px]">
                        <p className="font-normal text-black text-sm tracking-[0] leading-[22.4px]">
                          {solution.description}
                        </p>
                      </div>
                    )}

                    {/* Image */}
                    <img
                      className="absolute w-[370px] h-[222px] top-[203px] left-0 object-cover rounded-b-lg transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-110"
                      alt="Solution"
                      src={solution.image}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
          {/* Background gradients */}
          <div className="absolute w-[1219px] h-[677px] top-0 left-0 opacity-50 hidden lg:block">
            <div className="relative h-[677px]">
              <div className="absolute w-[516px] h-[518px] top-[110px] left-[703px] bg-[#efe9c0] rounded-[258px/259px] blur-[138px]" />
              <div className="absolute w-[614px] h-[616px] top-0 left-[279px] bg-[#d0a4ff] rounded-[307px/308px] blur-[138px]" />
              <div className="absolute w-[614px] h-[616px] top-[61px] left-0 bg-[#c0e9ef] rounded-[307px/308px] blur-[138px]" />
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="font-normal text-black text-3xl md:text-4xl lg:text-5xl tracking-[0] leading-tight font-serif mb-6">
              <span className="font-semibold">Ready to transform </span>
              <span className="font-semibold italic">your organization?</span>
            </h2>
            <p className="font-normal text-black text-lg text-center tracking-[0] leading-[28.8px] mb-8">
              Let's discuss how our solutions can help you achieve your goals.
            </p>
            <Button 
              onClick={() => setIsChatOpen(true)}
              className="bg-[#0c202b] inline-flex items-center justify-center gap-2.5 rounded px-7 py-[15px] text-white font-semibold text-[15px] hover:bg-[#0c202b]/90"
            >
              📞 GET STARTED
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
    </div>
  );
};

export default Solutions;
