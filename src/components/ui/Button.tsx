import * as React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "w-full rounded-full px-6 py-4 text-lg font-semibold transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:pointer-events-none",
          variant === "primary" && "bg-white text-brand hover:bg-gray-50 shadow-lg shadow-black/5",
          variant === "outline" && "bg-transparent border-2 border-white text-white hover:bg-white/10",
          variant === "ghost" && "bg-transparent text-white hover:underline underline-offset-4 text-sm",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
