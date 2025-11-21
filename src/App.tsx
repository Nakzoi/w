import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
import HangoutDashboard from "./pages/HangoutDashboard";
import CreatePage from "./pages/CreatePage";
import FriendRequestView from "./pages/FriendRequestView";
import UserPostView from "./pages/UserPostView";
import ChatScreen from "./pages/ChatScreen";
import PostPreview from "./pages/PostPreview";
import PostManagement from "./pages/PostManagement";
import Posts from "./pages/Posts";

// Updated Screen Order for Horizontal Flow
// Settings <-> Location <-> Dashboard <-> ChatList <-> Posts
// Note: User requested specific swipes that imply this relative ordering or specific gesture overrides.
const SCREEN_ORDER = ['/settings', '/change-location', '/dashboard', '/chat', '/posts'];

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Determine direction based on index in SCREEN_ORDER
  const currentIndex = SCREEN_ORDER.indexOf(location.pathname);
  const previousIndex = SCREEN_ORDER.indexOf(location.state?.from || "");
  
  let direction = 0;
  
  // If both routes are in the main flow, calculate direction
  if (currentIndex !== -1 && previousIndex !== -1) {
    direction = currentIndex > previousIndex ? 1 : -1;
  }

  // If we are not in the main flow (e.g. Modals, Detail Views), use standard fade/scale
  const isMainFlow = currentIndex !== -1;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
      zIndex: 1
    }),
    center: {
      x: 0,
      opacity: 1,
      zIndex: 0
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 1,
      zIndex: 0
    })
  };

  const simpleVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 }
  };

  if (!isMainFlow) {
    return (
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={simpleVariants}
        transition={{ duration: 0.3 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      key={location.pathname}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className="absolute inset-0 w-full h-full bg-white dark:bg-dark-bg overflow-hidden"
    >
      {children}
    </motion.div>
  );
};

// Wrapper to handle AnimatePresence with Routes
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="popLayout" custom={location.pathname}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Splash /></PageWrapper>} />
        <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
        <Route path="/phone-login" element={<PageWrapper><PhoneNumber /></PageWrapper>} />
        <Route path="/verify-otp" element={<PageWrapper><OTPVerification /></PageWrapper>} />
        <Route path="/recovery" element={<PageWrapper><RecoveryEmail /></PageWrapper>} />
        
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        
        <Route path="/profile" element={<PageWrapper><UserProfile /></PageWrapper>} />
        <Route path="/profile-view" element={<PageWrapper><ProfileView /></PageWrapper>} />
        
        {/* Main Horizontal Flow */}
        <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
        <Route path="/change-location" element={<PageWrapper><ChangeLocation /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/chat" element={<PageWrapper><ChatList /></PageWrapper>} />
        <Route path="/posts" element={<PageWrapper><Posts /></PageWrapper>} />
        
        <Route path="/wehood-anywhere" element={<PageWrapper><WehoodAnywhere /></PageWrapper>} />
        
        {/* Hangout Flow */}
        <Route path="/hangout" element={<PageWrapper><HangoutDashboard /></PageWrapper>} />
        <Route path="/create-page" element={<PageWrapper><CreatePage /></PageWrapper>} />

        {/* New Detail Screens */}
        <Route path="/friend-request/:id" element={<PageWrapper><FriendRequestView /></PageWrapper>} />
        <Route path="/user-post/:id" element={<PageWrapper><UserPostView /></PageWrapper>} />
        
        {/* Chat Screen */}
        <Route path="/chat/:id" element={<PageWrapper><ChatScreen /></PageWrapper>} />

        {/* Custom Post Flow */}
        <Route path="/post-preview" element={<PageWrapper><PostPreview /></PageWrapper>} />
        <Route path="/post-management/:id" element={<PageWrapper><PostManagement /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="relative w-full h-screen overflow-hidden bg-black">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
