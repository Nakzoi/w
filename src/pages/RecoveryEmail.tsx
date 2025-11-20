import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

export default function RecoveryEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSend = () => {
    // Simple email validation check
    if (email.includes("@") && email.includes(".")) {
      // Simulate API call
      setTimeout(() => {
        setIsSuccess(true);
      }, 500);
    }
  };

  return (
    <div className="relative min-h-screen bg-brand overflow-hidden">
      {/* Main Content */}
      <motion.div
        className={cn(
          "min-h-screen flex flex-col px-6 py-8 transition-all duration-500",
          isSuccess ? "blur-md scale-95 opacity-80" : ""
        )}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-center justify-start mb-12">
          <button 
            onClick={() => navigate(-1)} 
            className="text-white p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
            disabled={isSuccess}
          >
            <ArrowLeft size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-4xl font-bold text-white mb-24">Recovery email</h2>

          <div className="w-full relative mb-12">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full bg-transparent border-b-2 border-white/50 focus:border-white text-2xl font-bold text-white pb-2 focus:outline-none transition-colors placeholder-white/30 text-center"
              disabled={isSuccess}
              autoFocus
            />
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <Button 
                variant="outline" 
                onClick={handleSend}
                disabled={!email || isSuccess}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Success Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-brand/40 backdrop-blur-sm px-6"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1 
              }}
              className="mb-8"
            >
              <div className="w-40 h-40 rounded-full border-[6px] border-white flex items-center justify-center bg-white/10 backdrop-blur-md shadow-xl">
                <Check strokeWidth={4} className="w-20 h-20 text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center space-y-2"
            >
              <p className="text-xl text-white font-medium leading-relaxed">
                Please check your email<br />to recover your account
              </p>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                onClick={() => navigate('/auth')}
                className="mt-8 text-white/80 text-sm hover:text-white hover:underline"
              >
                Back to Sign In
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
