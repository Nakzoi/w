import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { cn } from "../lib/utils";

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: (amount: string, days: number) => void;
}

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
        ? "bg-brand text-white shadow-lg scale-110 z-10 w-28 h-36" 
        : "bg-white text-black shadow-sm w-24 h-28 opacity-90",
      selected && !isPopular ? "ring-4 ring-brand" : ""
    )}
  >
    <span className={cn("font-bold", isPopular ? "text-5xl" : "text-3xl")}>
      {days}
    </span>
    <span className={cn("text-xs font-medium mb-1", isPopular ? "text-white/90" : "text-gray-500")}>
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

export const OfferModal = ({ isOpen, onClose, onProceedToPayment }: OfferModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState(15);

  const handleCheckout = () => {
    const amount = selectedPlan === 3 ? "1.00" : selectedPlan === 15 ? "5.00" : "10.00";
    onProceedToPayment(amount, selectedPlan);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="w-full max-w-sm pointer-events-auto relative">
              
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute -top-12 right-0 text-white p-2 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-md"
              >
                <X size={24} />
              </button>

              {/* Top White Section (Logo) */}
              <div className="bg-white rounded-t-[3rem] pt-10 pb-6 flex flex-col items-center relative z-10">
                <div className="absolute -top-10 w-20 h-20 bg-brand rounded-full flex items-center justify-center border-[6px] border-white shadow-sm">
                   <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15 12L12 22L9 12L12 2Z" fill="white" />
                      </svg>
                   </div>
                </div>
                <h2 className="text-[#002b36] text-xl font-bold mt-2">Extend Post</h2>
              </div>

              {/* Bottom Dark Section (Pricing) */}
              <div className="bg-[#002b36] rounded-b-[2rem] pb-10 pt-6 px-4 relative shadow-2xl">
                <div className="flex items-center justify-center gap-3 mb-8">
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

                {/* Checkout Button */}
                <div className="flex flex-col items-center gap-2">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCheckout}
                    className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                  >
                    <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center">
                      <Check className="text-white w-6 h-6" strokeWidth={3} />
                    </div>
                  </motion.button>
                  <span className="text-white font-medium text-sm">Checkout</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
