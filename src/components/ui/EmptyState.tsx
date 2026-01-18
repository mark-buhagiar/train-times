/**
 * EmptyState - Beautiful empty states with illustrations
 * Used when there's no content to display
 */

import { theme } from "@/lib/theme";
import { LinearGradient } from "expo-linear-gradient";
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
  {
    icon: LucideIcon;
    title: string;
    description: string;
    colors: readonly [string, string];
  }
> = {
  "no-results": {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search or check the spelling",
    colors: [
      `${theme.primary.DEFAULT}20`,
      `${theme.primary.DEFAULT}05`,
    ] as const,
  },
  "no-services": {
    icon: Train,
    title: "No services",
    description: "There are no trains scheduled for this route at this time",
    colors: [
      `${theme.primary.DEFAULT}20`,
      `${theme.primary.DEFAULT}05`,
    ] as const,
  },
  "no-favourites": {
    icon: Star,
    title: "No favourites yet",
    description: "Save your frequent journeys for quick access",
    colors: [`${theme.warning}20`, `${theme.warning}05`] as const,
  },
  error: {
    icon: AlertCircle,
    title: "Something went wrong",
    description: "We couldn't load this content. Please try again.",
    colors: [`${theme.error}20`, `${theme.error}05`] as const,
  },
  offline: {
    icon: WifiOff,
    title: "You're offline",
    description: "Check your connection and try again",
    colors: [`${theme.warning}20`, `${theme.warning}05`] as const,
  },
  "no-recent": {
    icon: Clock,
    title: "No recent searches",
    description: "Your recent searches will appear here",
    colors: [
      `${theme.primary.DEFAULT}15`,
      `${theme.primary.DEFAULT}05`,
    ] as const,
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

  const iconColor =
    variant === "error"
      ? theme.error
      : variant === "offline" || variant === "no-favourites"
        ? theme.warning
        : theme.primary.DEFAULT;

  return (
    <View className="items-center py-8 px-4 w-full">
      <ScaleIn className="items-center w-full">
        {/* Illustrated icon with gradient glow */}
        <View className="relative mb-6 items-center justify-center">
          {/* Glow effect - using shadow instead of blur for better web compat */}
          <LinearGradient
            colors={config.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-24 h-24 rounded-3xl items-center justify-center"
            style={{
              borderWidth: 1,
              borderColor: `${iconColor}30`,
              shadowColor: iconColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 24,
            }}
          >
            <Icon size={40} color={iconColor} strokeWidth={1.5} />
          </LinearGradient>
        </View>

        {/* Title */}
        <Text className="text-text text-xl font-bold text-center mb-2">
          {displayTitle}
        </Text>

        {/* Description */}
        <Text className="text-text-muted text-center text-base max-w-[280px] leading-relaxed">
          {displayDescription}
        </Text>

        {/* Action button */}
        {actionText && onAction && (
          <View style={{ marginTop: 24, alignSelf: "center" }}>
            <Button
              title={actionText}
              onPress={onAction}
              variant="secondary"
              fullWidth={false}
            />
          </View>
        )}
      </ScaleIn>
    </View>
  );
}
