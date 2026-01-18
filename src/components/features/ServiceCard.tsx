/**
 * ServiceCard component
 * Displays a train service summary with departure time, destination, platform, and status
 */

import { theme } from "@/lib/theme";
import { haptics } from "@/lib/utils/haptics";
import { ServiceSummary } from "@/types/services";
import { ChevronRight } from "lucide-react-native";
import { Platform, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StatusBadge } from "../ui/StatusBadge";

interface ServiceCardProps {
  service: ServiceSummary;
  onPress?: () => void;
}

/**
 * Format delay text (e.g., "+5 mins")
 */
function getDelayText(aimed: string, expected?: string): string | null {
  if (!expected || expected === aimed) return null;

  const [aimedH, aimedM] = aimed.split(":").map(Number);
  const [expH, expM] = expected.split(":").map(Number);

  const aimedMins = aimedH * 60 + aimedM;
  const expMins = expH * 60 + expM;

  const diff = expMins - aimedMins;
  if (diff <= 0) return null;

  return `+${diff} min${diff > 1 ? "s" : ""}`;
}

/**
 * Map API status to StatusBadge status
 */
function mapStatus(
  status: string
): "on-time" | "delayed" | "cancelled" | "early" {
  const upper = status.toUpperCase();
  if (upper.includes("CANCEL")) return "cancelled";
  if (upper.includes("LATE") || upper.includes("DELAY")) return "delayed";
  if (upper.includes("EARLY")) return "early";
  return "on-time";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// iOS-style shadow
const cardShadow = Platform.select({
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

export function ServiceCard({ service, onPress }: ServiceCardProps) {
  const {
    aimed_departure_time,
    expected_departure_time,
    destination_name,
    platform,
    status,
    operator_name,
  } = service;

  const scale = useSharedValue(1);

  const delayText = getDelayText(aimed_departure_time, expected_departure_time);
  const displayTime = expected_departure_time || aimed_departure_time;
  const badgeStatus = mapStatus(status);
  const isDelayed = badgeStatus === "delayed";
  const isCancelled = badgeStatus === "cancelled";

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    haptics.impact("light");
    onPress?.();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[cardShadow, animatedStyle]}
      className={`bg-surface rounded-2xl p-4 ${Platform.OS === "web" ? "hover:bg-surface-hover transition-colors shadow-sm" : ""}`}
      accessibilityRole="button"
      accessibilityLabel={`Train to ${destination_name} at ${displayTime}`}
    >
      <View className="flex-row items-start justify-between">
        {/* Left side: Time and destination */}
        <View className="flex-1 mr-3">
          {/* Time */}
          <View className="flex-row items-baseline gap-2">
            <Text
              className={`text-2xl font-bold ${
                isCancelled ? "text-error line-through" : "text-text"
              }`}
            >
              {aimed_departure_time}
            </Text>
            {isDelayed && expected_departure_time && (
              <Text className="text-warning text-lg font-semibold">
                → {expected_departure_time}
              </Text>
            )}
            {delayText && (
              <Text className="text-warning text-sm">({delayText})</Text>
            )}
          </View>

          {/* Destination */}
          <Text className="text-text text-base mt-1" numberOfLines={1}>
            {destination_name}
          </Text>

          {/* Operator */}
          {operator_name && (
            <Text className="text-text-muted text-sm mt-0.5">
              {operator_name}
            </Text>
          )}
        </View>

        {/* Right side: Platform and status */}
        <View className="items-end gap-2">
          <StatusBadge status={badgeStatus} size="sm" />

          {platform && (
            <View className="flex-row items-center">
              <Text className="text-text-muted text-sm mr-1">Platform</Text>
              <Text className="text-text font-semibold text-lg">
                {platform}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Chevron indicator */}
      {onPress && (
        <View className="absolute right-2 top-0 bottom-0 justify-center">
          <ChevronRight size={20} color={theme.text.muted} />
        </View>
      )}
    </AnimatedPressable>
  );
}

/**
 * Skeleton loading state for ServiceCard
 */
export function ServiceCardSkeleton() {
  return (
    <View className="bg-surface rounded-2xl p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="h-8 w-20 bg-surface-hover rounded mb-2" />
          <View className="h-5 w-40 bg-surface-hover rounded mb-1" />
          <View className="h-4 w-24 bg-surface-hover rounded" />
        </View>
        <View className="items-end gap-2">
          <View className="h-6 w-16 bg-surface-hover rounded-badge" />
          <View className="h-5 w-12 bg-surface-hover rounded" />
        </View>
      </View>
    </View>
  );
}
