import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface CircularButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const CircularButton = ({ className, active = false, ...props }: CircularButtonProps) => {
  return (
    <button
      className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95",
        active 
          ? "bg-brand shadow-brand/30 text-white" 
          : "bg-gray-400 shadow-gray-400/50 text-gray-400 hover:bg-gray-500",
        className
      )}
      {...props}
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
        active ? "bg-white text-brand" : "bg-white"
      )}>
        <Check className="w-6 h-6" strokeWidth={3} />
      </div>
    </button>
  );
};
