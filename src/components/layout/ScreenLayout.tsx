import { BackgroundOrbs, GradientBackground, SlideIn } from "@/components/ui";
import { theme } from "@/lib/theme";
import { useFocusEffect } from "expo-router";
import { LucideIcon } from "lucide-react-native";
import { ReactNode, useCallback, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenLayoutProps {
  /** Screen title displayed in the header */
  title: string;
  /** Small subtitle above the title */
  subtitle?: string;
  /** Icon component to display in header */
  icon?: LucideIcon;
  /** Icon background color class (e.g., "bg-primary/20") */
  iconBgClass?: string;
  /** Icon color */
  iconColor?: string;
  /** Whether icon should be filled */
  iconFilled?: boolean;
  /** Optional right action component (e.g., button) */
  rightAction?: ReactNode;
  /** Screen content */
  children: ReactNode;
  /** Whether to add horizontal padding (default: true) */
  padded?: boolean;
}

/**
 * Shared screen layout component with consistent header style.
 * Matches the premium design of Home and My Services screens.
 * Handles safe area insets and provides consistent spacing.
 */
export function ScreenLayout({
  title,
  subtitle,
  icon: Icon,
  iconBgClass = "bg-primary/20",
  iconColor = theme.primary.DEFAULT,
  iconFilled = false,
  rightAction,
  children,
  padded = true,
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  // Key to force re-render of animations on focus
  const [animationKey, setAnimationKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      // Increment key to remount animated components
      setAnimationKey((prev) => prev + 1);
    }, [])
  );

  return (
    <GradientBackground>
      <BackgroundOrbs />
      {/* Header */}
      <View
        className={`${padded ? "px-5" : ""}`}
        style={{ paddingTop: insets.top + 16 }}
      >
        <SlideIn key={`header-${animationKey}`} direction="top" delay={0}>
          <View className="mb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                {Icon && (
                  <View
                    className={`w-12 h-12 rounded-2xl ${iconBgClass} items-center justify-center`}
                  >
                    <Icon
                      size={24}
                      color={iconColor}
                      fill={iconFilled ? iconColor : "transparent"}
                    />
                  </View>
                )}
                <View>
                  {subtitle && (
                    <Text className="text-text-muted text-sm font-medium tracking-wide uppercase">
                      {subtitle}
                    </Text>
                  )}
                  <Text className="text-text text-3xl font-bold">{title}</Text>
                </View>
              </View>
              {rightAction}
            </View>
          </View>
        </SlideIn>
      </View>

      {/* Content - keyed to replay child animations on focus */}
      <View
        key={`content-${animationKey}`}
        className={`flex-1 ${padded ? "px-5" : ""}`}
      >
        {children}
      </View>
    </GradientBackground>
  );
}
