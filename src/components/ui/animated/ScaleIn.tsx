/**
 * ScaleIn - Scale in animation wrapper
 * Scales content from small to full size
 */

import { ReactNode, useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

interface ScaleInProps {
  children: ReactNode;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Initial scale (default: 0.8) */
  from?: number;
  /** Final scale (default: 1) */
  to?: number;
  /** Whether to also fade in */
  fade?: boolean;
  /** Style to apply to the container */
  style?: ViewStyle;
  /** Additional class names */
  className?: string;
}

const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 0.8,
};

export function ScaleIn({
  children,
  delay = 0,
  from = 0.8,
  to = 1,
  fade = true,
  style,
  className,
}: ScaleInProps) {
  const scale = useSharedValue(from);
  const opacity = useSharedValue(fade ? 0 : 1);

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(to, springConfig));
    if (fade) {
      opacity.value = withDelay(delay, withSpring(1, springConfig));
    }
  }, [delay, from, to, fade]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]} className={className}>
      {children}
    </Animated.View>
  );
}
