import { haptics } from "@/lib/utils/haptics";
import {
  Platform,
  Pressable,
  PressableProps,
  View,
  ViewProps,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
}

interface PressableCardProps extends Omit<PressableProps, "style"> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
  /** Whether to show press animation */
  animated?: boolean;
  /** Whether to trigger haptic feedback */
  hapticFeedback?: boolean;
}

// iOS-style shadow for elevated cards
const elevatedShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  android: {
    elevation: 8,
  },
  default: {
    // Web shadow via boxShadow handled in className
  },
});

const subtleShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  android: {
    elevation: 3,
  },
  default: {},
});

export function Card({
  children,
  className,
  variant = "default",
  style,
  ...props
}: CardProps) {
  const shadowStyle = variant === "elevated" ? elevatedShadow : subtleShadow;

  return (
    <View
      className={`
        bg-surface rounded-2xl p-4
        ${variant === "outlined" ? "border border-border" : ""}
        ${Platform.OS === "web" && variant === "elevated" ? "shadow-lg" : ""}
        ${Platform.OS === "web" && variant === "default" ? "shadow-sm" : ""}
        ${className || ""}
      `}
      style={[shadowStyle, style]}
      {...props}
    >
      {children}
    </View>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableCard({
  children,
  variant = "default",
  animated = true,
  hapticFeedback = true,
  onPress,
  onPressIn,
  onPressOut,
  className,
  ...props
}: PressableCardProps) {
  const scale = useSharedValue(1);
  const shadowStyle = variant === "elevated" ? elevatedShadow : subtleShadow;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    if (animated) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    if (animated) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
    onPressOut?.(e);
  };

  const handlePress = (e: any) => {
    if (hapticFeedback) {
      haptics.impact("light");
    }
    onPress?.(e);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={`
        bg-surface rounded-2xl p-4
        ${variant === "outlined" ? "border border-border" : ""}
        ${Platform.OS === "web" && variant === "elevated" ? "shadow-lg" : ""}
        ${Platform.OS === "web" && variant === "default" ? "shadow-sm" : ""}
        ${Platform.OS === "web" ? "hover:bg-surface-hover transition-colors" : ""}
        ${className || ""}
      `}
      style={[shadowStyle, animatedStyle]}
      accessibilityRole="button"
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
