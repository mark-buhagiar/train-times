/**
 * ServiceStopCard component
 * Displays a stop in a train service journey
 */

import { theme } from "@/lib/theme";
import { ServiceStop } from "@/types/services";
import { LinearGradient } from "expo-linear-gradient";
import { CircleDot } from "lucide-react-native";
import { Text, View } from "react-native";

interface ServiceStopCardProps {
  stop: ServiceStop;
  /** Whether this is the origin station */
  isOrigin?: boolean;
  /** Whether this is the destination station */
  isDestination?: boolean;
  /** Whether this stop is highlighted (user's from/to station) */
  isHighlighted?: boolean;
  /** Whether this is the first stop in the list */
  isFirst?: boolean;
  /** Whether this is the last stop in the list */
  isLast?: boolean;
}

/**
 * Get status color based on stop status
 */
function getStatusColor(status?: string): string {
  if (!status) return theme.text.muted;
  const upper = status.toUpperCase();
  if (upper.includes("CANCEL")) return theme.error;
  if (upper.includes("LATE") || upper.includes("DELAY")) return theme.warning;
  if (upper.includes("EARLY")) return theme.success;
  return theme.success; // On time
}

/**
 * Format time display
 */
function formatTime(
  aimed?: string,
  expected?: string
): {
  display: string;
  isDelayed: boolean;
  delayText?: string;
} {
  if (!aimed) return { display: "--:--", isDelayed: false };

  if (!expected || expected === aimed) {
    return { display: aimed, isDelayed: false };
  }

  // Calculate delay
  const [aimedH, aimedM] = aimed.split(":").map(Number);
  const [expH, expM] = expected.split(":").map(Number);
  const aimedMins = aimedH * 60 + aimedM;
  const expMins = expH * 60 + expM;
  const diff = expMins - aimedMins;

  if (diff <= 0) {
    return { display: aimed, isDelayed: false };
  }

  return {
    display: aimed,
    isDelayed: true,
    delayText: `${expected} (+${diff}m)`,
  };
}

export function ServiceStopCard({
  stop,
  isOrigin = false,
  isDestination = false,
  isHighlighted = false,
  isFirst = false,
  isLast = false,
}: ServiceStopCardProps) {
  const {
    station_name,
    station_code,
    platform,
    status,
    aimed_arrival_time,
    expected_arrival_time,
    aimed_departure_time,
    expected_departure_time,
    stop_type,
  } = stop;

  const statusColor = getStatusColor(status);
  const arrival = formatTime(aimed_arrival_time, expected_arrival_time);
  const departure = formatTime(aimed_departure_time, expected_departure_time);

  // For origin, show only departure. For terminus, show only arrival.
  const showArrival = !isOrigin && aimed_arrival_time;
  const showDeparture = !isDestination && aimed_departure_time;

  return (
    <View className="flex-row">
      {/* Timeline */}
      <View className="w-10 items-center mr-3">
        {/* Line above (if not first) */}
        {!isFirst && (
          <View
            className="absolute top-0 w-0.5 h-4"
            style={{
              backgroundColor: isHighlighted
                ? theme.primary.DEFAULT
                : "rgba(255,255,255,0.15)",
            }}
          />
        )}

        {/* Stop indicator */}
        <View className="mt-4">
          {isHighlighted ? (
            <View
              className="w-5 h-5 rounded-full items-center justify-center"
              style={{ backgroundColor: theme.primary.DEFAULT }}
            >
              <CircleDot size={12} color="#fff" />
            </View>
          ) : isOrigin || isDestination ? (
            <View
              className="w-4 h-4 rounded-full border-2"
              style={{
                borderColor: statusColor,
                backgroundColor: "transparent",
              }}
            />
          ) : (
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
            />
          )}
        </View>

        {/* Line below (if not last) */}
        {!isLast && (
          <View
            className="flex-1 w-0.5 mt-1"
            style={{
              backgroundColor: isHighlighted
                ? theme.primary.DEFAULT
                : "rgba(255,255,255,0.15)",
            }}
          />
        )}
      </View>

      {/* Content */}
      <View className={`flex-1 pb-4 ${isHighlighted ? "" : ""}`}>
        {isHighlighted ? (
          <LinearGradient
            colors={["rgba(66, 153, 225, 0.15)", "rgba(66, 153, 225, 0.05)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl p-3 -ml-1"
            style={{
              borderWidth: 1,
              borderColor: "rgba(66, 153, 225, 0.3)",
            }}
          >
            <StopContent
              stationName={station_name}
              stationCode={station_code}
              platform={platform}
              status={status}
              showArrival={!!showArrival}
              showDeparture={!!showDeparture}
              arrival={arrival}
              departure={departure}
              statusColor={statusColor}
              isHighlighted
            />
          </LinearGradient>
        ) : (
          <View className="py-1">
            <StopContent
              stationName={station_name}
              stationCode={station_code}
              platform={platform}
              status={status}
              showArrival={!!showArrival}
              showDeparture={!!showDeparture}
              arrival={arrival}
              departure={departure}
              statusColor={statusColor}
            />
          </View>
        )}
      </View>
    </View>
  );
}

interface StopContentProps {
  stationName: string;
  stationCode: string;
  platform?: string;
  status?: string;
  showArrival: boolean;
  showDeparture: boolean;
  arrival: { display: string; isDelayed: boolean; delayText?: string };
  departure: { display: string; isDelayed: boolean; delayText?: string };
  statusColor: string;
  isHighlighted?: boolean;
}

function StopContent({
  stationName,
  stationCode,
  platform,
  status,
  showArrival,
  showDeparture,
  arrival,
  departure,
  statusColor,
  isHighlighted,
}: StopContentProps) {
  return (
    <>
      {/* Station name and code */}
      <View className="flex-row items-center justify-between mb-1">
        <View className="flex-row items-center flex-1 mr-2">
          <Text
            className={`text-base font-semibold ${isHighlighted ? "text-primary" : "text-text"}`}
            numberOfLines={1}
          >
            {stationName}
          </Text>
          <Text className="text-text-muted text-xs ml-2">({stationCode})</Text>
        </View>

        {platform && (
          <View className="flex-row items-center bg-white/10 rounded-lg px-2 py-1">
            <Text className="text-text-muted text-xs mr-1">Plat</Text>
            <Text className="text-text font-bold text-sm">{platform}</Text>
          </View>
        )}
      </View>

      {/* Times */}
      <View className="flex-row items-center gap-4 mt-1">
        {showArrival && (
          <View className="flex-row items-center">
            <Text className="text-text-muted text-xs mr-1">Arr</Text>
            <Text
              className={`text-sm font-medium ${arrival.isDelayed ? "text-warning" : "text-text-secondary"}`}
            >
              {arrival.isDelayed ? arrival.delayText : arrival.display}
            </Text>
          </View>
        )}
        {showDeparture && (
          <View className="flex-row items-center">
            <Text className="text-text-muted text-xs mr-1">Dep</Text>
            <Text
              className={`text-sm font-medium ${departure.isDelayed ? "text-warning" : "text-text-secondary"}`}
            >
              {departure.isDelayed ? departure.delayText : departure.display}
            </Text>
          </View>
        )}

        {/* Status indicator */}
        {status && (
          <View className="flex-row items-center ml-auto">
            <View
              className="w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: statusColor }}
            />
            <Text
              className="text-xs font-medium"
              style={{ color: statusColor }}
            >
              {status}
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

/**
 * Skeleton loading state for ServiceStopCard
 */
export function ServiceStopCardSkeleton({
  isFirst = false,
}: {
  isFirst?: boolean;
}) {
  return (
    <View className="flex-row">
      {/* Timeline skeleton */}
      <View className="w-10 items-center mr-3">
        {!isFirst && <View className="absolute top-0 w-0.5 h-4 bg-white/10" />}
        <View className="mt-4 w-3 h-3 rounded-full bg-white/10" />
        <View className="flex-1 w-0.5 mt-1 bg-white/10" />
      </View>

      {/* Content skeleton */}
      <View className="flex-1 pb-4 py-1">
        <View className="flex-row items-center justify-between mb-2">
          <View className="h-5 w-40 bg-white/5 rounded" />
          <View className="h-6 w-14 bg-white/5 rounded-lg" />
        </View>
        <View className="flex-row items-center gap-4">
          <View className="h-4 w-16 bg-white/5 rounded" />
          <View className="h-4 w-16 bg-white/5 rounded" />
        </View>
      </View>
    </View>
  );
}
