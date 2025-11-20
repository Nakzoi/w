import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

// Define the shape of our User Data
interface UserProfile {
  username: string;
  birthday: { month: string; day: string; year: string };
  gender: "male" | "female" | "brand";
  recoveryEmail: string;
  photos: (string | null)[];
  about: string;
  phoneNumber: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (phoneNumber: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  signInWithOtp: (phone: string) => Promise<{ error: any }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: any }>;
  isSupabaseConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_USER: UserProfile = {
  username: "",
  birthday: { month: "", day: "", year: "" },
  gender: "male",
  recoveryEmail: "",
  photos: [null, null, null, null, null, null],
  about: "",
  phoneNumber: "",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("wehood_auth");
    const storedUser = localStorage.getItem("wehood_user");

    if (storedAuth === "true" && storedUser) {
      try {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.removeItem("wehood_user");
      }
    }
    
    // Check Supabase session if configured
    if (isSupabaseConfigured) {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsAuthenticated(true);
                if (session.user.phone) {
                    // Merge session phone with local state if needed
                    setUser(prev => prev ? { ...prev, phoneNumber: session.user.phone! } : { ...INITIAL_USER, phoneNumber: session.user.phone! });
                }
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setIsAuthenticated(true);
                if (session.user.phone) {
                     setUser(prev => prev ? { ...prev, phoneNumber: session.user.phone! } : { ...INITIAL_USER, phoneNumber: session.user.phone! });
                }
            } else {
                // Optional: Handle logout if session expires
                // setIsAuthenticated(false); 
            }
        });

        return () => subscription.unsubscribe();
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem("wehood_auth", "true");
      try {
        localStorage.setItem("wehood_user", JSON.stringify(user));
      } catch (e) {
        console.error("Storage quota exceeded", e);
      }
    } else {
      localStorage.removeItem("wehood_auth");
      localStorage.removeItem("wehood_user");
    }
  }, [isAuthenticated, user]);

  const login = (phoneNumber: string) => {
    setIsAuthenticated(true);
    if (!user) {
      setUser({ ...INITIAL_USER, phoneNumber });
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    if (isSupabaseConfigured) {
        await supabase.auth.signOut();
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => {
        const updated = prev ? { ...prev, ...data } : { ...INITIAL_USER, ...data };
        return updated;
    });
  };

  // --- Real SMS Logic ---
  const signInWithOtp = async (phone: string) => {
    if (isSupabaseConfigured) {
        console.log("Attempting Real Supabase SMS to:", phone);
        return await supabase.auth.signInWithOtp({ phone });
    } else {
        // Simulation
        console.warn("Supabase not configured. Simulating SMS.");
        alert("DEV MODE: Supabase not connected. Simulating SMS sent to " + phone + ". Check your .env file and restart server to use real SMS.");
        return { error: null };
    }
  };

  const verifyOtp = async (phone: string, token: string) => {
    if (isSupabaseConfigured) {
         console.log("Verifying OTP with Supabase...");
         const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
         
         if (!error && data.session) {
             console.log("Supabase Login Success:", data.session);
             login(phone);
         }
         return { error };
    } else {
        // Simulation
        if (token.length === 4) { 
            login(phone);
            return { error: null };
        }
        return { error: { message: "Invalid code" } };
    }
  }

  return (
    <AuthContext.Provider value={{ 
        isAuthenticated, 
        user, 
        login, 
        logout, 
        updateProfile, 
        signInWithOtp, 
        verifyOtp,
        isSupabaseConnected: isSupabaseConfigured 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
