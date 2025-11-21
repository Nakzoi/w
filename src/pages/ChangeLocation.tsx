import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Settings as SettingsIcon, Loader2, MapPin } from "lucide-react";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

import { CompassIcon } from "../components/ui/CompassIcon";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";
import { useTheme } from "../context/ThemeContext";
import { WehoodAnywhereModal } from "../components/WehoodAnywhereModal";

// --- Map Components ---
const MapController = ({ onCenterChange }: { onCenterChange: (lat: number, lng: number) => void }) => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onCenterChange(center.lat, center.lng);
    },
  });
  return null;
};

const MapFlyTo = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 13, { duration: 2 });
  }, [coords, map]);
  return null;
};

export default function ChangeLocation() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // Swipe Logic
  // Swipe Left (Gesture) -> Go Right -> Dashboard
  // Swipe Right (Gesture) -> Go Left -> Settings
  const { onPanEnd } = useSwipeNavigation({ 
    rightRoute: "/dashboard",
    leftRoute: "/settings"
  });

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState<[number, number]>([22.3193, 114.1694]); 
  const [locationName, setLocationName] = useState("Hong Kong, Hong Kong");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          fetchAddress(pos.coords.latitude, pos.coords.longitude);
        },
        () => console.warn("Geo permission denied, using default.")
      );
    }
  }, []);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const addr = response.data.address;
      const city = addr.city || addr.town || addr.village || addr.state || "Unknown";
      const country = addr.country || "";
      setLocationName(`${city}, ${country}`);
    } catch (error) {
      console.error("Reverse geo failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapMove = (lat: number, lng: number) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchAddress(lat, lng);
    }, 800);
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      if (response.data && response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0];
        const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPos);
        const parts = display_name.split(",");
        setLocationName(parts.slice(0, 2).join(","));
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  const tileLayerUrl = theme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div 
      className="w-full h-full bg-[#F9F9F9] dark:bg-dark-bg flex flex-col relative transition-colors duration-300 overflow-hidden"
    >
      <motion.div className="w-full h-full flex flex-col" onPanEnd={onPanEnd}>
        {/* Header */}
        <div className="bg-[#FFF0EB] dark:bg-[#2A201E] pt-4 pb-6 px-6 rounded-b-[2rem] shadow-lg z-20 relative transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-brand/20">
              <CompassIcon size={20} color="#E9967A" />
            </div>
            <button onClick={() => navigate('/settings')}>
              <SettingsIcon className="text-gray-400 dark:text-gray-300" size={24} />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center gap-2">
              Current Location
              {loading && <Loader2 size={12} className="animate-spin" />}
            </p>
            <h1 className="text-2xl font-bold text-brand truncate pr-4">
              {locationName}
            </h1>
          </div>

          <div className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search city..."
              className="w-full bg-white dark:bg-dark-input h-12 rounded-full pl-5 pr-12 text-gray-700 dark:text-white focus:outline-none shadow-sm placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-brand transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="absolute inset-0 z-0 h-full w-full bg-gray-200 dark:bg-gray-800">
          <MapContainer 
            center={position} 
            zoom={13} 
            scrollWheelZoom={true} 
            zoomControl={false}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              url={tileLayerUrl}
            />
            <MapController onCenterChange={handleMapMove} />
            <MapFlyTo coords={position} />
          </MapContainer>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[400] -mt-8">
             <MapPin size={48} className="text-brand drop-shadow-lg" fill="currentColor" />
             <div className="w-3 h-3 bg-black/20 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 blur-[2px]" />
          </div>

          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#FFF0EB] dark:from-[#2A201E] to-transparent pointer-events-none z-[400]" />
        </div>

        {/* Floating Action Button */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center z-[500]">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsModalOpen(true)}
            className="w-24 h-24 bg-brand rounded-full flex items-center justify-center shadow-xl border-[6px] border-white dark:border-dark-card transition-colors"
          >
            <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15 12L12 22L9 12L12 2Z" fill="white" />
                  </svg>
               </motion.div>
            </div>
          </motion.button>
        </div>

        <WehoodAnywhereModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </motion.div>
    </div>
  );
}
