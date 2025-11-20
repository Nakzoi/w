import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Settings, 
  User, 
  Coffee, 
  Utensils, 
  Flame, 
  FileText, 
  Sun, 
  Send, 
  Zap, 
  Mountain, 
  Ticket, 
  Edit2 
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../components/Logo";
import { HangoutPopup } from "../components/HangoutPopup";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";

const ActivityButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center gap-3"
  >
    <div className="w-20 h-20 bg-white dark:bg-dark-card rounded-[2rem] shadow-sm flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-brand hover:shadow-md transition-all duration-200">
      <Icon size={32} strokeWidth={1.5} />
    </div>
    <span className="text-brand font-bold text-sm">{label}</span>
  </motion.button>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Swipe Logic Update: 
  // Swipe Right (gesture) -> Settings (Left Screen)
  // Swipe Left (gesture) -> Posts (Right Screen)
  const { onPanEnd } = useSwipeNavigation({ 
    leftRoute: "/settings", 
    rightRoute: "/posts" 
  });

  const firstPhoto = user?.photos.find(p => p !== null);
  const displayImage = firstPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80";
  const displayName = user?.username || "Alan";
  const displayAge = user?.birthday.year ? new Date().getFullYear() - parseInt(user.birthday.year) : 30;

  const [showHangoutPopup, setShowHangoutPopup] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("3:00:00");

  useEffect(() => {
    if (showHangoutPopup) {
      // Start countdown timer when popup is shown
      const endTime = Date.now() + 3 * 60 * 60 * 1000; // 3 hours from now
      
      const updateTimer = () => {
        const now = Date.now();
        const diff = Math.max(0, endTime - now);
        
        if (diff <= 0) {
          setTimeRemaining("0:00:00");
          return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeRemaining(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      };
      
      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      
      return () => clearInterval(timer);
    }
  }, [showHangoutPopup]);

  const activities = [
    { 
      icon: Coffee, 
      label: "Drink",
      action: () => setShowHangoutPopup(true)
    },
    { 
      icon: Utensils, 
      label: "Food",
      action: () => setShowHangoutPopup(true)
    },
    { 
      icon: Flame, 
      label: "Party",
      action: () => setShowHangoutPopup(true)
    },
    { 
      icon: FileText, 
      label: "Dolbe",
      action: () => setShowHangoutPopup(true)
    },
    { 
      icon: Sun, 
      label: "Hangout", 
      action: () => setShowHangoutPopup(true)
    },
    { 
      icon: Send, 
      label: "Play",
      action: () => setShowHangoutPopup(true)
    },
    { 
      icon: Zap, 
      label: "Culture",
      action: () => setShowHangoutPopup(true)
    },
    { 
      icon: Mountain, 
      label: "Group",
      action: () => setShowHangoutPopup(true)
    },
    { 
      icon: Ticket, 
      label: "Unknown 2",
      action: () => setShowHangoutPopup(true)
    },
  ];

  return (
    <motion.div 
      className="min-h-screen bg-[#F3F4F6] dark:bg-dark-bg flex flex-col transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPanEnd={onPanEnd}
    >
      {/* Header */}
      <div className="h-16 bg-[#F3EFEF] dark:bg-dark-card flex items-center justify-between px-6 shadow-sm transition-colors duration-300">
        <button onClick={() => navigate('/settings')} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
          <Settings size={24} />
        </button>
        <div className="text-brand">
          <User size={28} fill="currentColor" className="opacity-60" />
        </div>
        <div className="w-8 h-8 flex items-center justify-center">
           <Logo size={30} className="text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center pt-8 pb-8">
        <div className="relative">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-dark-card shadow-lg transition-colors">
            <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button 
            onClick={() => navigate('/profile')}
            className="absolute bottom-0 right-0 bg-brand text-white p-3 rounded-full shadow-md hover:bg-brand/90 transition-colors border-4 border-[#F3F4F6] dark:border-dark-bg"
          >
            <Edit2 size={20} />
          </button>
        </div>
        <h1 className="text-2xl font-bold text-brand mt-4">
          {displayName}, {displayAge}
        </h1>
      </div>

      {/* Grid */}
      <div className="flex-1 px-8 pb-12">
        <div className="grid grid-cols-3 gap-x-6 gap-y-10">
          {activities.map((item, index) => (
            <ActivityButton 
              key={index} 
              icon={item.icon} 
              label={item.label} 
              onClick={item.action}
            />
          ))}
        </div>
      </div>

      {/* Footer Logo */}
      <div className="py-6 flex justify-center opacity-30">
         <h1 className="text-3xl font-bold tracking-tight lowercase text-gray-400 dark:text-gray-600">wehood</h1>
      </div>

      {/* Hangout Popup */}
      <HangoutPopup
        isOpen={showHangoutPopup}
        onClose={() => setShowHangoutPopup(false)}
        userName={displayName}
        userAge={displayAge}
        userImage={displayImage}
        timeRemaining={timeRemaining}
      />
    </motion.div>
  );
}
