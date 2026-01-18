/**
 * AnimatedPressable - A pressable with scale animation feedback
 * Provides satisfying micro-interaction on press
 */

import { haptics } from "@/lib/utils/haptics";
import { ReactNode } from "react";
import { Pressable, PressableProps, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressableView = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends Omit<PressableProps, "style"> {
  children: ReactNode;
  /** Scale when pressed (default: 0.97) */
  pressedScale?: number;
  /** Whether to trigger haptic feedback on press */
  hapticFeedback?: boolean;
  /** Style to apply to the pressable */
  style?: ViewStyle;
  /** Additional class names */
  className?: string;
}

export function AnimatedPressable({
  children,
  onPress,
  onPressIn,
  onPressOut,
  pressedScale = 0.97,
  hapticFeedback = true,
  style,
  className,
  disabled,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    scale.value = withSpring(pressedScale, {
      damping: 15,
      stiffness: 400,
    });
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
    });
    onPressOut?.(e);
  };

  const handlePress = (e: any) => {
    if (hapticFeedback && !disabled) {
      haptics.impact("light");
    }
    onPress?.(e);
  };

  return (
    <AnimatedPressableView
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[animatedStyle, style]}
      className={className}
      {...props}
    >
      {children}
    </AnimatedPressableView>
  );
}
