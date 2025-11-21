import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Users, Lock, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "../components/Logo";
import { compressImage } from "../lib/utils";

// Categories
const CATEGORIES = [
  "Drinks", "Food", "Party", "Explore", "Hangout", "Play", "Culture", "Events"
];

// Price Card Component
const PriceCard = ({ 
  days, 
  price, 
  isPopular = false, 
  selected, 
  onClick 
}: { 
  days: number, 
  price: string, 
  isPopular?: boolean, 
  selected: boolean,
  onClick: () => void 
}) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
    className={`relative flex flex-col items-center justify-center rounded-xl transition-all duration-300 overflow-hidden ${
      isPopular 
        ? "bg-brand text-white shadow-lg scale-110 z-10 w-28 h-36" 
        : "bg-white text-black shadow-sm w-24 h-28 opacity-90"
    } ${selected && !isPopular ? "ring-4 ring-brand" : ""}`}
  >
    <span className={`font-bold ${isPopular ? "text-5xl" : "text-3xl"}`}>
      {days}
    </span>
    <span className={`text-xs font-medium mb-1 ${isPopular ? "text-white/90" : "text-gray-500"}`}>
      days
    </span>
    <span className={`font-bold ${isPopular ? "text-xl" : "text-lg"}`}>
      $ {price}
    </span>
  </motion.button>
);

export default function CreatePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPlan, setSelectedPlan] = useState(15);
  const [chatType, setChatType] = useState<"GROUP" | "PRIVATE">("GROUP");
  
  // Image Upload State
  const [images, setImages] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    link: "",
    description: "",
    category: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (cat: string) => {
    setFormData({ ...formData, category: cat });
  };

  // Image Handling
  const handleSlotClick = (index: number) => {
    if (!images[index]) {
      setActiveSlot(index);
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activeSlot !== null) {
      try {
        const compressed = await compressImage(file);
        const newImages = [...images];
        newImages[activeSlot] = compressed;
        setImages(newImages);
      } catch (error) {
        alert("Error uploading image");
      }
      event.target.value = "";
    }
  };

  const handleView = () => {
    navigate('/post-preview', { 
      state: { 
        mode: 'preview',
        data: { ...formData, chatType, plan: selectedPlan, images }
      } 
    });
  };

  const handleCheckout = () => {
    navigate('/post-preview', { 
      state: { 
        mode: 'checkout',
        data: { ...formData, chatType, plan: selectedPlan, images }
      } 
    });
  };

  // Helper to render an image slot
  const ImageSlot = ({ index, className, iconSize = 24 }: { index: number, className: string, iconSize?: number }) => (
    <div 
      onClick={() => handleSlotClick(index)}
      className={`bg-white rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors group ${className}`}
    >
      {images[index] ? (
        <>
          <img src={images[index]!} alt="Upload" className="w-full h-full object-cover" />
          <button 
            onClick={(e) => handleRemoveImage(e, index)}
            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </>
      ) : (
        <Plus className="text-gray-300" size={iconSize} />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Header */}
      <header className="h-16 bg-[#F3EFEF] flex items-center justify-between px-4 shadow-sm sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="text-brand hover:bg-black/5 p-2 rounded-full transition-colors">
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>
        <div className="w-10 h-10 flex items-center justify-center">
           <Logo size={30} className="text-[#28B8D5]" /> 
        </div>
        <button onClick={handleView} className="text-brand font-bold text-lg px-2">
          VIEW
        </button>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4 pb-32">
          
          {/* Title */}
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-white rounded-xl p-4 text-lg text-gray-700 placeholder-gray-400 focus:outline-none shadow-sm"
          />

          {/* Image Grid (Mosaic) */}
          <div className="h-80 grid grid-cols-3 gap-3">
            {/* Large Left Image (Index 0) */}
            <ImageSlot index={0} className="col-span-2 row-span-2" iconSize={32} />
            
            {/* Top Right (Index 1) */}
            <ImageSlot index={1} className="col-span-1" />

            {/* Middle Right (Index 2) */}
            <ImageSlot index={2} className="col-span-1" />
          </div>
          
          {/* Bottom Row Images (Index 3, 4, 5) */}
          <div className="grid grid-cols-3 gap-3 h-28">
             <ImageSlot index={3} className="" />
             <ImageSlot index={4} className="" />
             <ImageSlot index={5} className="" />
          </div>

          {/* Address */}
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-white rounded-xl p-4 text-gray-700 placeholder-gray-400 focus:outline-none shadow-sm"
          />

          {/* Link */}
          <input
            name="link"
            placeholder="Link (ex: www.google.co.in)"
            value={formData.link}
            onChange={handleChange}
            className="w-full bg-white rounded-xl p-4 text-gray-700 placeholder-gray-400 focus:outline-none shadow-sm"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-white rounded-xl p-4 text-gray-700 placeholder-gray-400 focus:outline-none shadow-sm resize-none"
          />

          {/* Category Selection */}
          <div className="space-y-2">
            <p className="text-gray-500 font-bold ml-1">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                    formData.category === cat 
                      ? "bg-brand text-white shadow-md" 
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Type Toggles */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => setChatType("GROUP")}
              className={`w-full p-4 rounded-full flex items-center justify-center gap-3 shadow-sm transition-colors ${
                chatType === "GROUP" ? "bg-brand text-white" : "bg-white text-gray-500"
              }`}
            >
              <Users size={24} fill={chatType === "GROUP" ? "currentColor" : "none"} />
              <span className="font-bold">Accept requests as GROUP chat</span>
            </button>

            <button
              onClick={() => setChatType("PRIVATE")}
              className={`w-full p-4 rounded-full flex items-center justify-center gap-3 shadow-sm transition-colors ${
                chatType === "PRIVATE" ? "bg-[#7C67AC] text-white" : "bg-white text-gray-800"
              }`}
            >
              <div className="relative">
                 <Lock size={24} />
                 <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                 </div>
              </div>
              <span className="font-bold">Accept requests as PRIVATE chat</span>
            </button>
          </div>

        </div>
      </div>

      {/* Dark Pricing Section (Sticky Bottom) */}
      <div className="bg-[#002b36] pt-8 pb-8 px-4 rounded-t-[2.5rem] -mt-6 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        
        {/* Pricing Cards */}
        <div className="flex items-center justify-center gap-4 mb-8">
           <PriceCard 
             days={3} 
             price="1.00" 
             selected={selectedPlan === 3} 
             onClick={() => setSelectedPlan(3)}
           />
           <PriceCard 
             days={15} 
             price="5.00" 
             isPopular 
             selected={selectedPlan === 15} 
             onClick={() => setSelectedPlan(15)}
           />
           <PriceCard 
             days={30} 
             price="10.00" 
             selected={selectedPlan === 30} 
             onClick={() => setSelectedPlan(30)}
           />
        </div>

        {/* Checkout Button */}
        <div className="flex flex-col items-center gap-2">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleCheckout}
            className="w-20 h-20 bg-[#002b36] rounded-full flex items-center justify-center border-4 border-white shadow-lg relative"
          >
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
               <div className="w-10 h-10 bg-[#002b36] rounded-full flex items-center justify-center">
                  <Check className="text-white w-6 h-6" strokeWidth={4} />
               </div>
            </div>
          </motion.button>
          <span className="text-white font-medium">Checkout</span>
        </div>
      </div>
    </div>
  );
}
