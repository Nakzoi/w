import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, WifiOff } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export default function PhoneNumber() {
  const navigate = useNavigate();
  const { signInWithOtp, isSupabaseConnected } = useAuth();
  const [countryCode, setCountryCode] = useState("+852");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (phoneNumber.length > 3) {
      setIsLoading(true);
      const fullPhone = `${countryCode}${phoneNumber}`.replace(/\s/g, "");
      
      const { error } = await signInWithOtp(fullPhone);
      
      setIsLoading(false);
      
      if (error) {
        alert("Error sending SMS: " + error.message);
      } else {
        // Pass the number to the next screen via state
        navigate("/verify-otp", { state: { phone: fullPhone } });
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-brand px-6 py-8 relative"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Warning if disconnected */}
      {!isSupabaseConnected && (
        <div className="absolute top-4 right-4 bg-red-500/20 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
           <WifiOff size={12} /> No SMS (Dev Mode)
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-start mb-12">
        <button 
          onClick={() => navigate(-1)} 
          className="text-white p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={28} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-4xl font-bold text-white mb-16">My number is</h2>

        <div className="flex items-end gap-4 mb-6">
          {/* Country Code Input */}
          <div className="w-24 relative">
            <input
              type="text"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white text-3xl font-bold text-white pb-2 focus:outline-none text-center"
            />
          </div>

          {/* Phone Number Input */}
          <div className="flex-1 relative">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/50 focus:border-white text-3xl font-bold text-white pb-2 focus:outline-none transition-colors placeholder-white/30"
              autoFocus
              placeholder="6291 6962"
            />
          </div>
        </div>

        <p className="text-white/80 text-sm leading-relaxed mb-12">
          We will send a text with verification code.. Message and data rates may apply
        </p>

        <div className="mt-auto mb-8 flex justify-center">
          <div className="w-full max-w-xs">
            <Button 
              variant="outline" 
              onClick={handleContinue}
              disabled={phoneNumber.length < 4 || isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
