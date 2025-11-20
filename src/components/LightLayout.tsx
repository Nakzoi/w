import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { motion } from "framer-motion";

interface LightLayoutProps {
  children: ReactNode;
  title?: string;
}

export const LightLayout = ({ children }: LightLayoutProps) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="min-h-screen bg-[#F9F9F9] dark:bg-dark-bg flex flex-col transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="h-16 bg-[#F3EFEF] dark:bg-dark-card flex items-center justify-between px-4 shadow-sm transition-colors duration-300">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 text-brand hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="p-2 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-300">
          <User size={20} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-8 py-8 relative">
        {children}
      </div>
    </motion.div>
  );
};
