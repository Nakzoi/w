import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { 
  ArrowLeft, 
  Phone, 
  Camera, 
  X, 
  Sun, 
  User,
  Settings,
  MessageCircle,
  SendHorizontal,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../components/Logo";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Mock Data for the Chat
const INITIAL_MESSAGES = [
  {
    id: 1,
    type: "text",
    sender: "other",
    text: "hello",
    time: "3:06 pm",
    avatar: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 2,
    type: "card",
    sender: "me",
    title: "New Spa",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=640&q=80",
    count: 136,
    time: "3:07 pm"
  }
];

type ModalType = 'none' | 'phone' | 'camera' | 'settings' | 'meeting';

// Meeting Point Modal Component
const MeetingPointModal = ({ isOpen, onClose, onShare }: { isOpen: boolean, onClose: () => void, onShare: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-0 z-50 bg-white dark:bg-dark-bg flex flex-col"
        >
          {/* Map Header */}
          <div className="absolute top-4 left-4 z-[1000]">
            <button 
              onClick={onClose}
              className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-black"
            >
              <ArrowLeft size={24} />
            </button>
          </div>

          {/* Map Area */}
          <div className="flex-1 relative">
            <MapContainer 
              center={[51.505, -0.09]} 
              zoom={13} 
              scrollWheelZoom={false}
              zoomControl={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <Marker position={[51.505, -0.09]} />
            </MapContainer>
            
            {/* Center Pin Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[900] -mt-8">
               <MapPin size={48} className="text-[#E9967A] drop-shadow-lg" fill="currentColor" />
            </div>
          </div>

          {/* Bottom Sheet */}
          <div className="bg-white dark:bg-dark-card p-6 pb-8 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] -mt-6 relative z-[1000]">
            <div className="flex gap-4 mb-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=300&q=80" 
                  alt="Location" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">City Old Place</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm mb-6 px-2">
               <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>7.9 mi</span>
               </div>
               <div className="flex items-center gap-2">
                  <Sun size={16} />
                  <span>5 h</span>
               </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={onShare}
                className="w-20 h-20 bg-[#28B8D5] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none"
              >
                 <Logo size={40} color="white" />
              </motion.button>
              <span className="text-gray-500 dark:text-gray-400 font-bold text-sm">Share meeting point</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function ChatScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const chatName = location.state?.name || "Otter"; // Dynamic Name

  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isSupabaseConfigured) {
        const channel = supabase
            .channel(`chat:${id}`)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages',
                filter: `chat_id=eq.${id}`
            }, (payload) => {
                const newMsg = payload.new;
                setMessages(prev => [...prev, {
                    id: newMsg.id,
                    type: newMsg.type || 'text',
                    sender: newMsg.sender_id === 'me' ? 'me' : 'other',
                    text: newMsg.content,
                    time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    avatar: "https://i.pravatar.cc/150?u=realtime"
                }]);
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }
  }, [messages, id]);

  const closeModal = () => setActiveModal('none');

  const handleSend = async () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now(),
        type: "text",
        sender: "me",
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: ""
      };
      setMessages([...messages, newMessage]);
      setInputText("");
    }
  };

  const handleShareMeetingPoint = () => {
    const newMessage = {
      id: Date.now(),
      type: "text",
      sender: "me",
      text: "📍 Shared a meeting point: City Old Place",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: ""
    };
    setMessages([...messages, newMessage]);
    closeModal();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  // Reusable Bottom Sheet
  const BottomSheet = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 bg-transparent z-50 p-4 flex flex-col items-center justify-end pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-sm bg-white dark:bg-dark-card rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="py-2">
            {children}
          </div>
          
          <div className="py-4 flex justify-center border-t border-gray-100 dark:border-gray-800">
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full border-2 border-black dark:border-white flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-black dark:text-white"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );

  const MenuOption = ({ label, onClick, isLast = false }: { label: string, onClick?: () => void, isLast?: boolean }) => (
    <button 
      onClick={onClick}
      className={`w-full py-5 text-center font-bold text-xl text-black dark:text-white active:bg-gray-50 dark:active:bg-gray-800 ${!isLast ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-dark-bg flex flex-col relative overflow-hidden transition-colors duration-300">
      
      {/* Header */}
      <header className="h-16 bg-[#F3F4F6] dark:bg-dark-card flex items-center justify-between px-4 sticky top-0 z-10 transition-colors duration-300">
        <button 
          onClick={() => navigate(-1)}
          className="text-brand hover:bg-black/5 dark:hover:bg-white/10 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>

        <div className="flex items-center gap-2">
          <Sun className="text-black dark:text-white w-6 h-6 animate-spin-slow" strokeWidth={2} />
          <h1 className="text-2xl font-bold text-black dark:text-white">{chatName}</h1>
        </div>

        <button 
          onClick={() => setActiveModal('settings')}
          className="text-gray-400 hover:text-brand p-2 transition-colors relative"
        >
          <div className="relative flex items-center justify-center">
            <MessageCircle size={32} strokeWidth={1.5} />
            <Settings size={14} className="absolute mb-1" strokeWidth={2.5} />
          </div>
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex w-full ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'other' && (
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-white dark:border-dark-card shadow-sm flex-shrink-0">
                <img src={msg.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex flex-col max-w-[70%]">
              {msg.type === 'text' ? (
                <div className="bg-[#E9967A] text-white px-6 py-3 rounded-2xl rounded-tl-none text-lg shadow-sm">
                  {msg.text}
                </div>
              ) : (
                <div className="bg-black rounded-2xl overflow-hidden shadow-lg relative w-48 h-48">
                  <img src={msg.image} alt={msg.title} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-bold text-lg leading-none mb-1">{msg.title}</p>
                    <div className="flex items-center gap-1 text-white/90 text-xs">
                      <User size={12} fill="currentColor" />
                      <span>{msg.count}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <span className={`text-xs text-gray-400 dark:text-gray-500 mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Input Area */}
      <div className="bg-[#F3F4F6] dark:bg-dark-card px-4 pb-8 pt-2 transition-colors duration-300">
        <div className="bg-white dark:bg-dark-input rounded-lg shadow-sm mb-6 flex items-center pr-2 border border-transparent dark:border-gray-700">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="w-full px-4 py-4 text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none"
          />
          <button 
            onClick={handleSend}
            className="p-2 text-brand hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors"
            disabled={!inputText.trim()}
          >
            <SendHorizontal size={24} />
          </button>
        </div>

        <div className="flex justify-between items-center px-4">
          <button 
            onClick={() => setActiveModal('phone')}
            className="text-[#E9967A] hover:bg-[#E9967A]/10 p-3 rounded-full transition-colors"
          >
            <Phone size={32} strokeWidth={2} />
          </button>

          {/* Meeting Point Button (Blue) */}
          <button 
             onClick={() => setActiveModal('meeting')}
             className="w-16 h-16 flex items-center justify-center -mt-2 bg-[#28B8D5] rounded-full shadow-lg shadow-blue-200 dark:shadow-none hover:scale-105 transition-transform"
          >
             <Logo size={40} color="white" />
          </button>

          <button 
            onClick={() => setActiveModal('camera')}
            className="text-[#E9967A] hover:bg-[#E9967A]/10 p-3 rounded-full transition-colors"
          >
            <Camera size={32} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal !== 'none' && activeModal !== 'meeting' && (
          <BottomSheet onClose={closeModal}>
            {activeModal === 'phone' && (
              <>
                <MenuOption label="Phonecall" />
                <MenuOption label="Videocall" />
                <MenuOption label="Voicemail" isLast />
              </>
            )}
            {activeModal === 'camera' && (
              <>
                <MenuOption label="Library" />
                <MenuOption label="Take a picture" />
                <MenuOption label="Take a video" isLast />
              </>
            )}
            {activeModal === 'settings' && (
              <>
                <MenuOption label="Delete chat" />
                <MenuOption label="Remove user" />
                <MenuOption label="Report" isLast />
              </>
            )}
          </BottomSheet>
        )}
      </AnimatePresence>

      {/* Full Screen Meeting Modal */}
      <MeetingPointModal 
        isOpen={activeModal === 'meeting'} 
        onClose={closeModal}
        onShare={handleShareMeetingPoint}
      />

    </div>
  );
}
