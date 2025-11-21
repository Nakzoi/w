import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { CircularButton } from "../components/ui/CircularButton";
import { cn, compressImage } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

interface PhotoSlotProps {
  index: number;
  image?: string | null;
  onAdd: (index: number) => void;
  onRemove: (index: number) => void;
  className?: string;
}

const PhotoSlot = ({ index, image, onAdd, onRemove, className }: PhotoSlotProps) => (
  <div 
    onClick={() => !image && onAdd(index)}
    className={cn(
      "relative bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group border border-transparent dark:border-gray-800",
      className
    )}
  >
    {image ? (
      <>
        <img src={image} alt={`Slot ${index}`} className="w-full h-full object-cover" />
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(index); }}
          className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <X size={14} />
        </button>
      </>
    ) : (
      <Plus className="text-gray-300 dark:text-gray-600 w-8 h-8" strokeWidth={3} />
    )}
  </div>
);

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const [about, setAbout] = useState("");
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const MAX_CHARS = 125;

  useEffect(() => {
    if (user) {
      if (user.photos) setPhotos(user.photos);
      if (user.about) setAbout(user.about);
    }
  }, [user]);

  const handleAddPhoto = (index: number) => {
    setActiveSlot(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activeSlot !== null) {
      try {
        const compressedBase64 = await compressImage(file);
        const newPhotos = [...photos];
        newPhotos[activeSlot] = compressedBase64;
        setPhotos(newPhotos);
        updateProfile({ photos: newPhotos });
      } catch (error) {
        console.error("Error processing image", error);
        alert("Could not upload image. Please try a smaller one.");
      }
      event.target.value = "";
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
    updateProfile({ photos: newPhotos });
  };

  const handleSave = () => {
    setIsSaving(true);
    updateProfile({ photos, about });
    setTimeout(() => {
        setIsSaving(false);
        navigate('/dashboard');
    }, 300);
  };

  const handleAboutChange = (val: string) => {
      setAbout(val);
      updateProfile({ about: val });
  }

  const isComplete = photos.some(p => p !== null) && about.length > 0;

  return (
    <motion.div 
      className="h-screen bg-[#F9F9F9] dark:bg-dark-bg flex flex-col transition-colors duration-300 overflow-hidden"
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

      {/* Header */}
      <div className="h-16 bg-[#F3EFEF] dark:bg-dark-card flex items-center justify-between px-4 shadow-sm flex-shrink-0 z-20 transition-colors duration-300">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 text-brand hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        
        <h1 className="text-xl font-bold text-brand">{user?.username || "User name"}</h1>
        
        <button 
          onClick={() => navigate('/profile-view')}
          className="text-brand font-bold text-sm px-2 py-1 hover:bg-brand/10 rounded transition-colors"
        >
          VIEW
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-4 mb-2">
          <div className="flex gap-4 h-64">
            <PhotoSlot 
              index={0} 
              image={photos[0]} 
              onAdd={handleAddPhoto} 
              onRemove={handleRemovePhoto}
              className="flex-[2] h-full" 
            />
            <div className="flex-1 flex flex-col gap-4 h-full">
              <PhotoSlot 
                index={1} 
                image={photos[1]} 
                onAdd={handleAddPhoto} 
                onRemove={handleRemovePhoto}
                className="flex-1" 
              />
              <PhotoSlot 
                index={2} 
                image={photos[2]} 
                onAdd={handleAddPhoto} 
                onRemove={handleRemovePhoto}
                className="flex-1" 
              />
            </div>
          </div>

          <div className="flex gap-4 h-28">
            <PhotoSlot 
              index={3} 
              image={photos[3]} 
              onAdd={handleAddPhoto} 
              onRemove={handleRemovePhoto}
              className="flex-1" 
            />
            <PhotoSlot 
              index={4} 
              image={photos[4]} 
              onAdd={handleAddPhoto} 
              onRemove={handleRemovePhoto}
              className="flex-1" 
            />
            <PhotoSlot 
              index={5} 
              image={photos[5]} 
              onAdd={handleAddPhoto} 
              onRemove={handleRemovePhoto}
              className="flex-1" 
            />
          </div>
          
          <p className="text-right text-gray-500 dark:text-gray-400 text-xs font-medium">
            Tap + to upload photos
          </p>
        </div>

        {/* About Section */}
        <div className="mt-6 mb-8">
          <h2 className="text-2xl font-bold text-brand mb-4">About</h2>
          <div className="bg-white dark:bg-dark-card rounded-3xl p-4 shadow-sm h-40 relative transition-colors duration-300 border border-transparent dark:border-gray-800">
            <textarea
              value={about}
              onChange={(e) => handleAboutChange(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Write something about yourself..."
              className="w-full h-full resize-none bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 text-base p-0 scrollbar-hide outline-none"
            />
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm font-medium text-right">
            {MAX_CHARS - about.length} characters remaining
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-center pb-8">
          <CircularButton 
            active={isComplete} 
            onClick={() => isComplete && handleSave()}
          />
        </div>
      </div>
    </motion.div>
  );
}
