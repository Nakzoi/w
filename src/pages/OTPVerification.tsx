import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp } = useAuth();
  const phone = location.state?.phone || "+852 6291 6962";
  
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Auto-submit when 4 digits are entered
  useEffect(() => {
    const code = otp.join("");
    if (code.length === 4) {
      handleVerification(code);
    }
  }, [otp]);

  const handleVerification = async (code: string) => {
    setIsVerifying(true);
    
    // Call AuthContext verify (handles both Real Supabase and Simulation)
    const { error } = await verifyOtp(phone, code);
    
    setIsVerifying(false);

    if (error) {
        // In simulation, we might ignore error for demo flow if needed, 
        // but here we alert to show "Real" validation logic
        if (!error.message.includes("Invalid code")) {
             alert("Verification failed: " + error.message);
        }
        // Note: For simulation, verifyOtp returns success for any 4 digits
        // so we proceed to success screen below if no error.
    } 
    
    if (!error) {
        setIsSuccess(true);
        setTimeout(() => {
            navigate("/register");
        }, 2000);
    }
  };

  return (
    <div className="relative min-h-screen bg-brand overflow-hidden">
      <motion.div
        className={cn(
          "min-h-screen flex flex-col px-6 py-8 transition-all duration-500",
          isSuccess ? "blur-md scale-95 opacity-80" : ""
        )}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <div className="flex items-center justify-start mb-12">
          <button 
            onClick={() => navigate(-1)} 
            className="text-white p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
            disabled={isSuccess}
          >
            <ArrowLeft size={28} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center pt-10">
          <h2 className="text-2xl font-medium text-white text-center mb-2">
            Enter the 4 digits code
          </h2>
          <h2 className="text-2xl font-medium text-white text-center mb-8">
            sent to your phone
          </h2>

          <p className="text-xl text-white font-medium mb-16">
            {phone}
          </p>

          <div className="relative mb-20">
            {isVerifying ? (
               <div className="flex flex-col items-center justify-center h-14 text-white/80">
                  <Loader2 className="animate-spin mb-2" />
                  <span className="text-sm">Verifying...</span>
               </div>
            ) : (
              <div className="flex gap-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isSuccess || isVerifying}
                    className="w-14 h-14 bg-transparent border-b-4 border-white/50 focus:border-white text-4xl font-bold text-white text-center focus:outline-none transition-colors caret-white disabled:opacity-50"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="text-center space-y-1">
            <p className="text-white/90 font-medium">Didn't receive the code?</p>
            <button className="text-white font-bold hover:underline">Resend</button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-brand/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mb-8"
            >
              <div className="w-40 h-40 rounded-full border-[6px] border-white flex items-center justify-center">
                <Check strokeWidth={4} className="w-20 h-20 text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <p className="text-2xl text-white font-medium mb-1">welcome to</p>
              <h1 className="text-5xl font-bold text-white tracking-tight lowercase">wehood</h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
