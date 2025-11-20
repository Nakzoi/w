import { useNavigate } from "react-router-dom";
import { PanInfo } from "framer-motion";

interface SwipeConfig {
  leftRoute?: string;  // Route to go to when swiping RIGHT (revealing left content)
  rightRoute?: string; // Route to go to when swiping LEFT (revealing right content)
  threshold?: number;
}

export const useSwipeNavigation = ({ leftRoute, rightRoute, threshold = 100 }: SwipeConfig) => {
  const navigate = useNavigate();

  const onPanEnd = (_: any, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipePower = Math.abs(offset.x) * velocity.x;

    // Swipe Right (Go to Left Route)
    if (offset.x > threshold && leftRoute) {
      navigate(leftRoute);
    }
    // Swipe Left (Go to Right Route)
    else if (offset.x < -threshold && rightRoute) {
      navigate(rightRoute);
    }
  };

  return { onPanEnd };
};
