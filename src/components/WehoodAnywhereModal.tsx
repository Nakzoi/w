import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, CreditCard, Smartphone, Globe } from "lucide-react";
import { cn } from "../lib/utils";

// Mock Payment Icons/Options
const PaymentOption = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl p-4 flex items-center gap-4 transition-all group"
  >
    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
      <Icon size={20} />
    </div>
    <span className="text-white font-bold text-lg">{label}</span>
  </button>
);

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
        : "bg-white text-black shadow-sm w-24 h-32 opacity-90",
      selected && !isPopular ? "ring-4 ring-brand" : ""
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

interface WehoodAnywhereModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WehoodAnywhereModal = ({ isOpen, onClose }: WehoodAnywhereModalProps) => {
  const [step, setStep] = useState<"select" | "payment" | "success">("select");
  const [selectedPlan, setSelectedPlan] = useState(15);

  const handleCheckout = () => {
    setStep("payment");
  };

  const handlePayment = () => {
    // Simulate payment processing
    setStep("success");
    setTimeout(() => {
      onClose();
      setStep("select"); // Reset for next time
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-brand/85 backdrop-blur-sm px-6"
        >
          {/* Header / Back Button */}
          <div className="absolute top-6 left-6">
            <button 
              onClick={() => step === "select" ? onClose() : setStep("select")} 
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <ArrowLeft size={28} />
            </button>
          </div>

          {step === "select" && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full flex flex-col items-center"
            >
              {/* Top White Section */}
              <div className="w-full max-w-sm bg-white rounded-t-[3rem] pt-12 pb-8 flex flex-col items-center relative z-10">
                <div className="absolute -top-12 w-24 h-24 bg-brand rounded-full flex items-center justify-center border-[6px] border-white shadow-sm">
                   <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15 12L12 22L9 12L12 2Z" fill="white" />
                      </svg>
                   </div>
                </div>
                <h2 className="text-[#002b36] text-2xl font-bold mt-4">Wehood anywhere</h2>
              </div>

              {/* Pricing Cards */}
              <div className="w-full max-w-sm bg-[#002b36] rounded-b-[2rem] pb-12 pt-8 px-4 relative shadow-2xl mb-12">
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

              {/* Checkout Button */}
              <div className="flex flex-col items-center gap-2">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                  onClick={handleCheckout}
                >
                  <div className="w-14 h-14 bg-brand rounded-full flex items-center justify-center">
                    <Check className="text-white w-8 h-8" strokeWidth={3} />
                  </div>
                </motion.button>
                <span className="text-white font-medium">Checkout</span>
              </div>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-full max-w-sm space-y-6"
            >
              <h2 className="text-3xl font-bold text-white text-center mb-8">Select Payment</h2>
              
              <PaymentOption icon={Smartphone} label="Apple Pay" onClick={handlePayment} />
              <PaymentOption icon={Globe} label="PayPal" onClick={handlePayment} />
              <PaymentOption icon={CreditCard} label="Credit Card" onClick={handlePayment} />
            </motion.div>
          )}

          {step === "success" && (
             <motion.div 
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="flex flex-col items-center"
             >
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6">
                  <Check className="text-brand w-16 h-16" strokeWidth={4} />
                </div>
                <h2 className="text-3xl font-bold text-white">Success!</h2>
                <p className="text-white/80 mt-2">You can now change your location.</p>
             </motion.div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
};
