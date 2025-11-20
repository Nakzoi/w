import { motion } from "framer-motion";

export const CompassIcon = ({ size = 24, className = "", color = "currentColor" }: { size?: number, className?: string, color?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <motion.path 
      d="M12 6L14.5 12L12 18L9.5 12L12 6Z" 
      fill={color}
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, 15, -15, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  </svg>
);
