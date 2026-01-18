/**
 * ServiceCard component
 * Displays a train service summary with departure time, destination, platform, and status
 */

import { theme } from "@/lib/theme";
import { haptics } from "@/lib/utils/haptics";
import { ServiceSummary } from "@/types/services";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight, MapPin } from "lucide-react-native";
import { Platform, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StatusBadge } from "../ui/StatusBadge";
import { TimeBadge } from "../ui/TimeBadge";

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
  const badgeStatus = mapStatus(status);
  const isDelayed = badgeStatus === "delayed";
  const isCancelled = badgeStatus === "cancelled";
  const isOnTime = badgeStatus === "on-time";

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

  // Get status color for accents
  const statusColor = isCancelled
    ? theme.error
    : isDelayed
      ? theme.warning
      : theme.success;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      className={`rounded-3xl overflow-hidden ${Platform.OS === "web" ? "transition-all hover:scale-[1.01]" : ""}`}
      accessibilityRole="button"
      accessibilityLabel={`Train to ${destination_name} at ${aimed_departure_time}`}
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: 16,
        }}
      >
        <View className="flex-row items-center">
          {/* Time Column */}
          <View className="mr-4">
            <TimeBadge
              time={aimed_departure_time}
              statusColor={statusColor}
              isCancelled={isCancelled}
              expectedTime={isDelayed ? expected_departure_time : undefined}
              showIcon
            />
          </View>

          {/* Details Column */}
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <StatusBadge status={badgeStatus} size="sm" />
              {platform && (
                <View className="flex-row items-center bg-white/5 rounded-lg px-2 py-1">
                  <Text className="text-text-muted text-xs mr-1">Plat</Text>
                  <Text className="text-text font-bold text-sm">
                    {platform}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center mt-1">
              <MapPin size={14} color={theme.primary.DEFAULT} />
              <Text
                className="text-text text-base font-semibold ml-2"
                numberOfLines={1}
              >
                {destination_name}
              </Text>
            </View>

            {operator_name && (
              <Text className="text-text-muted text-sm mt-1" numberOfLines={1}>
                {operator_name}
              </Text>
            )}
          </View>

          {/* Chevron */}
          {onPress && (
            <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center ml-2">
              <ChevronRight size={18} color={theme.text.muted} />
            </View>
          )}
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

/**
 * Skeleton loading state for ServiceCard
 */
export function ServiceCardSkeleton() {
  return (
    <View
      className="rounded-3xl overflow-hidden"
      style={{
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        backgroundColor: "rgba(255,255,255,0.03)",
      }}
    >
      <View className="p-4 flex-row items-center">
        {/* Time skeleton */}
        <View className="w-16 h-16 rounded-2xl bg-white/5 mr-4" />

        {/* Details skeleton */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="h-5 w-16 bg-white/5 rounded-full" />
            <View className="h-5 w-12 bg-white/5 rounded-lg" />
          </View>
          <View className="h-5 w-40 bg-white/5 rounded mb-1" />
          <View className="h-4 w-28 bg-white/5 rounded" />
        </View>

        {/* Chevron skeleton */}
        <View className="w-8 h-8 rounded-full bg-white/5" />
      </View>
    </View>
  );
}
