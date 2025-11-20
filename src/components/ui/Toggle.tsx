import { motion } from "framer-motion";

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

export const Toggle = ({ isOn, onToggle }: ToggleProps) => {
  return (
    <div 
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isOn ? 'bg-brand/40' : 'bg-gray-300'}`} 
      onClick={onToggle}
    >
      <motion.div 
        className={`w-4 h-4 rounded-full shadow-md ${isOn ? 'bg-brand' : 'bg-white'}`}
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        animate={{ x: isOn ? 24 : 0 }}
      />
    </div>
  );
};
