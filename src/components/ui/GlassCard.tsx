/**
 * GlassCard - A premium glassmorphism card component
 * Creates a beautiful frosted glass effect with subtle borders
 */

import { haptics } from "@/lib/utils/haptics";
import { LinearGradient } from "expo-linear-gradient";
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

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  /** Intensity of the glass effect */
  intensity?: "light" | "medium" | "strong";
  /** Whether to show accent border glow */
  glowBorder?: boolean;
  /** Custom gradient colors */
  gradientColors?: readonly [string, string, ...string[]];
}

interface PressableGlassCardProps extends Omit<PressableProps, "style"> {
  children: React.ReactNode;
  intensity?: "light" | "medium" | "strong";
  glowBorder?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
}

const intensityConfig = {
  light: {
    colors: ["rgba(255,255,255,0.03)", "rgba(255,255,255,0.01)"] as const,
    borderOpacity: 0.08,
  },
  medium: {
    colors: ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"] as const,
    borderOpacity: 0.12,
  },
  strong: {
    colors: ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.04)"] as const,
    borderOpacity: 0.15,
  },
};

export function GlassCard({
  children,
  intensity = "medium",
  glowBorder = false,
  gradientColors,
  className,
  style,
  ...props
}: GlassCardProps) {
  const config = intensityConfig[intensity];
  const colors = gradientColors || config.colors;

  return (
    <View
      className={`rounded-3xl overflow-hidden ${className || ""}`}
      style={[
        {
          borderWidth: 1,
          borderColor: `rgba(255,255,255,${config.borderOpacity})`,
        },
        glowBorder && {
          shadowColor: "#4299e1",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 15,
        },
        style,
      ]}
      {...props}
    >
      <LinearGradient
        colors={colors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-5"
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableGlassCard({
  children,
  intensity = "medium",
  glowBorder = false,
  gradientColors,
  onPress,
  onPressIn,
  onPressOut,
  className,
  ...props
}: PressableGlassCardProps) {
  const scale = useSharedValue(1);
  const config = intensityConfig[intensity];
  const colors = gradientColors || config.colors;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    onPressIn?.(null as any);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    onPressOut?.(null as any);
  };

  const handlePress = () => {
    haptics.impact("light");
    onPress?.(null as any);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      className={`rounded-3xl overflow-hidden ${Platform.OS === "web" ? "transition-all hover:scale-[1.01]" : ""} ${className || ""}`}
      {...props}
    >
      <View
        style={[
          {
            borderWidth: 1,
            borderColor: `rgba(255,255,255,${config.borderOpacity})`,
            borderRadius: 24,
            overflow: "hidden",
          },
          glowBorder && {
            shadowColor: "#4299e1",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
          },
        ]}
      >
        <LinearGradient
          colors={colors as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-5"
        >
          {children}
        </LinearGradient>
      </View>
    </AnimatedPressable>
  );
}
