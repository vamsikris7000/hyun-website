import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import aLogo from "@/assets/A.png";
import haLogo from "@/assets/HA.png";
import hyunLogo from "@/assets/hyunandassociates.png";

interface HeaderProps {
  onBookDemo: () => void;
}

const Header = ({ onBookDemo }: HeaderProps) => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="absolute w-full h-[80px] top-0 left-0 bg-white shadow-[0px_4px_50px_#00000012] z-50"
    >
      <div className="flex w-full max-w-[1170px] items-center justify-between relative top-[15px] left-[180px] px-4 lg:px-0">
        <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
          <img
            src={haLogo}
            alt="HA Logo"
            className="w-[60px] h-[60px] relative mix-blend-multiply object-contain"
          />
          <img
            src={hyunLogo}
            alt="Hyun and Associates Logo"
            className="w-[200px] h-[50px] relative mix-blend-multiply object-contain"
          />
        </div>

        <div className="inline-flex items-center gap-[45px] relative flex-[0_0_auto]">
          <div className="inline-flex items-center gap-[30px] relative flex-[0_0_auto]">
            <a href="/" className="text-base relative w-fit mt-[-1.00px] font-medium text-[#0c202b] tracking-[0] leading-[normal] whitespace-nowrap hover:opacity-70 transition-opacity">
              HOME
            </a>

            <a href="/solutions" className="relative w-fit mt-[-1.00px] font-medium text-[#0c202b] tracking-[0] leading-[normal] text-base whitespace-nowrap hover:opacity-70 transition-opacity">
              SOLUTIONS
            </a>

                        <a href="/about" className="relative w-fit mt-[-1.00px] font-medium text-[#0c202b] tracking-[0] leading-[normal] text-base whitespace-nowrap hover:opacity-70 transition-opacity">
                          ABOUT US
                        </a>

            <a href="/partners" className="relative w-fit mt-[-1.00px] font-medium text-[#0c202b] tracking-[0] leading-[normal] text-base whitespace-nowrap hover:opacity-70 transition-opacity">
              PARTNERS
            </a>

            <a href="/contact" className="text-base relative w-fit mt-[-1.00px] font-medium text-[#0c202b] tracking-[0] leading-[normal] whitespace-nowrap hover:opacity-70 transition-opacity">
              CONTACT
            </a>
          </div>

          <Button 
            onClick={onBookDemo}
            className="px-[26px] py-[15px] bg-[#0c202b] inline-flex items-center justify-center gap-2.5 rounded text-white font-semibold text-base hover:bg-[#0c202b]/90"
          >
            BOOK A DEMO
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;