import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "../components/Logo";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 2500); // Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-brand"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Logo size={120} />
    </motion.div>
  );
}
