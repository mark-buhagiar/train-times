import { ReactNode } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenLayoutProps {
  /** Screen title displayed in the header */
  title: string;
  /** Optional right action component (e.g., button) */
  rightAction?: ReactNode;
  /** Screen content */
  children: ReactNode;
  /** Whether to add horizontal padding (default: true) */
  padded?: boolean;
}

/**
 * Shared screen layout component with consistent title bar.
 * Handles safe area insets and provides consistent spacing.
 */
export function ScreenLayout({
  title,
  rightAction,
  children,
  padded = true,
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Text className="text-white text-2xl font-bold">{title}</Text>
        {rightAction}
      </View>

      {/* Content */}
      <View className={`flex-1 ${padded ? "px-4" : ""}`}>{children}</View>
    </View>
  );
}
