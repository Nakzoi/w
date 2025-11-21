import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Compass, 
  Settings as SettingsIcon, 
  User, 
  ChevronRight, 
  User as UserIcon, 
  BadgeCheck 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Logo } from "../components/Logo";
import { Toggle } from "../components/ui/Toggle";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";
import { cn } from "../lib/utils";

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // Swipe Logic: 
  // Swipe Right (reveal Left content) -> Change Location
  // Swipe Left (reveal Right content) -> Dashboard
  const { onPanEnd } = useSwipeNavigation({ 
    leftRoute: "/change-location",
    rightRoute: "/dashboard" 
  });

  // State
  const [distance, setDistance] = useState(150);
  const [ageRange, setAgeRange] = useState([18, 55]);
  const [showOnWehood, setShowOnWehood] = useState(true);
  const [gender, setGender] = useState<"male" | "female" | "brand">("male");
  const [notifications, setNotifications] = useState({
    newWehoods: true,
    requests: true,
    messages: true
  });

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <motion.div 
      className="w-full h-full bg-white dark:bg-dark-bg flex flex-col transition-colors duration-300"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onPanEnd={onPanEnd}
    >
      {/* Header */}
      <div className="h-16 bg-[#F3EFEF] dark:bg-dark-card flex items-center justify-between px-4 shadow-sm z-10 transition-colors duration-300 flex-shrink-0">
        <button className="w-8 text-gray-800 dark:text-white" onClick={() => navigate('/change-location')}>
           <Compass size={28} strokeWidth={1.5} />
        </button>
        <div className="text-brand">
          <SettingsIcon size={28} fill="#E9967A" className="text-brand" />
        </div>
        {/* Profile Icon - Consistent with Dashboard */}
        <button className="w-8 text-gray-400" onClick={() => navigate('/dashboard')}>
           <User size={28} strokeWidth={2.5} className="opacity-40" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-12">
        {/* Location */}
        <div 
          onClick={() => navigate('/change-location')}
          className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          <span className="text-gray-500 dark:text-gray-400 font-medium">Location</span>
          <div className="flex items-center gap-2 text-brand font-bold">
            <span>Hong Kong, Hong Kong</span>
            <ChevronRight size={20} />
          </div>
        </div>

        {/* Distance */}
        <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Maximum distance</span>
            <span className="text-gray-500 dark:text-gray-400">{distance} KM</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="200" 
            value={distance} 
            onChange={(e) => setDistance(parseInt(e.target.value))}
            className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand"
          />
        </div>

        {/* Gender */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400 font-medium">Gender</span>
          <div className="flex gap-6 text-gray-400">
            <button 
              onClick={() => setGender('male')} 
              className={cn("transition-colors", gender === 'male' ? "text-brand" : "text-gray-400")}
            >
              <UserIcon size={28} fill={gender === 'male' ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={() => setGender('female')} 
              className={cn("transition-colors", gender === 'female' ? "text-brand" : "text-gray-400")}
            >
              <UserIcon size={28} fill={gender === 'female' ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={() => setGender('brand')} 
              className={cn("transition-colors", gender === 'brand' ? "text-brand" : "text-gray-400")}
            >
              <BadgeCheck size={28} fill={gender === 'brand' ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Age Range */}
        <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Age range</span>
            <span className="text-gray-500 dark:text-gray-400">{ageRange[0]} - {ageRange[1]}+</span>
          </div>
          <input 
            type="range" 
            min="18" 
            max="60" 
            value={ageRange[1]} 
            onChange={(e) => setAgeRange([18, parseInt(e.target.value)])}
            className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand"
          />
        </div>

        {/* Show me on Wehood */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400 font-medium">Show me on Wehood</span>
          <Toggle isOn={showOnWehood} onToggle={() => setShowOnWehood(!showOnWehood)} />
        </div>

        {/* Appearance */}
        <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800 space-y-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            Turning this on will show your profile to single user near you
          </p>
          <h3 className="text-gray-500 dark:text-gray-300 font-bold uppercase text-sm mt-6 mb-4">Appearance</h3>
          
          <div className="flex justify-center gap-16">
            <button onClick={() => setTheme("light")} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${theme === "light" ? "border-brand" : "border-gray-300 dark:border-gray-600"}`}>
                {theme === "light" && <div className="w-4 h-4 bg-brand rounded-full" />}
              </div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">Light</span>
            </button>
            <button onClick={() => setTheme("dark")} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${theme === "dark" ? "border-brand" : "border-gray-300 dark:border-gray-600"}`}>
                {theme === "dark" && <div className="w-4 h-4 bg-brand rounded-full" />}
              </div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">Dark</span>
            </button>
          </div>
        </div>

        {/* Notification */}
        <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800 space-y-6">
          <h3 className="text-gray-500 dark:text-gray-300 font-bold uppercase text-sm">Notification</h3>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">New Wehoods near you</span>
            <Toggle isOn={notifications.newWehoods} onToggle={() => setNotifications({...notifications, newWehoods: !notifications.newWehoods})} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">Wehood requests accepted</span>
            <Toggle isOn={notifications.requests} onToggle={() => setNotifications({...notifications, requests: !notifications.requests})} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">Messages</span>
            <Toggle isOn={notifications.messages} onToggle={() => setNotifications({...notifications, messages: !notifications.messages})} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-8 space-y-4">
          <button className="w-full bg-brand/80 hover:bg-brand text-white font-bold py-3 rounded-full shadow-lg shadow-brand/20 transition-all">
            Rate us
          </button>
          <button className="w-full bg-brand text-white font-bold py-3 rounded-full shadow-lg shadow-brand/20 transition-all">
            Share WeHood
          </button>
        </div>

        {/* Contact & Community */}
        <div className="border-t border-gray-100 dark:border-gray-800">
          <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/5">
             <h3 className="text-gray-500 dark:text-gray-300 font-bold uppercase text-sm">Contact</h3>
          </div>
          <button className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <span className="text-gray-500 dark:text-gray-400">Help & Support</span>
            <ChevronRight size={20} className="text-gray-300" />
          </button>

          <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800">
             <h3 className="text-gray-500 dark:text-gray-300 font-bold uppercase text-sm">Community</h3>
          </div>
          <button className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-100 dark:border-gray-800 transition-colors">
            <span className="text-gray-500 dark:text-gray-400">Terms of service</span>
            <ChevronRight size={20} className="text-gray-300" />
          </button>
          <button className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-100 dark:border-gray-800 transition-colors">
            <span className="text-gray-500 dark:text-gray-400">Privacy Policy</span>
            <ChevronRight size={20} className="text-gray-300" />
          </button>
        </div>

        {/* Footer */}
        <div className="py-12 flex flex-col items-center gap-6">
          <button 
            onClick={handleLogout}
            className="text-gray-500 dark:text-gray-400 font-bold underline decoration-2 underline-offset-4 hover:text-gray-800 dark:hover:text-white"
          >
            Log Out
          </button>

          <div className="flex flex-col items-center opacity-40">
            <Logo size={50} className="text-brand mb-1" />
            <span className="text-xs text-gray-400 font-medium">Version 1.0</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
