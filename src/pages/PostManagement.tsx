import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Globe, Clock, Sun, AlertTriangle, RotateCw, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PostManagement() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock Post Data
  const data = {
    title: "NEW SPA",
    address: "11, South Street London, SW 1 SRT",
    link: "www.newspa.com",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.",
    plan: 15,
    isExpired: true // Toggle this to test states if needed, but design shows expired state
  };

  // Background Image (Mock)
  const bgImage = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80";

  const handleDelete = () => {
    // Logic to delete
    navigate('/dashboard');
  };

  const handleRepost = () => {
    // Logic to repost
    navigate('/create-page');
  };

  return (
    <motion.div 
      className="min-h-screen bg-black relative flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-start">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 pb-48">
        
        {/* Title & Spinner */}
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-4xl font-bold text-white uppercase tracking-wide">
            {data.title}
          </h1>
          
          <div className="flex flex-col items-center text-white">
             <Sun className="animate-spin-slow mb-1" size={24} />
             <span className="text-[10px] font-bold uppercase">Hangout</span>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl">
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            {data.description}
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[#E9967A]">
              <MapPin size={20} />
              <span className="text-sm font-medium">{data.address}</span>
            </div>
            <div className="flex items-center gap-3 text-[#E9967A]">
              <Globe size={20} />
              <span className="text-sm font-medium">{data.link}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expired Overlay Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md pt-6 pb-12 px-8 rounded-t-[3rem] z-20 border-t border-white/10">
        
        {/* Timer Display */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 text-[#EAB308] mb-2">
            <AlertTriangle size={32} fill="currentColor" className="text-[#EAB308]" />
            <span className="text-5xl font-bold text-white tracking-wider">15:00:00</span>
          </div>
          <div className="flex gap-8 text-white/80 text-xs font-bold tracking-widest pl-10">
             <span>DAYS</span>
             <span>HOURS</span>
             <span>MINUTES</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="flex-1 bg-[#EAB308] text-white font-bold py-4 rounded-full shadow-lg hover:bg-[#EAB308]/90 transition-colors"
          >
            Delete
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleRepost}
            className="flex-1 bg-[#10B981] text-white font-bold py-4 rounded-full shadow-lg hover:bg-[#10B981]/90 transition-colors"
          >
            Repost
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
}
