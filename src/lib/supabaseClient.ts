import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debugging: Log status to console (Safe: doesn't log full keys)
console.log("Supabase Config Check:", {
  hasUrl: !!supabaseUrl,
  urlValid: supabaseUrl && supabaseUrl !== "YOUR_SUPABASE_URL" && !supabaseUrl.includes("YOUR_API_KEY"),
  hasKey: !!supabaseAnonKey
});

// Robust check to see if Supabase is actually configured
export const isSupabaseConfigured = 
  typeof supabaseUrl === 'string' && 
  supabaseUrl.length > 0 && 
  !supabaseUrl.includes("YOUR_API_KEY") && // Check for placeholder
  !supabaseUrl.includes("YOUR_SUPABASE_URL") &&
  typeof supabaseAnonKey === 'string' && 
  supabaseAnonKey.length > 0 &&
  !supabaseAnonKey.includes("YOUR_API_KEY");

// Initialize the client safely.
// If keys are missing, we use a valid-format placeholder URL to prevent the "supabaseUrl is required" crash.
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : "https://placeholder.supabase.co",
  isSupabaseConfigured ? supabaseAnonKey : "placeholder"
);
