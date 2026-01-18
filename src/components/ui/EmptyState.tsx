/**
 * EmptyState - Beautiful empty states with illustrations
 * Used when there's no content to display
 */

import { theme } from "@/lib/theme";
import {
  AlertCircle,
  Clock,
  Search,
  Star,
  Train,
  WifiOff,
  type LucideIcon,
} from "lucide-react-native";
import { Text, View } from "react-native";
import { ScaleIn } from "./animated";
import { Button } from "./Button";

type EmptyStateVariant =
  | "no-results"
  | "no-services"
  | "no-favourites"
  | "error"
  | "offline"
  | "no-recent";

interface EmptyStateProps {
  /** Preset variant for common empty states */
  variant?: EmptyStateVariant;
  /** Custom icon (overrides variant icon) */
  icon?: LucideIcon;
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Action button text */
  actionText?: string;
  /** Action button handler */
  onAction?: () => void;
}

const variants: Record<
  EmptyStateVariant,
  { icon: LucideIcon; title: string; description: string }
> = {
  "no-results": {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search or check the spelling",
  },
  "no-services": {
    icon: Train,
    title: "No services",
    description: "There are no trains scheduled for this route at this time",
  },
  "no-favourites": {
    icon: Star,
    title: "No favourites yet",
    description: "Save your frequent journeys for quick access",
  },
  error: {
    icon: AlertCircle,
    title: "Something went wrong",
    description: "We couldn't load this content. Please try again.",
  },
  offline: {
    icon: WifiOff,
    title: "You're offline",
    description: "Check your connection and try again",
  },
  "no-recent": {
    icon: Clock,
    title: "No recent searches",
    description: "Your recent searches will appear here",
  },
};

export function EmptyState({
  variant = "no-results",
  icon: CustomIcon,
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  const config = variants[variant];
  const Icon = CustomIcon || config.icon;
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;

  // Determine icon background color based on variant
  const iconBgColor =
    variant === "error"
      ? "rgba(239, 68, 68, 0.15)"
      : variant === "offline"
        ? "rgba(245, 158, 11, 0.15)"
        : "rgba(59, 130, 246, 0.1)";

  const iconColor =
    variant === "error"
      ? theme.error
      : variant === "offline"
        ? theme.warning
        : theme.text.muted;

  return (
    <ScaleIn className="items-center py-8 px-4">
      {/* Illustrated icon with decorative rings */}
      <View className="relative mb-6">
        {/* Outer ring */}
        <View
          className="absolute -inset-4 rounded-full opacity-30"
          style={{ backgroundColor: iconBgColor }}
        />
        {/* Middle ring */}
        <View
          className="absolute -inset-2 rounded-full opacity-50"
          style={{ backgroundColor: iconBgColor }}
        />
        {/* Icon container */}
        <View
          className="w-20 h-20 rounded-full items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon size={36} color={iconColor} strokeWidth={1.5} />
        </View>
      </View>

      {/* Title */}
      <Text className="text-text text-xl font-semibold text-center mb-2">
        {displayTitle}
      </Text>

      {/* Description */}
      <Text className="text-text-muted text-center text-base max-w-[280px] leading-relaxed">
        {displayDescription}
      </Text>

      {/* Action button */}
      {actionText && onAction && (
        <View className="mt-6 w-full max-w-[200px]">
          <Button title={actionText} onPress={onAction} variant="secondary" />
        </View>
      )}
    </ScaleIn>
  );
}
