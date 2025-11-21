import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Smartphone, Globe } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  amount: string;
}

const PaymentOption = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 flex items-center gap-4 transition-all group"
  >
    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
      <Icon size={20} />
    </div>
    <span className="text-gray-700 font-bold text-lg">{label}</span>
  </button>
);

export const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, amount }: PaymentModalProps) => {
  const handlePayment = () => {
    // Simulate processing
    setTimeout(() => {
      onPaymentSuccess();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[2rem] p-6 pb-12 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
                <p className="text-brand font-bold text-lg">Total: ${amount}</p>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <PaymentOption icon={Globe} label="PayPal" onClick={handlePayment} />
              <PaymentOption icon={Smartphone} label="Apple Pay" onClick={handlePayment} />
              <PaymentOption icon={CreditCard} label="Credit Card" onClick={handlePayment} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
