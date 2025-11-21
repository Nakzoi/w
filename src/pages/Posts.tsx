import { useState, useEffect } from "react";
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
  Mountain,
  Clock
} from "lucide-react";
import { Logo } from "../components/Logo";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";

// Mock Data for Stories/Highlights
const HIGHLIGHTS = [
  { id: 1, title: "New Spa", count: 136, img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=640&q=80", isPaid: true, category: "Relax" },
  { id: 2, title: "U2 Convert Load", count: 45, img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=640&q=80", isPaid: true, category: "Music" },
  { id: 3, title: "Lorem Ipsum", count: 25, img: "https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&w=640&q=80", isPaid: true, category: "Art" },
  { id: 4, title: "Beach Party", count: 89, img: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&w=640&q=80", isPaid: true, category: "Party" },
];

// Mock Data for Feed
const FEED_ITEMS = [
  { id: 1, name: "Alex", img: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=150&q=80", endTime: Date.now() + 3600000, activity: "Hangout" },
  { id: 2, name: "Adriana", img: "https://i.pravatar.cc/150?u=adriana", endTime: Date.now() + 7200000, activity: "Hangout" },
  { id: 3, name: "Hamidi", img: "https://i.pravatar.cc/150?u=hamidi", endTime: Date.now() + 1800000, activity: "Hangout" },
  { id: 4, name: "Sarah", img: "https://i.pravatar.cc/150?u=sarah", endTime: Date.now() + 5400000, activity: "Hangout" },
];

const SwipeableFeedItem = ({ item, onClick }: { item: typeof FEED_ITEMS[0], onClick: () => void }) => {
  const controls = useAnimation();
  const [timeLeft, setTimeLeft] = useState("");

  // Ticking Clock Logic
  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = item.endTime - now;
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [item.endTime]);
  
  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (info.offset.x < -80) {
      await controls.start({ x: -140 }); // Reveal both buttons
    } else {
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
        onClick={onClick}
        className="relative bg-white dark:bg-dark-card p-4 flex items-center gap-4 z-10 cursor-pointer active:bg-gray-50"
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
            {timeLeft}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default function Posts() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"feed" | "grid">("feed");
  
  // Swipe Navigation
  // Left Route (Swipe Right to see) -> Dashboard (/dashboard)
  // Right Route (Swipe Left to see) -> Chat (/chat)
  const { onPanEnd } = useSwipeNavigation({ 
    leftRoute: "/dashboard", 
    rightRoute: "/chat" 
  });

  const handleHighlightClick = (item: typeof HIGHLIGHTS[0]) => {
    navigate('/post-preview', {
      state: {
        mode: 'preview',
        isOwner: false,
        data: {
          title: item.title,
          plan: 15,
          images: [item.img],
          description: "Featured event description goes here...",
          address: "123 Featured St, London",
          link: "www.featured.com"
        }
      }
    });
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#F9F9F9] dark:bg-dark-bg flex flex-col transition-colors duration-300"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onPanEnd={onPanEnd}
    >
      {/* Header */}
      <div className="h-16 bg-[#F3EFEF] dark:bg-dark-card flex items-center justify-between px-4 shadow-sm transition-colors duration-300 sticky top-0 z-20">
        {/* Profile Icon - Consistent with Dashboard */}
        <button onClick={() => navigate('/dashboard')} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
          <User size={28} strokeWidth={2.5} className="opacity-40" />
        </button>
        
        {/* W Logo - Links to Marketplace (Refresh) */}
        <div className="w-10 h-10 flex items-center justify-center cursor-pointer" onClick={() => navigate('/posts')}>
           <Logo size={40} />
        </div>

        <button onClick={() => navigate('/chat')} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white relative">
          <MessageCircle size={28} fill="#ccc" className="text-gray-300" />
          <div className="absolute top-2 right-2 w-3 h-3 bg-brand rounded-full border-2 border-[#F3EFEF]" />
        </button>
      </div>

      {/* View Toggle Sub Header */}
      <div className="px-4 py-3 flex justify-between items-center">
        <button 
          onClick={() => setViewMode("feed")}
          className={`transition-colors ${viewMode === "feed" ? "text-brand" : "text-gray-400"}`}
        >
           <Mountain size={28} />
        </button>
        <button 
          onClick={() => setViewMode("grid")}
          className={`transition-colors ${viewMode === "grid" ? "text-brand" : "text-gray-400"}`}
        >
           <Grid size={28} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        
        {/* GRID VIEW: Only Paid Posts by Category */}
        {viewMode === "grid" ? (
          <div className="px-4 pt-2">
            <h2 className="text-xl font-bold text-brand mb-4">Featured Events</h2>
            <div className="grid grid-cols-2 gap-4">
              {HIGHLIGHTS.map(item => (
                <motion.div 
                  key={item.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleHighlightClick(item)}
                  className="relative rounded-2xl overflow-hidden aspect-square shadow-md"
                >
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3">
                    <span className="text-white font-bold text-lg leading-none">{item.title}</span>
                    <span className="text-brand text-xs font-bold uppercase mt-1">{item.category}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* FEED VIEW: Highlights + Feed */
          <>
            {/* Horizontal Highlights (Featured Posts) */}
            <div className="overflow-x-auto flex gap-4 px-4 pb-6 scrollbar-hide">
              {HIGHLIGHTS.map(item => (
                <motion.div 
                  key={item.id} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleHighlightClick(item)}
                  className="relative min-w-[160px] h-[160px] rounded-2xl overflow-hidden shadow-md flex-shrink-0 cursor-pointer"
                >
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="font-bold text-sm leading-tight mb-1">{item.title}</p>
                    <div className="flex items-center gap-1 text-xs opacity-90">
                      <User size={10} fill="currentColor" />
                      <span>{item.count}</span>
                    </div>
                  </div>
                </motion.div>
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
                <SwipeableFeedItem 
                  key={item.id} 
                  item={item} 
                  onClick={() => navigate(`/user-post/${item.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
