import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

interface HangoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userAge: number;
  userImage: string;
  timeRemaining: string;
}

export function HangoutPopup({ 
  isOpen, 
  onClose, 
  userName, 
  userAge, 
  userImage, 
  timeRemaining = "3:00:00" 
}: HangoutPopupProps) {
  const navigate = useNavigate();
  
  const handleGoClick = () => {
    onClose();
    navigate('/hangout');
  };
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="w-full max-w-md bg-white rounded-3xl overflow-hidden relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with back button */}
          <div className="absolute top-4 left-4 z-10">
            <button 
              onClick={onClose}
              className="text-white"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {/* Profile section */}
          <div className="relative">
            <div className="h-32 bg-orange-500 relative">
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
                  <img 
                    src={userImage} 
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-16 pb-8 text-center">
              <h2 className="text-2xl font-bold text-orange-500">{userName}, {userAge}</h2>
              <p className="text-gray-600 mt-2">Your WeHood Hangout will be available for</p>
              
              <div className="text-6xl font-bold text-orange-500 my-6">
                {timeRemaining}
              </div>
              
              <button 
                className="bg-orange-500 text-white px-12 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-orange-600 transition-colors"
                onClick={handleGoClick}
              >
                GO
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 py-4 flex flex-col items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-orange-500"
              >
                <path 
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" 
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-500 mt-1">HOOD</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
