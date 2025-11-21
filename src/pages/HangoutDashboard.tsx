import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, Clock, Mountain, Settings, User, MessageSquare, MapPin, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";

export default function HangoutDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Swipe navigation
  const { onPanEnd } = useSwipeNavigation({ 
    leftRoute: "/settings", 
    rightRoute: "/posts" 
  });
  
  const [timeRemaining, setTimeRemaining] = useState("2:50:00");
  const [isLoading, setIsLoading] = useState(true);

  const firstPhoto = user?.photos?.[0] || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80";
  const displayName = user?.username || "Alan";

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    
    // Countdown timer
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
    const interval = setInterval(updateTimer, 1000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const navigateTo = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Consistent with Dashboard Grid */}
      <header className="h-16 bg-white flex items-center justify-between px-6 shadow-sm">
        <button 
          onClick={() => navigateTo('/settings')} 
          className="text-gray-400 hover:text-gray-600"
        >
          <Settings size={28} strokeWidth={2} />
        </button>
        
        <div className="text-brand">
           <User size={28} strokeWidth={2.5} />
        </div>
        
        <button 
          onClick={() => navigateTo('/posts')}
          className="text-gray-400 hover:text-brand"
        >
           {/* Use MessageSquare or Logo for consistency? Dashboard uses Logo. */}
           <MessageSquare size={28} />
        </button>
      </header>

      {/* Main Content */}
      <motion.main 
        className="flex-1 flex flex-col items-center px-6 pt-4 pb-8"
        onPanEnd={onPanEnd}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Profile Picture */}
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img 
              src={firstPhoto} 
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute -bottom-2 right-0 bg-brand text-white p-2 rounded-full shadow-md">
            <X size={16} />
          </button>
        </div>

        {/* Loading/Activity Indicator */}
        {isLoading ? (
          <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-6">
            <div className="w-10 h-10 rounded-full bg-brand animate-ping"></div>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mb-6">
            <Sun size={32} className="animate-spin" />
          </div>
        )}

        {/* Hangout Text */}
        <h1 className="text-3xl font-bold text-teal-800 mb-2">Hangout</h1>
        
        {/* Timer */}
        <div className="text-5xl font-bold text-orange-500 mb-8">
          {timeRemaining}
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-xs grid grid-cols-2 gap-4 mb-12">
          <button 
            className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center justify-center h-32"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <Clock size={24} className="text-gray-600" />
            </div>
            <span className="text-gray-700 font-medium">Offer</span>
          </button>
          
          <button 
            onClick={() => navigate('/create-page')}
            className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center justify-center h-32"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <Mountain size={24} className="text-gray-600" />
            </div>
            <span className="text-gray-700 font-medium">Create Page</span>
          </button>
        </div>
      </motion.main>

      {/* Bottom Navigation (Only for Hangout Dashboard) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center">
        <button 
          onClick={() => navigateTo('/dashboard')}
          className="flex flex-col items-center text-gray-500 hover:text-brand"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
            <User size={20} />
          </div>
          <span className="text-xs">Profile</span>
        </button>
        
        <button 
          onClick={() => navigateTo('/posts')}
          className="flex flex-col items-center text-gray-500 hover:text-brand"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
            <MessageSquare size={20} />
          </div>
          <span className="text-xs">Posts</span>
        </button>
        
        <button 
          onClick={() => navigate('/create-page')}
          className="flex flex-col items-center -mt-8"
        >
          <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center text-white shadow-lg hover:bg-brand/90">
            <Plus size={28} />
          </div>
          <span className="text-xs mt-2 text-gray-500">Create</span>
        </button>
        
        <button 
          onClick={() => navigateTo('/chat')}
          className="flex flex-col items-center text-gray-500 hover:text-brand"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
            <MessageSquare size={20} />
          </div>
          <span className="text-xs">Chats</span>
        </button>
        
        <button 
          onClick={() => navigateTo('/settings')}
          className="flex flex-col items-center text-gray-500 hover:text-brand"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
            <Settings size={20} />
          </div>
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </div>
  );
}
