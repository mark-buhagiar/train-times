import { theme } from "@/lib/theme";
import { haptics } from "@/lib/utils/haptics";
import { type LucideIcon } from "lucide-react-native";
import { useEffect } from "react";
import { Platform, Pressable, PressableProps, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface ButtonProps extends Omit<PressableProps, "children"> {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  /** Icon to show before title */
  icon?: LucideIcon;
  /** Icon to show after title */
  iconRight?: LucideIcon;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Animated loading dots
function LoadingDots({ color }: { color: string }) {
  const dot1Opacity = useSharedValue(0.3);
  const dot2Opacity = useSharedValue(0.3);
  const dot3Opacity = useSharedValue(0.3);

  useEffect(() => {
    const duration = 400;
    const delay = 150;

    dot1Opacity.value = withRepeat(
      withSequence(withTiming(1, { duration }), withTiming(0.3, { duration })),
      -1,
      false
    );

    setTimeout(() => {
      dot2Opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration }),
          withTiming(0.3, { duration })
        ),
        -1,
        false
      );
    }, delay);

    setTimeout(() => {
      dot3Opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration }),
          withTiming(0.3, { duration })
        ),
        -1,
        false
      );
    }, delay * 2);
  }, []);

  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1Opacity.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2Opacity.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3Opacity.value }));

  return (
    <View className="flex-row items-center gap-1">
      <Animated.View
        style={[dot1Style, { backgroundColor: color }]}
        className="w-2 h-2 rounded-full"
      />
      <Animated.View
        style={[dot2Style, { backgroundColor: color }]}
        className="w-2 h-2 rounded-full"
      />
      <Animated.View
        style={[dot3Style, { backgroundColor: color }]}
        className="w-2 h-2 rounded-full"
      />
    </View>
  );
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = true,
  icon: IconLeft,
  iconRight: IconRight,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      haptics.impact("light");
      onPress();
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: { height: 36, paddingX: 12, fontSize: 14, iconSize: 16 },
    md: { height: 48, paddingX: 20, fontSize: 16, iconSize: 18 },
    lg: { height: 56, paddingX: 24, fontSize: 18, iconSize: 20 },
  };

  const { height, paddingX, fontSize, iconSize } = sizeConfig[size];

  // Variant configurations
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";

  const bgClass = isPrimary
    ? "bg-primary"
    : isSecondary
      ? "bg-surface border border-border"
      : "bg-transparent";

  const textColor = isPrimary
    ? theme.text.DEFAULT
    : isGhost
      ? theme.primary.DEFAULT
      : theme.text.DEFAULT;

  const hoverClass =
    Platform.OS === "web"
      ? isPrimary
        ? "hover:bg-primary-light"
        : "hover:bg-surface-hover"
      : "";

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={loading ? `${title}, loading` : title}
      style={[
        animatedStyle,
        {
          height,
          paddingHorizontal: paddingX,
        },
      ]}
      className={`
        rounded-xl justify-center items-center flex-row
        ${fullWidth ? "w-full" : ""}
        ${bgClass}
        ${disabled ? "opacity-40" : ""}
        ${loading ? "opacity-70" : ""}
        ${hoverClass}
        transition-colors
      `}
      {...props}
    >
      {loading ? (
        <LoadingDots color={textColor} />
      ) : (
        <View className="flex-row items-center gap-2">
          {IconLeft && <IconLeft size={iconSize} color={textColor} />}
          <Text
            style={{ fontSize, color: textColor }}
            className="font-semibold"
          >
            {title}
          </Text>
          {IconRight && <IconRight size={iconSize} color={textColor} />}
        </View>
      )}
    </AnimatedPressable>
  );
}
