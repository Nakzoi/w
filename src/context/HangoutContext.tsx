import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PaidPost {
  title: string;
  daysRemaining: number;
  isActive: boolean;
}

interface HangoutContextType {
  // Hangout (Free Activity) State
  isHangoutActive: boolean;
  activeCategory: string; // Added to track which activity is active
  timeRemaining: string;
  startHangout: (category: string) => void; // Updated signature
  cancelHangout: () => void;
  
  // Paid Post State
  paidPost: PaidPost | null;
  createPaidPost: (title: string, days: number) => void;
  extendPaidPost: (days: number) => void;
  cancelPaidPost: () => void;
}

const HangoutContext = createContext<HangoutContextType | undefined>(undefined);

export const HangoutProvider = ({ children }: { children: ReactNode }) => {
  // --- Hangout Logic ---
  const [isHangoutActive, setIsHangoutActive] = useState(() => {
    return localStorage.getItem("wehood_hangout_active") === "true";
  });
  
  const [activeCategory, setActiveCategory] = useState(() => {
    return localStorage.getItem("wehood_hangout_category") || "Hangout";
  });
  
  const [endTime, setEndTime] = useState<number | null>(() => {
    const stored = localStorage.getItem("wehood_hangout_end");
    return stored ? parseInt(stored) : null;
  });

  const [timeRemaining, setTimeRemaining] = useState("3:00:00");

  const startHangout = (category: string) => {
    const newEndTime = Date.now() + 3 * 60 * 60 * 1000; // 3 hours
    setIsHangoutActive(true);
    setActiveCategory(category);
    setEndTime(newEndTime);
    
    localStorage.setItem("wehood_hangout_active", "true");
    localStorage.setItem("wehood_hangout_category", category);
    localStorage.setItem("wehood_hangout_end", newEndTime.toString());
  };

  const cancelHangout = () => {
    setIsHangoutActive(false);
    setActiveCategory("Hangout");
    setEndTime(null);
    
    localStorage.removeItem("wehood_hangout_active");
    localStorage.removeItem("wehood_hangout_category");
    localStorage.removeItem("wehood_hangout_end");
    setTimeRemaining("3:00:00");
  };

  useEffect(() => {
    if (isHangoutActive && endTime) {
      const updateTimer = () => {
        const now = Date.now();
        const diff = Math.max(0, endTime - now);
        
        if (diff <= 0) {
          cancelHangout();
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeRemaining(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      };

      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [isHangoutActive, endTime]);

  // --- Paid Post Logic ---
  const [paidPost, setPaidPost] = useState<PaidPost | null>(() => {
    const stored = localStorage.getItem("wehood_paid_post");
    return stored ? JSON.parse(stored) : null;
  });

  const createPaidPost = (title: string, days: number) => {
    const newPost = { title, daysRemaining: days, isActive: true };
    setPaidPost(newPost);
    localStorage.setItem("wehood_paid_post", JSON.stringify(newPost));
  };

  const extendPaidPost = (days: number) => {
    if (paidPost) {
      const updated = { ...paidPost, daysRemaining: paidPost.daysRemaining + days };
      setPaidPost(updated);
      localStorage.setItem("wehood_paid_post", JSON.stringify(updated));
    } else {
      // If extending a free post, create a new paid post
      createPaidPost(activeCategory, days);
    }
  };

  const cancelPaidPost = () => {
    setPaidPost(null);
    localStorage.removeItem("wehood_paid_post");
  };

  return (
    <HangoutContext.Provider value={{ 
      isHangoutActive, 
      activeCategory,
      timeRemaining, 
      startHangout, 
      cancelHangout,
      paidPost,
      createPaidPost,
      extendPaidPost,
      cancelPaidPost
    }}>
      {children}
    </HangoutContext.Provider>
  );
};

export const useHangout = () => {
  const context = useContext(HangoutContext);
  if (context === undefined) {
    throw new Error("useHangout must be used within a HangoutProvider");
  }
  return context;
};
