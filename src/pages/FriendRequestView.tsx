import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, LogOut, Users, VolumeX } from "lucide-react";

export default function FriendRequestView() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [currentImage, setCurrentImage] = useState(0);

  // Mock Data
  const user = {
    name: "Meethan",
    age: 30,
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.",
    images: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534030347209-7147fd9e7b1a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
    ]
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
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
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
        <h1 className="text-4xl font-bold text-brand mb-4">
          {user.name} , {user.age}
        </h1>

        {/* Bio Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm mb-8 flex-1">
          <p className="text-gray-500 text-sm leading-relaxed">
            {user.bio}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-4 -mt-16 relative z-30">
          {/* Pass / Leave */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-16 h-16 rounded-full bg-[#8B3A3A] flex items-center justify-center text-white shadow-lg border-4 border-[#F3F4F6]"
          >
            <LogOut size={24} className="ml-1" />
          </motion.button>

          {/* Accept / Group */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-24 h-24 rounded-full bg-brand flex items-center justify-center text-white shadow-xl border-4 border-[#F3F4F6] -mt-8"
          >
            <Users size={40} />
          </motion.button>

          {/* Mute / Block */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-full bg-[#7C67AC] flex items-center justify-center text-white shadow-lg border-4 border-[#F3F4F6]"
          >
            <VolumeX size={24} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
