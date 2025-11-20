import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { Wifi, WifiOff } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const { isSupabaseConnected } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-brand px-6 py-12 relative overflow-hidden">
      
      {/* Connection Status Indicator */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${isSupabaseConnected ? 'bg-green-500/20 text-white' : 'bg-red-500/20 text-white'}`}>
        {isSupabaseConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
        {isSupabaseConnected ? "Connected" : "Simulation Mode"}
      </div>

      {/* Top Section: Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex flex-col justify-center items-center w-full"
      >
        <Logo size={120} />
      </motion.div>

      {/* Bottom Section: Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-sm space-y-4 flex flex-col items-center"
      >
        <div className="w-full space-y-4">
          <Button variant="primary" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          
          <Button variant="outline" onClick={() => navigate("/phone-login")}>
            Create Account
          </Button>
        </div>

        <button 
          onClick={() => navigate("/recovery")}
          className="text-white text-sm font-medium hover:underline pt-2"
        >
          Can't sign in?
        </button>

        <div className="pt-12 pb-4 text-center space-y-1 opacity-80">
          <p className="text-xs text-white">
            By continuing, you agree to our
          </p>
          <p className="text-xs text-white font-semibold cursor-pointer hover:underline">
            Terms & Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
