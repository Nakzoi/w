import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, LogOut, Hand, Sun } from "lucide-react";

export default function UserPostView() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [currentImage, setCurrentImage] = useState(0);

  // Mock Data
  const user = {
    name: "Alex",
    age: 30,
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.",
    images: [
      "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&w=800&q=80"
    ],
    hangoutTime: "2:50:00"
  };

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % user.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev - 1 + user.images.length) % user.images.length);
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#F3F4F6] flex flex-col relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      {/* Top Section: Image Carousel */}
      <div className="relative h-[55vh] w-full bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={user.images[currentImage]}
            alt={user.name}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-20"
        >
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>

        {/* Tap Areas for Navigation */}
        <div className="absolute inset-0 flex z-10">
          <div className="flex-1" onClick={handlePrevImage} />
          <div className="flex-1" onClick={handleNextImage} />
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {user.images.map((_, idx) => (
            <div 
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                idx === currentImage ? "bg-brand" : "bg-white"
              }`}
            />
          ))}
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* Bottom Section: Content */}
      <div className="flex-1 px-6 pt-6 pb-8 flex flex-col">
        <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-brand">
            {user.name}, {user.age}
            </h1>
            
            {/* Hangout Timer */}
            <div className="flex flex-col items-end text-brand">
                <Sun size={24} className="animate-spin-slow mb-1" />
                <div className="flex flex-col items-end leading-none">
                    <span className="text-[10px] font-bold uppercase opacity-80">Hangout</span>
                    <span className="text-sm font-bold">{user.hangoutTime}</span>
                </div>
            </div>
        </div>

        {/* Bio Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm mb-8 flex-1">
          <p className="text-gray-500 text-sm leading-relaxed">
            {user.bio}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-8 -mt-16 relative z-30">
          {/* Pass / Leave */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-20 h-20 rounded-full bg-[#8B3A3A] flex items-center justify-center text-white shadow-lg border-4 border-[#F3F4F6]"
          >
            <LogOut size={28} className="ml-1" />
          </motion.button>

          {/* Request / Hand */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-20 h-20 rounded-full bg-brand flex items-center justify-center text-white shadow-xl border-4 border-[#F3F4F6]"
          >
            <Hand size={28} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
