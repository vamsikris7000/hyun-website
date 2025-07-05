import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import spectrumAiLogo from "@/assets/spectrum-ai-logo.png";
import goCreateLogo from "@/assets/gocreate-logo.png";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 80, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -50, scale: 0.95 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const premiumVariants = {
    initial: { opacity: 0, y: 100, rotateX: 15 },
    animate: { opacity: 1, y: 0, rotateX: 0 },
    exit: { opacity: 0, y: -80, rotateX: -10 },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  };

  const services = [
    {
      title: "Organizational Culture Transformation",
      description: "Transform your workplace culture for better engagement and results.",
      icon: "🏢"
    },
    {
      title: "Strategic Communication Consulting",
      description: "Develop clear communication strategies that drive business success.",
      icon: "💬"
    },
    {
      title: "Team Development & Facilitation",
      description: "Build stronger, more effective teams through targeted development.",
      icon: "👥"
    },
    {
      title: "DEI Strategy and Implementation",
      description: "Create inclusive environments that harness diversity for innovation.",
      icon: "🤝"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onBookDemo={() => setIsChatOpen(true)} />
      
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end pt-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl lg:text-6xl font-light text-foreground mb-6">
              Consulting made easy
            </h1>
            <h2 className="text-5xl lg:text-6xl font-light text-foreground mb-8">
              for real strategic <em className="italic">growth.</em>
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                onClick={() => setIsChatOpen(true)}
                className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3"
              >
                ✓ GET STARTED
              </Button>
              <Button 
                variant="ghost"
                className="text-foreground hover:bg-foreground/10 px-8 py-3"
              >
                ▶ View Demo
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            {/* Placeholder for hero image/graphic */}
            <div className="w-full h-96 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"></div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            exit="exit"
            viewport={{ once: false, margin: "-80px", amount: 0.3 }}
            variants={staggerChildren}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={premiumVariants}>
              <p className="text-sm font-medium tracking-[0.3em] text-muted-foreground mb-8">ABOUT</p>
            </motion.div>
            
            <motion.div variants={premiumVariants} className="lg:col-start-2">
              <h3 className="text-3xl lg:text-4xl font-light text-foreground mb-6">
                We specialize in helping businesses navigate complexity <em className="italic">with clarity.</em>
              </h3>
              
              <p className="text-muted-foreground mb-8 leading-relaxed">
                By combining strategic insight with the power of artificial intelligence and automation, we design customized solutions that improve operations, enhance customer engagement, and drive measurable results.
              </p>
              
              <Button 
                variant="outline"
                className="border-foreground/20 text-foreground hover:bg-foreground/5"
              >
                ↗ MORE ABOUT US
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            exit="exit"
            viewport={{ once: false, margin: "-80px", amount: 0.2 }}
            variants={staggerChildren}
          >
            <motion.div variants={premiumVariants} className="text-center mb-16">
              <p className="text-sm font-medium tracking-[0.3em] text-muted-foreground mb-4">SOLUTIONS</p>
              <h3 className="text-3xl lg:text-4xl font-light text-foreground">
                Our Areas of <em className="italic">Practice</em>
              </h3>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={premiumVariants}
                  custom={index}
                >
                  <Card className="p-6 h-full bg-card hover:shadow-lg transition-shadow duration-300">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h4 className="text-lg font-medium text-foreground mb-3">
                      {service.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            exit="exit"
            viewport={{ once: false, margin: "-80px", amount: 0.3 }}
            variants={staggerChildren}
          >
            <motion.div variants={premiumVariants} className="mb-16">
              <p className="text-sm font-medium tracking-[0.3em] text-muted-foreground mb-8">PARTNERS</p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div variants={premiumVariants} className="flex flex-col items-start">
                <img 
                  src={spectrumAiLogo} 
                  alt="Spectrum AI" 
                  className="h-16 mb-4 object-contain"
                />
                <p className="text-muted-foreground">Intelligent VOIP AI & Workflow Automation</p>
              </motion.div>
              
              <motion.div variants={premiumVariants} className="flex flex-col items-start">
                <img 
                  src={goCreateLogo} 
                  alt="GoCreate.me" 
                  className="h-16 mb-4 object-contain"
                />
                <p className="text-muted-foreground">Interactive tools and digital experiences.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            exit="exit"
            viewport={{ once: false, margin: "-80px", amount: 0.3 }}
            variants={staggerChildren}
          >
            <motion.h3 variants={premiumVariants} className="text-3xl lg:text-4xl font-light text-foreground mb-4">
              Let's transform your challenges
            </motion.h3>
            <motion.h4 variants={premiumVariants} className="text-3xl lg:text-4xl font-light text-foreground mb-8">
              into <em className="italic">opportunities.</em>
            </motion.h4>
            
            <motion.p variants={premiumVariants} className="text-muted-foreground mb-8">
              Reach out to Hyun and Associates LLC now.
            </motion.p>
            
            <motion.div variants={premiumVariants}>
              <Button 
                onClick={() => setIsChatOpen(true)}
                className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3"
              >
                📞 CONTACT NOW
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <a href="#home" className="text-muted-foreground hover:text-foreground transition-colors">HOME</a>
            <a href="#solutions" className="text-muted-foreground hover:text-foreground transition-colors">SOLUTIONS</a>
            <a href="#partners" className="text-muted-foreground hover:text-foreground transition-colors">PARTNERS</a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">CONTACT</a>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-2xl font-light text-muted-foreground mb-4">Hyun and Associates LLC</p>
            <p className="text-sm text-muted-foreground">© 2024 Hyun and Associates LLC. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;