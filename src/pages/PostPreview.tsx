import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { ArrowLeft, MapPin, Globe, Clock, Check, LogOut, Hand, Sun, Edit2, Save, AlertTriangle, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PaymentModal } from "../components/PaymentModal";
import { useHangout } from "../context/HangoutContext";
import { compressImage, cn } from "../lib/utils";

// Reusable Warning Modal
const WarningModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-[80] backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] bg-white rounded-3xl p-8 w-80 flex flex-col items-center text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500">
             <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Cancel Event?</h3>
          <p className="text-gray-500 text-sm mb-6">
            Are you sure you want to cancel this event? <br/>
            <span className="font-bold text-red-500">Payment will not be refunded.</span>
          </p>
          
          <div className="flex w-full gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-gray-200 font-bold text-gray-600 hover:bg-gray-50"
            >
              No
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-3 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-200"
            >
              Yes, Cancel
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function PostPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createPaidPost, extendPaidPost, cancelPaidPost } = useHangout();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [paymentReason, setPaymentReason] = useState<"checkout" | "extend">("checkout");

  // Get data from navigation state
  const { mode, data, isOwner } = location.state || { 
    mode: 'preview', 
    isOwner: false,
    data: {
      title: "NEW SPA",
      address: "11, South Street London, SW 1 SRT",
      link: "www.newspa.com",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.",
      plan: 15,
      images: []
    }
  };

  const isCheckout = mode === 'checkout';
  
  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    description: data.description,
    address: data.address,
    link: data.link,
    images: data.images || []
  });
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  // --- Image Editing Logic ---
  const handleSlotClick = (index: number) => {
    if (isEditing) {
      setActiveSlot(index);
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activeSlot !== null) {
      try {
        const compressed = await compressImage(file);
        const newImages = [...(editData.images || [])];
        // Ensure array is large enough
        while (newImages.length <= activeSlot) newImages.push(null);
        newImages[activeSlot] = compressed;
        setEditData({ ...editData, images: newImages });
      } catch (error) {
        alert("Error uploading image");
      }
      event.target.value = "";
    }
  };

  const handleRemoveImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (isEditing) {
        const newImages = [...editData.images];
        newImages[index] = null; // Or splice if you want to shift
        setEditData({ ...editData, images: newImages });
    }
  };

  // Background Image (First available image)
  const bgImage = editData.images.find((img: string | null) => img) || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80";

  const handleCheckoutClick = () => {
    setPaymentReason("checkout");
    setIsPaymentOpen(true);
  };
  
  const handleExtendClick = () => {
    setPaymentReason("extend");
    setIsPaymentOpen(true);
  };

  const handleCancelEvent = () => {
    setIsWarningOpen(true);
  };

  const confirmCancel = () => {
    cancelPaidPost();
    setIsWarningOpen(false);
    navigate('/dashboard');
  };

  const handlePaymentSuccess = () => {
    if (paymentReason === "checkout") {
        createPaidPost(data.title || "My Post", data.plan || 15);
    } else {
        extendPaidPost(15); // Default extension
    }
    setIsPaymentOpen(false);
    navigate('/dashboard');
  };

  const handleSave = () => {
    setIsEditing(false);
    // Update local data display (mock)
    data.description = editData.description;
    data.address = editData.address;
    data.link = editData.link;
    data.images = editData.images;
  };

  return (
    <motion.div 
      className="min-h-screen bg-black relative flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover opacity-90 transition-all duration-500" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-start">
        <button 
          onClick={() => navigate(-1)}
          className="text-white hover:bg-white/20 p-2 rounded-full transition-colors backdrop-blur-sm bg-black/10"
        >
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>

        {/* Edit Button (Only for Owner) */}
        {isOwner && !isCheckout && (
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`p-2 rounded-full transition-colors backdrop-blur-sm shadow-lg ${
              isEditing ? "bg-green-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {isEditing ? <Save size={24} /> : <Edit2 size={24} />}
          </button>
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 pb-32">
        
        {/* Title & Spinner (Read Only) */}
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-4xl font-bold text-white uppercase tracking-wide drop-shadow-lg">
            {data.title || "New Spa"}
          </h1>
          
          <div className="flex flex-col items-center text-white drop-shadow-lg">
             <Sun className="animate-spin-slow mb-1" size={24} />
             <span className="text-[10px] font-bold uppercase">Hangout</span>
          </div>
        </div>

        {/* Warning when editing */}
        <AnimatePresence>
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-yellow-500/90 backdrop-blur-md text-white p-3 rounded-xl mb-4 flex items-center gap-3 shadow-lg"
            >
              <AlertTriangle size={20} className="flex-shrink-0" />
              <p className="text-xs font-bold">
                Note: You can only edit description, location, link, and photos. Title and time cannot be changed.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-2xl">
          
          {/* Image Editing Grid (Only visible in edit mode) */}
          {isEditing && (
             <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {[0, 1, 2].map((idx) => (
                   <div 
                     key={idx}
                     onClick={() => handleSlotClick(idx)}
                     className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden cursor-pointer border border-gray-200"
                   >
                      {editData.images[idx] ? (
                        <>
                           <img src={editData.images[idx]!} className="w-full h-full object-cover" />
                           <button 
                             onClick={(e) => handleRemoveImage(e, idx)}
                             className="absolute top-1 right-1 bg-black/50 text-white p-0.5 rounded-full"
                           >
                             <X size={12} />
                           </button>
                        </>
                      ) : (
                        <Plus className="text-gray-400" />
                      )}
                   </div>
                ))}
             </div>
          )}

          {isEditing ? (
            <textarea 
              value={editData.description}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              className="w-full h-32 p-2 border border-gray-200 rounded-lg mb-4 text-gray-700 text-sm focus:outline-brand resize-none"
              placeholder="Edit Description"
            />
          ) : (
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {editData.description || "No description provided."}
            </p>
          )}

          <div className="space-y-3">
            {/* Address */}
            <div className="flex items-center gap-3 text-[#E9967A]">
              <MapPin size={20} className="flex-shrink-0" />
              {isEditing ? (
                <input 
                  value={editData.address}
                  onChange={(e) => setEditData({...editData, address: e.target.value})}
                  className="flex-1 border-b border-gray-300 focus:border-brand outline-none text-sm font-medium text-gray-700"
                />
              ) : (
                <span className="text-sm font-medium">{editData.address || "No address"}</span>
              )}
            </div>

            {/* Link */}
            <div className="flex items-center gap-3 text-[#E9967A]">
              <Globe size={20} className="flex-shrink-0" />
              {isEditing ? (
                <input 
                  value={editData.link}
                  onChange={(e) => setEditData({...editData, link: e.target.value})}
                  className="flex-1 border-b border-gray-300 focus:border-brand outline-none text-sm font-medium text-gray-700"
                />
              ) : (
                <span className="text-sm font-medium">{editData.link || "No link"}</span>
              )}
            </div>

            {/* Duration (Read Only) */}
            <div className="flex items-center gap-3 text-[#7C7C7C]">
              <Clock size={20} className="flex-shrink-0" />
              <span className="text-sm font-medium">{data.plan || 15} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      {isEditing ? (
         // Edit Mode Actions
         <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex justify-center gap-4 bg-black/80 backdrop-blur-md rounded-t-[2rem]">
            <button 
              onClick={handleCancelEvent}
              className="flex-1 bg-red-600 text-white font-bold py-4 rounded-full shadow-lg hover:bg-red-700 transition-colors flex flex-col items-center"
            >
              <span>Cancel Event</span>
              <span className="text-[10px] opacity-80 font-normal">No Refund</span>
            </button>
            <button 
              onClick={handleExtendClick}
              className="flex-1 bg-brand text-white font-bold py-4 rounded-full shadow-lg hover:bg-brand/90 transition-colors"
            >
              Extend Event
            </button>
         </div>
      ) : (
        // Normal Mode Actions
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex justify-center">
          {isCheckout ? (
            // Checkout Button
            <div className="flex flex-col items-center gap-2">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handleCheckoutClick}
                className="w-20 h-20 rounded-full border-4 border-brand flex items-center justify-center bg-brand/20 backdrop-blur-sm shadow-lg"
              >
                <div className="w-14 h-14 bg-brand rounded-full flex items-center justify-center">
                   <Check className="text-white w-8 h-8" strokeWidth={4} />
                </div>
              </motion.button>
              <span className="text-brand font-bold text-lg shadow-black drop-shadow-md">Checkout</span>
            </div>
          ) : (
            // View Actions (Exit / Request) - Only show if NOT owner
            !isOwner && (
              <div className="flex gap-12">
                 <motion.button 
                   whileTap={{ scale: 0.9 }}
                   onClick={() => navigate(-1)}
                   className="w-16 h-16 bg-[#8B3A3A] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white/10"
                 >
                   <LogOut size={24} className="ml-1" />
                 </motion.button>

                 <motion.button 
                   whileTap={{ scale: 0.9 }}
                   className="w-16 h-16 bg-brand rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white/10"
                 >
                   <Hand size={28} />
                 </motion.button>
              </div>
            )
          )}
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        amount={data.plan === 3 ? "1.00" : data.plan === 15 ? "5.00" : "10.00"}
      />

      {/* Warning Modal */}
      <WarningModal 
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        onConfirm={confirmCancel}
      />

      {/* Pagination Dots (Mock) */}
      {!isEditing && (
        <div className="absolute top-1/2 left-0 right-0 flex justify-center gap-2 z-10 -mt-32 pointer-events-none">
          <div className="w-2 h-2 bg-white rounded-full opacity-100" />
          <div className="w-2 h-2 bg-white rounded-full opacity-50" />
          <div className="w-2 h-2 bg-white rounded-full opacity-50" />
        </div>
      )}
    </motion.div>
  );
}
