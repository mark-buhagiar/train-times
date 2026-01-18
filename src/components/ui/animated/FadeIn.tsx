/**
 * FadeIn - Fade in animation wrapper
 * Smoothly fades content into view
 */

import { ReactNode, useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

interface FadeInProps {
  children: ReactNode;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Animation duration (ms) */
  duration?: number;
  /** Initial opacity (default: 0) */
  from?: number;
  /** Final opacity (default: 1) */
  to?: number;
  /** Style to apply to the container */
  style?: ViewStyle;
  /** Additional class names */
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 300,
  from = 0,
  to = 1,
  style,
  className,
}: FadeInProps) {
  const opacity = useSharedValue(from);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(to, {
        duration,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [delay, duration, from, to]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]} className={className}>
      {children}
    </Animated.View>
  );
}
