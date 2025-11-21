import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function ProfileView() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstPhoto = user?.photos.find(p => p !== null);
  
  const displayData = {
    name: user?.username || "Guest",
    age: user?.birthday.year ? new Date().getFullYear() - parseInt(user.birthday.year) : 25,
    image: firstPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    bio: user?.about || "No bio yet."
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#F9F9F9] dark:bg-dark-bg flex flex-col transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Top Section: Hero Image */}
      <div className="relative h-[45vh] w-full bg-gray-200 dark:bg-gray-800">
        <img 
          src={displayData.image} 
          alt={displayData.name} 
          className="w-full h-full object-cover"
        />
        
        {/* Back Button Overlay */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 text-brand hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm bg-white/10 dark:bg-black/20"
        >
          <ArrowLeft size={28} strokeWidth={2.5} color="white" />
        </button>

        {/* Edit Button Overlay */}
        <button 
          onClick={() => navigate('/profile')}
          className="absolute top-4 right-4 p-2 text-brand hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm bg-white/10 dark:bg-black/20"
        >
          <Edit2 size={24} strokeWidth={2.5} color="white" />
        </button>
      </div>

      {/* Bottom Section: Content */}
      <div className="flex-1 px-6 py-8 -mt-6 relative z-10 bg-[#F9F9F9] dark:bg-dark-bg rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
        <div className="space-y-6">
          {/* Name & Age */}
          <h1 className="text-4xl font-bold text-brand">
            {displayData.name}, {displayData.age}
          </h1>

          {/* Bio Card */}
          <div className="bg-white dark:bg-dark-card rounded-[2rem] p-8 shadow-sm min-h-[150px] transition-colors duration-300">
            <p className="text-gray-500 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {displayData.bio}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
