import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import PhoneNumber from "./pages/PhoneNumber";
import OTPVerification from "./pages/OTPVerification";
import RecoveryEmail from "./pages/RecoveryEmail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import ProfileView from "./pages/ProfileView";
import Dashboard from "./pages/Dashboard";
import ChatList from "./pages/ChatList";
import Settings from "./pages/Settings";
import ChangeLocation from "./pages/ChangeLocation";
import WehoodAnywhere from "./pages/WehoodAnywhere";
import Posts from "./pages/Posts";
import HangoutDashboard from "./pages/HangoutDashboard";
import CreatePage from "./pages/CreatePage";

// Wrapper to handle AnimatePresence with Routes
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Splash />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/phone-login" element={<PhoneNumber />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/recovery" element={<RecoveryEmail />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile-view" element={<ProfileView />} />
        
        {/* Main Flow */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/chat" element={<ChatList />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Location & Premium */}
        <Route path="/change-location" element={<ChangeLocation />} />
        <Route path="/wehood-anywhere" element={<WehoodAnywhere />} />
        
        {/* Hangout Flow */}
        <Route path="/hangout" element={<HangoutDashboard />} />
        <Route path="/create-page" element={<CreatePage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
