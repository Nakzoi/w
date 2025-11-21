import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { 
  Search, 
  MessageCircle, 
  ChevronRight, 
  Sun, 
  FileText, 
  Zap, 
  LogOut,
  Users,
  Calendar
} from "lucide-react";
import { Logo } from "../components/Logo";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";

// Mock Data
const REQUESTS = [
  { id: 1, name: "Meethan", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" },
  { id: 2, name: "Neel", img: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Abhi", img: "https://i.pravatar.cc/150?u=3" },
  { id: 4, name: "Daniel", img: "https://i.pravatar.cc/150?u=4" },
  { id: 5, name: "Twilight", img: "https://i.pravatar.cc/150?u=5" },
  { id: 6, name: "Bee", img: "https://i.pravatar.cc/150?u=6" },
  { id: 7, name: "John", img: "https://i.pravatar.cc/150?u=7" },
  { id: 8, name: "Doe", img: "https://i.pravatar.cc/150?u=8" },
];

const CHATS = [
  { 
    id: 1, 
    name: "Maria", 
    img: "https://i.pravatar.cc/150?u=8", 
    icon: Sun, 
    message: "Who know's a good ingrediant lorum ipsum sonia ...", 
    time: "14:55", 
    unread: 2,
    type: "private"
  },
  { 
    id: 2, 
    name: "Neel", 
    img: "https://i.pravatar.cc/150?u=2", 
    icon: FileText, 
    message: "Photo", 
    isPhoto: true,
    time: "14:55", 
    unread: 0,
    type: "private"
  },
  { 
    id: 3, 
    name: "Weekend Trip", 
    img: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&w=150&q=80", 
    icon: Calendar, 
    message: "Sarah: I'm in!", 
    time: "Yesterday", 
    unread: 5,
    type: "group",
    members: 12,
    isPaidEvent: true
  },
  { 
    id: 4, 
    name: "Hiking Crew", 
    img: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=150&q=80", 
    icon: Users, 
    message: "Mike: See you at 8", 
    time: "10:30", 
    unread: 0,
    type: "group",
    members: 4,
    isPaidEvent: false
  },
];

const SwipeableItem = ({ chat, onClick }: { chat: typeof CHATS[0], onClick: () => void }) => {
  const controls = useAnimation();
  
  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (info.offset.x < -100) {
      await controls.start({ x: -100 });
    } else {
      await controls.start({ x: 0 });
    }
  };

  return (
    <div className="relative bg-white dark:bg-dark-card overflow-hidden border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="absolute inset-y-0 right-0 w-full bg-[#8B3A3A] flex items-center justify-end px-8">
        <LogOut className="text-white w-8 h-8" />
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        onClick={onClick}
        className={`relative bg-white dark:bg-dark-card p-4 flex items-center gap-4 z-10 transition-colors cursor-pointer active:bg-gray-50 dark:active:bg-gray-800 ${
           chat.type === 'group' ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''
        }`}
      >
        <div className="relative">
          <img 
            src={chat.img} 
            alt={chat.name} 
            className={`w-14 h-14 object-cover grayscale ${chat.type === 'group' ? 'rounded-2xl' : 'rounded-full'}`} 
          />
          {chat.type === 'group' && (
            <div className="absolute -bottom-1 -right-1 bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-dark-card">
              {chat.members}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {chat.isPaidEvent ? (
               <Calendar size={18} className="text-brand" strokeWidth={2.5} />
            ) : (
               <chat.icon size={18} className="text-black dark:text-white" strokeWidth={2.5} />
            )}
            <h3 className={`text-xl font-bold ${chat.type === 'group' ? 'text-brand' : 'text-black dark:text-white'}`}>
              {chat.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm truncate">
             {chat.isPhoto && <div className="bg-gray-200 dark:bg-gray-700 p-0.5 rounded"><FileText size={12} /></div>}
             <span className="truncate">{chat.isPhoto ? "Photo" : chat.message}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-gray-400 dark:text-gray-500 text-xs font-bold">{chat.time}</span>
          {chat.unread > 0 ? (
            <span className="bg-brand text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {chat.unread}
            </span>
          ) : (
            <ChevronRight className="text-gray-300 dark:text-gray-600" />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default function ChatList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"private" | "group">("private");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Swipe Logic
  // Swipe Right (Gesture) -> Go Left -> Dashboard
  // Swipe Left (Gesture) -> Go Right -> Posts/Marketplace
  const { onPanEnd } = useSwipeNavigation({ 
    leftRoute: "/dashboard",
    rightRoute: "/posts"
  });

  const filteredChats = CHATS.filter(c => 
    activeTab === 'private' ? c.type === 'private' : c.type === 'group'
  );

  return (
    <div 
      className="w-full h-full bg-white dark:bg-dark-bg flex flex-col transition-colors duration-300 relative overflow-hidden"
    >
      <motion.div className="w-full h-full flex flex-col" onPanEnd={onPanEnd}>
        {/* Header */}
        <div className="h-16 bg-[#F3EFEF] dark:bg-dark-card flex items-center justify-between px-4 transition-colors duration-300">
          {/* W Logo - Gray, Links to Marketplace */}
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer" onClick={() => navigate('/posts')}>
             <Logo size={30} className="text-gray-400 dark:text-gray-500" />
          </div>
          <div className="text-brand">
            <MessageCircle size={28} fill="#E9967A" className="text-brand" />
          </div>
          <div className="w-8" />
        </div>

        {/* Search */}
        <div className="px-4 py-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search ..." 
              className="w-full bg-white dark:bg-dark-input border border-gray-200 dark:border-gray-700 rounded-full py-3 pl-4 pr-10 text-gray-600 dark:text-white focus:outline-none focus:border-brand/50 shadow-sm transition-colors"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Requests Carousel */}
        <div className="px-4 mb-6">
          <h2 className="text-brand font-bold text-xl mb-4">Requests</h2>
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {REQUESTS.map(req => (
              <motion.button 
                key={req.id} 
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(`/friend-request/${req.id}`)}
                className="flex flex-col items-center gap-2 min-w-[60px] snap-start"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden grayscale border-2 border-transparent hover:border-brand transition-colors">
                  <img src={req.img} alt={req.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-black dark:text-white">{req.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab("private")}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-lg transition-colors ${
              activeTab === "private" 
                ? "bg-[#7C67AC] text-white shadow-md" 
                : "bg-gray-200 dark:bg-gray-800 text-white dark:text-gray-400"
            }`}
          >
            <div className="rotate-45">
               <FileText size={20} fill="currentColor" />
            </div>
            Private chats
          </button>
          
          <button 
            onClick={() => setActiveTab("group")}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-lg transition-colors relative ${
              activeTab === "group" 
                ? "bg-brand text-white shadow-md" 
                : "bg-gray-200 dark:bg-gray-800 text-white dark:text-gray-400"
            }`}
          >
            <div className="flex -space-x-1">
               <div className="w-2 h-2 bg-current rounded-full" />
               <div className="w-2 h-2 bg-current rounded-full" />
            </div>
            Group chats
            <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full" />
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto" onPointerDown={(e) => e.stopPropagation()}>
          {filteredChats.map(chat => (
            <SwipeableItem 
              key={chat.id} 
              chat={chat} 
              onClick={() => navigate(`/chat/${chat.id}`, { state: { name: chat.name } })}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
