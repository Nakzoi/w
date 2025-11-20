import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { 
  User, 
  MessageCircle, 
  Grid, 
  Search, 
  Sun, 
  LogOut, 
  Hand, 
  Mountain 
} from "lucide-react";
import { Logo } from "../components/Logo";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";
import { useAuth } from "../context/AuthContext";

// Mock Data for Stories/Highlights
const HIGHLIGHTS = [
  { id: 1, title: "New Spa", count: 136, img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=640&q=80" },
  { id: 2, title: "U2 Convert Load", count: 45, img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=640&q=80" },
  { id: 3, title: "Lorem Ipsum", count: 25, img: "https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&w=640&q=80" },
  { id: 4, title: "Beach Party", count: 89, img: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&w=640&q=80" },
];

// Mock Data for Feed
const FEED_ITEMS = [
  { id: 1, name: "Alex", img: "https://i.pravatar.cc/150?u=alex", time: "2:50:00", activity: "Hangout" },
  { id: 2, name: "Adriana", img: "https://i.pravatar.cc/150?u=adriana", time: "1:15:00", activity: "Hangout" },
  { id: 3, name: "Hamidi", img: "https://i.pravatar.cc/150?u=hamidi", time: "2:28:00", activity: "Hangout" },
  { id: 4, name: "Sarah", img: "https://i.pravatar.cc/150?u=sarah", time: "0:45:00", activity: "Hangout" },
];

const SwipeableFeedItem = ({ item }: { item: typeof FEED_ITEMS[0] }) => {
  const controls = useAnimation();
  const [isOpen, setIsOpen] = useState(false);

  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (info.offset.x < -80) {
      setIsOpen(true);
      await controls.start({ x: -140 }); // Reveal both buttons
    } else {
      setIsOpen(false);
      await controls.start({ x: 0 });
    }
  };

  return (
    <div className="relative bg-white dark:bg-dark-card overflow-hidden border-b border-gray-100 dark:border-gray-800">
      {/* Background Actions */}
      <div className="absolute inset-y-0 right-0 w-[140px] flex">
        {/* Red / Exit Button */}
        <button className="flex-1 bg-[#8B3A3A] flex items-center justify-center text-white">
          <LogOut size={24} />
        </button>
        {/* Orange / Hand Button */}
        <button className="flex-1 bg-[#E9967A] flex items-center justify-center text-white">
          <Hand size={24} />
        </button>
      </div>

      {/* Foreground Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -140, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative bg-white dark:bg-dark-card p-4 flex items-center gap-4 z-10"
      >
        <div className="relative">
          <img src={item.img} alt={item.name} className="w-14 h-14 rounded-full object-cover" />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-black dark:text-white">{item.name}</h3>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-xs font-bold text-black dark:text-white mb-1">
            <span>{item.activity}</span>
            <Sun size={16} className="animate-spin-slow" />
          </div>
          <span className="text-lg font-bold text-black dark:text-white font-mono tracking-tight">
            {item.time}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default function Posts() {
  const navigate = useNavigate();
  
  // Swipe Navigation:
  // Left -> Dashboard
  // Right -> Chat
  const { onPanEnd } = useSwipeNavigation({ 
    leftRoute: "/dashboard", 
    rightRoute: "/chat" 
  });

  return (
    <motion.div 
      className="min-h-screen bg-[#F9F9F9] dark:bg-dark-bg flex flex-col transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPanEnd={onPanEnd}
    >
      {/* Header */}
      <div className="h-16 bg-[#F3EFEF] dark:bg-dark-card flex items-center justify-between px-4 shadow-sm transition-colors duration-300 sticky top-0 z-20">
        <button onClick={() => navigate('/profile')} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
          <User size={28} fill="currentColor" className="opacity-40" />
        </button>
        
        <div className="w-10 h-10 flex items-center justify-center">
           <Logo size={40} />
        </div>

        <button onClick={() => navigate('/chat')} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white relative">
          <MessageCircle size={28} fill="#ccc" className="text-gray-300" />
          <div className="absolute top-2 right-2 w-3 h-3 bg-brand rounded-full border-2 border-[#F3EFEF]" />
        </button>
      </div>

      {/* Sub Header (M Icon & Grid) */}
      <div className="px-4 py-3 flex justify-between items-center">
        <Mountain className="text-brand" size={28} />
        <Grid className="text-brand" size={28} />
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Horizontal Highlights */}
        <div className="overflow-x-auto flex gap-4 px-4 pb-6 scrollbar-hide">
          {HIGHLIGHTS.map(item => (
            <div key={item.id} className="relative min-w-[160px] h-[160px] rounded-2xl overflow-hidden shadow-md flex-shrink-0">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="font-bold text-sm leading-tight mb-1">{item.title}</p>
                <div className="flex items-center gap-1 text-xs opacity-90">
                  <User size={10} fill="currentColor" />
                  <span>{item.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="px-4 mb-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search ..." 
              className="w-full bg-white dark:bg-dark-input border border-gray-200 dark:border-gray-700 rounded-full py-3 pl-5 pr-10 text-gray-600 dark:text-white focus:outline-none shadow-sm"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Feed List */}
        <div className="bg-white dark:bg-dark-card">
          {FEED_ITEMS.map(item => (
            <SwipeableFeedItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
