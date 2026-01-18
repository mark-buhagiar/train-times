/**
 * TimeBadge component
 * Unified time display badge used across ServiceCard and FavouriteCard
 */

import { theme } from "@/lib/theme";
import { Clock } from "lucide-react-native";
import { Text, View } from "react-native";

interface TimeBadgeProps {
  /** The time to display (e.g., "14:30") */
  time: string;
  /** Status color for the badge background */
  statusColor?: string;
  /** Whether the service is cancelled */
  isCancelled?: boolean;
  /** Expected time if delayed */
  expectedTime?: string;
  /** Whether to show the clock icon */
  showIcon?: boolean;
  /** Size variant */
  size?: "sm" | "md";
}

export function TimeBadge({
  time,
  statusColor = theme.primary.DEFAULT,
  isCancelled = false,
  expectedTime,
  showIcon = false,
  size = "md",
}: TimeBadgeProps) {
  const isDelayed = expectedTime && expectedTime !== time;
  const containerSize = size === "sm" ? "w-14 h-14" : "w-16 h-16";
  const textSize = size === "sm" ? "text-base" : "text-lg";
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <View className="items-center">
      <View
        className={`${containerSize} rounded-2xl items-center justify-center`}
        style={{ backgroundColor: `${statusColor}15` }}
      >
        {showIcon && (
          <Clock
            size={iconSize}
            color={isCancelled ? theme.error : statusColor}
          />
        )}
        <Text
          className={`${textSize} font-bold ${isCancelled ? "line-through opacity-50" : ""} ${showIcon ? "mt-1" : ""}`}
          style={{
            color: isCancelled ? theme.error : theme.text.DEFAULT,
          }}
        >
          {time}
        </Text>
      </View>
      {isDelayed && !isCancelled && (
        <View className="flex-row items-center mt-1">
          <Clock size={12} color={theme.warning} />
          <Text className="text-warning text-xs font-semibold ml-1">
            {expectedTime}
          </Text>
        </View>
      )}
    </View>
  );
}
