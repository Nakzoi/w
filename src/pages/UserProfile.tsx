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
      "relative bg-white rounded-3xl overflow-hidden shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group",
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
      <Plus className="text-gray-300 w-8 h-8" strokeWidth={3} />
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
        // Compress image before saving to state/localStorage
        const compressedBase64 = await compressImage(file);
        
        const newPhotos = [...photos];
        newPhotos[activeSlot] = compressedBase64;
        setPhotos(newPhotos);
        
        // Auto-save to context immediately so it persists even if they don't click "VIEW"
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
    // Ensure latest state is pushed
    updateProfile({ photos, about });
    
    setTimeout(() => {
        setIsSaving(false);
        navigate('/profile-view');
    }, 300);
  };

  // Also auto-save 'about' on blur or change
  const handleAboutChange = (val: string) => {
      setAbout(val);
      updateProfile({ about: val });
  }

  const isComplete = photos.some(p => p !== null) && about.length > 0;

  return (
    <motion.div 
      className="min-h-screen bg-[#F9F9F9] flex flex-col"
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

      <div className="h-16 bg-[#F3EFEF] flex items-center justify-between px-4 shadow-sm sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 text-brand hover:bg-black/5 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        
        <h1 className="text-xl font-bold text-brand">{user?.username || "User name"}</h1>
        
        <button 
          onClick={handleSave}
          className="text-brand font-bold text-sm px-2 py-1 hover:bg-brand/10 rounded"
        >
          VIEW
        </button>
      </div>

      <div className="flex-1 px-6 py-6 flex flex-col overflow-y-auto">
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
          
          <p className="text-right text-gray-500 text-xs font-medium">
            Tap + to upload photos
          </p>
        </div>

        <div className="mt-6 mb-8">
          <h2 className="text-2xl font-bold text-brand mb-4">About</h2>
          <div className="bg-white rounded-3xl p-4 shadow-sm h-40 relative">
            <textarea
              value={about}
              onChange={(e) => handleAboutChange(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Write something about yourself..."
              className="w-full h-full resize-none bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 text-base p-0"
            />
          </div>
          <p className="mt-2 text-gray-500 text-sm font-medium">
            {MAX_CHARS - about.length} characters remaining
          </p>
        </div>

        <div className="mt-auto flex justify-center pb-4">
          <CircularButton 
            active={isComplete} 
            onClick={() => isComplete && handleSave()}
          />
        </div>
      </div>
    </motion.div>
  );
}
