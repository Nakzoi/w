import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  Settings, 
  User, 
  Coffee, 
  Utensils, 
  Flame, 
  Compass, 
  Sun, 
  Send, 
  Zap, 
  Calendar, 
  Plus, 
  Edit2,
  Clock,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useHangout } from "../context/HangoutContext";
import { Logo } from "../components/Logo";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";
import { PaymentModal } from "../components/PaymentModal";
import { OfferModal } from "../components/OfferModal";

// --- Components for Grid View ---
const ActivityButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center gap-3 group"
  >
    <div className="w-20 h-20 bg-white dark:bg-dark-card rounded-[2rem] shadow-sm flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-brand group-hover:shadow-md transition-all duration-200 border border-transparent group-hover:border-brand/10">
      <Icon size={32} strokeWidth={1.5} />
    </div>
    <span className="text-gray-500 dark:text-gray-400 group-hover:text-brand font-bold text-sm transition-colors">{label}</span>
  </motion.button>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { 
    isHangoutActive, 
    activeCategory,
    timeRemaining, 
    startHangout, 
    cancelHangout,
    paidPost,
    extendPaidPost 
  } = useHangout();

  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState("5.00");
  const [selectedDays, setSelectedDays] = useState(15);

  // Swipe Logic
  const { onPanEnd } = useSwipeNavigation({ 
    leftRoute: "/change-location", 
    rightRoute: "/chat" // Changed to Chat to match user's flow request
  });

  const firstPhoto = user?.photos.find(p => p !== null);
  const displayImage = firstPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80";
  const displayName = user?.username || "Alan";
  const displayAge = user?.birthday.year ? new Date().getFullYear() - parseInt(user.birthday.year) : 30;

  const activities = [
    { icon: Coffee, label: "Drink" },
    { icon: Utensils, label: "Food" },
    { icon: Flame, label: "Party" },
    { icon: Compass, label: "Explore" },
    { icon: Sun, label: "Hangout" },
    { icon: Send, label: "Play" },
    { icon: Zap, label: "Culture" },
    { icon: Calendar, label: "Events" },
  ];

  const getActiveIcon = () => {
    const activity = activities.find(a => a.label === activeCategory);
    return activity ? activity.icon : Sun;
  };

  const ActiveIcon = getActiveIcon();

  const handleOfferClick = () => {
    setIsOfferOpen(true);
  };

  const handleProceedToPayment = (amount: string, days: number) => {
    setSelectedAmount(amount);
    setSelectedDays(days);
    setIsOfferOpen(false);
    setTimeout(() => setIsPaymentOpen(true), 300);
  };

  const handleExtensionSuccess = () => {
    extendPaidPost(selectedDays);
    setIsPaymentOpen(false);
  };

  const handleBannerClick = () => {
    if (paidPost) {
      navigate('/post-preview', {
        state: {
          mode: 'preview',
          isOwner: true, 
          data: {
            title: paidPost.title,
            plan: paidPost.daysRemaining,
            address: "11, South Street London, SW 1 SRT",
            link: "www.newspa.com",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.",
            images: []
          }
        }
      });
    }
  };

  // --- RENDER: ACTIVE HANGOUT SCREEN ---
  if (isHangoutActive) {
    return (
      <div 
        className="w-full h-full bg-[#F3F4F6] dark:bg-dark-bg flex flex-col relative transition-colors duration-300 overflow-hidden"
        onPointerDown={(e) => e.stopPropagation()} 
      >
        <motion.div className="w-full h-full flex flex-col" onPanEnd={onPanEnd}>
          
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 pt-4">
            <button onClick={() => navigate('/settings')} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
              <Settings size={28} strokeWidth={2} />
            </button>
            
            <button onClick={() => navigate('/dashboard')} className="text-brand">
              <User size={28} strokeWidth={2.5} />
            </button>

            <button onClick={() => navigate('/posts')} className="text-gray-400 hover:text-brand transition-colors">
               <Logo size={32} color="currentColor" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center pb-32 overflow-y-auto">
            {/* Avatar - Fixed Dark Mode Border */}
            <div className="relative mb-8">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white dark:border-dark-card shadow-sm transition-colors">
                <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="absolute bottom-2 right-2 bg-brand text-white p-3 rounded-full border-4 border-[#F3F4F6] dark:border-dark-bg"
              >
                <Edit2 size={20} />
              </button>
            </div>

            {/* Active Activity Icon - Removed Dots, Bigger Icon */}
            <div className="mb-6">
               <div className="relative w-20 h-20 flex items-center justify-center">
                 <ActiveIcon size={64} className="text-brand" strokeWidth={1.5} />
               </div>
            </div>

            <h1 className="text-3xl font-bold text-[#003B4A] dark:text-white mb-2">{activeCategory}</h1>
            
            <div className="text-4xl font-bold text-brand mb-12">
              {timeRemaining}
            </div>

            <div className="flex gap-6 mb-16">
              <button 
                onClick={handleOfferClick}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-20 h-20 bg-white dark:bg-dark-card rounded-3xl flex items-center justify-center shadow-sm">
                  <Clock size={32} className="text-black dark:text-white" />
                </div>
                <span className="text-[#8B3A3A] font-bold text-sm">Offer</span>
              </button>

              <button 
                onClick={() => navigate('/create-page')}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-20 h-20 bg-white dark:bg-dark-card rounded-3xl flex items-center justify-center shadow-sm">
                  <Plus size={32} className="text-gray-600 dark:text-gray-300" />
                </div>
                <span className="text-[#8B3A3A] font-bold text-sm">Create Page</span>
              </button>
            </div>

            <button 
              onClick={cancelHangout}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-600 transition-colors">
                <X size={32} strokeWidth={2.5} />
              </div>
              <span className="text-gray-400 font-bold text-sm">CANCEL</span>
            </button>
          </div>

          {paidPost && (
            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={handleBannerClick}
              className="absolute bottom-6 left-6 right-6 cursor-pointer z-20"
            >
              <div className="bg-brand rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center text-white border-2 border-white/20">
                <h3 className="text-2xl font-bold uppercase tracking-wider">{paidPost.title}</h3>
                <p className="text-lg font-medium">{paidPost.daysRemaining} Days</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        <OfferModal 
          isOpen={isOfferOpen}
          onClose={() => setIsOfferOpen(false)}
          onProceedToPayment={handleProceedToPayment}
        />

        <PaymentModal 
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          onPaymentSuccess={handleExtensionSuccess}
          amount={selectedAmount}
        />
      </div>
    );
  }

  // --- RENDER: DEFAULT GRID DASHBOARD ---
  return (
    <div 
      className="w-full h-full bg-[#F3F4F6] dark:bg-dark-bg flex flex-col transition-colors duration-300 relative overflow-hidden"
    >
      <motion.div className="w-full h-full flex flex-col" onPanEnd={onPanEnd}>
        
        {/* Header */}
        <div className="h-16 bg-[#F3EFEF] dark:bg-dark-card flex items-center justify-between px-6 shadow-sm transition-colors duration-300">
          <button onClick={() => navigate('/settings')} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <Settings size={28} strokeWidth={2} />
          </button>
          
          <button onClick={() => navigate('/dashboard')} className="text-brand">
            <User size={28} strokeWidth={2.5} />
          </button>

          <button onClick={() => navigate('/posts')} className="text-gray-400 hover:text-brand transition-colors">
             <Logo size={32} color="currentColor" />
          </button>
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
        <div className="flex-1 px-8 pb-40 overflow-y-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-6 gap-y-10">
            {activities.map((item, index) => (
              <ActivityButton 
                key={index} 
                icon={item.icon} 
                label={item.label} 
                onClick={() => startHangout(item.label)}
              />
            ))}
            <ActivityButton 
               icon={Plus} 
               label="Create" 
               onClick={() => navigate('/create-page')} 
            />
          </div>
        </div>

        {paidPost && (
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={handleBannerClick}
            className="absolute bottom-6 left-6 right-6 z-20 cursor-pointer"
          >
            <div className="bg-brand rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center text-white border-2 border-white/20">
              <h3 className="text-2xl font-bold uppercase tracking-wider">{paidPost.title}</h3>
              <p className="text-lg font-medium">{paidPost.daysRemaining} Days</p>
            </div>
          </motion.div>
        )}
        
        {!paidPost && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-30 pointer-events-none">
             <h1 className="text-3xl font-bold tracking-tight lowercase text-gray-400 dark:text-gray-600">wehood</h1>
          </div>
        )}

        <OfferModal 
          isOpen={isOfferOpen}
          onClose={() => setIsOfferOpen(false)}
          onProceedToPayment={handleProceedToPayment}
        />

        <PaymentModal 
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          onPaymentSuccess={handleExtensionSuccess}
          amount={selectedAmount}
        />

      </motion.div>
    </div>
  );
}
