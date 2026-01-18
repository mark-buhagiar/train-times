/**
 * SlideIn - Slide in animation wrapper
 * Slides content into view from a direction
 */

import { ReactNode, useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

type Direction = "left" | "right" | "top" | "bottom";

interface SlideInProps {
  children: ReactNode;
  /** Direction to slide from */
  direction?: Direction;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Distance to slide from (default: 20) */
  distance?: number;
  /** Whether to also fade in */
  fade?: boolean;
  /** Style to apply to the container */
  style?: ViewStyle;
  /** Additional class names */
  className?: string;
}

const springConfig = {
  damping: 20,
  stiffness: 200,
  mass: 0.8,
};

export function SlideIn({
  children,
  direction = "bottom",
  delay = 0,
  distance = 20,
  fade = true,
  style,
  className,
}: SlideInProps) {
  const translateX = useSharedValue(
    direction === "left" ? -distance : direction === "right" ? distance : 0
  );
  const translateY = useSharedValue(
    direction === "top" ? -distance : direction === "bottom" ? distance : 0
  );
  const opacity = useSharedValue(fade ? 0 : 1);

  useEffect(() => {
    translateX.value = withDelay(delay, withSpring(0, springConfig));
    translateY.value = withDelay(delay, withSpring(0, springConfig));
    if (fade) {
      opacity.value = withDelay(delay, withSpring(1, springConfig));
    }
  }, [delay, direction, distance, fade]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]} className={className}>
      {children}
    </Animated.View>
  );
}
