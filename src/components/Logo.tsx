import { motion } from "framer-motion";

export const Logo = ({ className = "", size = 100 }: { className?: string; size?: number }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-2"
      >
        {/* 
          Updated W Logo:
          Thick, rounded orange W shape based on the reference image.
        */}
        <motion.path
          d="M 20 25 
             L 35 75 
             L 50 40 
             L 65 75 
             L 80 25"
          stroke="#E9967A"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      {/* Text removed in some contexts, but kept here if needed for Splash. 
          The header usually just uses the icon. */}
    </div>
  );
};
