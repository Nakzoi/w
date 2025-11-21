import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: number;
  color?: string; // Allow dynamic color override
}

export const Logo = ({ className = "", size = 100, color }: LogoProps) => {
  // Default to brand color if no color provided, or inherit from text color if "currentColor"
  const strokeColor = color || "#E9967A";

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-0" // Removed bottom margin for better alignment in headers
      >
        {/* 
          W Logo
        */}
        <motion.path
          d="M 20 25 
             L 35 75 
             L 50 40 
             L 65 75 
             L 80 25"
          stroke={strokeColor === "currentColor" ? "currentColor" : strokeColor}
          strokeWidth="12" // Slightly thinner for small sizes to look cleaner
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
};
