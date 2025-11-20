import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "../lib/utils";

const PriceCard = ({ 
  days, 
  price, 
  isPopular = false, 
  selected, 
  onClick 
}: { 
  days: number, 
  price: string, 
  isPopular?: boolean, 
  selected: boolean,
  onClick: () => void 
}) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
    className={cn(
      "relative flex flex-col items-center justify-center rounded-xl transition-all duration-300 overflow-hidden",
      isPopular 
        ? "bg-brand text-white shadow-lg scale-110 z-10 w-32 h-40" 
        : "bg-white text-black shadow-sm w-24 h-32 opacity-90"
    )}
  >
    <span className={cn("font-bold", isPopular ? "text-5xl" : "text-3xl")}>
      {days}
    </span>
    <span className={cn("text-sm font-medium mb-1", isPopular ? "text-white/90" : "text-gray-500")}>
      days
    </span>
    <span className={cn("font-bold", isPopular ? "text-xl" : "text-lg")}>
      $ {price}
    </span>
    
    {isPopular && (
      <div className="absolute bottom-2 text-[10px] font-bold tracking-wider text-white/80 uppercase">
        Most Popular
      </div>
    )}
  </motion.button>
);

export default function WehoodAnywhere() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(15);

  return (
    <motion.div 
      className="min-h-screen bg-brand flex flex-col relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      {/* Header */}
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
          <ArrowLeft size={28} />
        </button>
      </div>

      {/* Main Card Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        
        {/* Top White Section */}
        <div className="w-full max-w-sm bg-white rounded-t-[3rem] pt-12 pb-8 flex flex-col items-center relative z-10">
          {/* Floating Icon */}
          <div className="absolute -top-12 w-24 h-24 bg-brand rounded-full flex items-center justify-center border-[6px] border-white shadow-sm">
             <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15 12L12 22L9 12L12 2Z" fill="white" />
                </svg>
             </div>
          </div>

          <h2 className="text-[#002b36] text-2xl font-bold mt-4">Wehood anywhere</h2>
        </div>

        {/* Bottom Dark Section */}
        <div className="w-full max-w-sm bg-[#002b36] rounded-b-[2rem] pb-12 pt-8 px-4 relative shadow-2xl">
          <div className="flex items-center justify-center gap-3">
             <PriceCard 
               days={3} 
               price="1.00" 
               selected={selectedPlan === 3} 
               onClick={() => setSelectedPlan(3)}
             />
             <PriceCard 
               days={15} 
               price="5.00" 
               isPopular 
               selected={selectedPlan === 15} 
               onClick={() => setSelectedPlan(15)}
             />
             <PriceCard 
               days={30} 
               price="10.00" 
               selected={selectedPlan === 30} 
               onClick={() => setSelectedPlan(30)}
             />
          </div>
        </div>

      </div>

      {/* Checkout Button */}
      <div className="pb-12 flex flex-col items-center gap-2">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white shadow-lg"
          onClick={() => alert(`Checkout: $${selectedPlan === 3 ? '1.00' : selectedPlan === 15 ? '5.00' : '10.00'}`)}
        >
          <div className="w-14 h-14 bg-brand rounded-full flex items-center justify-center">
            <Check className="text-white w-8 h-8" strokeWidth={3} />
          </div>
        </motion.button>
        <span className="text-white font-medium">Checkout</span>
      </div>

    </motion.div>
  );
}
