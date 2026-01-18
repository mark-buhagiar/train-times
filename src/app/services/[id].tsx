import {
  ServiceStopCard,
  ServiceStopCardSkeleton,
} from "@/components/features";
import {
  AnimatedPressable,
  BackgroundOrbs,
  EmptyState,
  FadeIn,
  GlassCard,
  GradientBackground,
  SlideIn,
} from "@/components/ui";
import { useServiceTimetable } from "@/hooks";
import { theme } from "@/lib/theme";
import { haptics } from "@/lib/utils";
import { useFavouritesStore } from "@/stores";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowRight, Clock, Heart, MapPin, Train } from "lucide-react-native";
import { useCallback, useMemo } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { id, from, to } = useLocalSearchParams<{
    id: string;
    from?: string;
    to?: string;
  }>();

  const {
    data: service,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useServiceTimetable({
    serviceId: id || "",
    enabled: !!id,
  });

  const { addService, removeService, isServiceFavourited } =
    useFavouritesStore();

  // Check if this service is favourited
  const templateUrl = id ? `service:${id}` : "";
  const isFavourited = isServiceFavourited(templateUrl);

  // Find from/to stations in stops
  const highlightedStops = useMemo(() => {
    if (!service?.stops) return { fromIndex: -1, toIndex: -1 };

    const fromIndex = service.stops.findIndex(
      (s) => s.station_code.toUpperCase() === from?.toUpperCase()
    );
    const toIndex = service.stops.findIndex(
      (s) => s.station_code.toUpperCase() === to?.toUpperCase()
    );

    return { fromIndex, toIndex };
  }, [service?.stops, from, to]);

  // Handle favourite toggle
  const handleToggleFavourite = useCallback(() => {
    haptics.impact("medium");

    if (isFavourited) {
      // Find the favourite by template URL and remove it
      const favourite = useFavouritesStore
        .getState()
        .services.find((s) => s.templateUrl === templateUrl);
      if (favourite) {
        removeService(favourite.id);
      }
    } else if (service) {
      // Get first stop's departure time as scheduled departure
      const firstStop = service.stops[0];
      const scheduledDeparture = firstStop?.aimed_departure_time || "00:00";

      addService({
        templateUrl,
        fromStation: {
          crs: from || service.stops[0]?.station_code || "",
          name:
            service.stops.find(
              (s) => s.station_code.toUpperCase() === from?.toUpperCase()
            )?.station_name ||
            service.origin_name ||
            "",
        },
        toStation: {
          crs:
            to || service.stops[service.stops.length - 1]?.station_code || "",
          name:
            service.stops.find(
              (s) => s.station_code.toUpperCase() === to?.toUpperCase()
            )?.station_name ||
            service.destination_name ||
            "",
        },
        scheduledDeparture,
      });
    }
  }, [isFavourited, templateUrl, service, from, to, addService, removeService]);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    await haptics.impact("light");
    await refetch();
  }, [refetch]);

  // Loading state
  if (isLoading) {
    return (
      <GradientBackground>
        <Stack.Screen options={{ title: "Service Details" }} />
        <ScrollView className="flex-1" contentContainerClassName="px-5 pt-4">
          {/* Header skeleton */}
          <GlassCard intensity="medium" className="mb-4">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-12 h-12 rounded-2xl bg-white/10" />
              <View className="flex-1">
                <View className="h-5 w-32 bg-white/10 rounded mb-2" />
                <View className="h-4 w-48 bg-white/10 rounded" />
              </View>
            </View>
            <View className="h-px bg-white/10 my-3" />
            <View className="flex-row items-center gap-4">
              <View className="h-4 w-24 bg-white/10 rounded" />
              <View className="h-4 w-20 bg-white/10 rounded" />
            </View>
          </GlassCard>

          {/* Stops skeleton */}
          <GlassCard intensity="light">
            <Text className="text-text-muted text-xs font-semibold mb-4 tracking-wide uppercase">
              Calling Points
            </Text>
            {Array.from({ length: 5 }).map((_, i) => (
              <ServiceStopCardSkeleton key={i} isFirst={i === 0} />
            ))}
          </GlassCard>
        </ScrollView>
      </GradientBackground>
    );
  }

  // Error state
  if (error) {
    return (
      <GradientBackground>
        <Stack.Screen options={{ title: "Service Details" }} />
        <View className="flex-1 px-5 pt-4">
          <GlassCard intensity="medium">
            <EmptyState
              variant="error"
              description={error.message || "Failed to load service details"}
              actionText="Try again"
              onAction={handleRefresh}
            />
          </GlassCard>
        </View>
      </GradientBackground>
    );
  }

  // No data state
  if (!service) {
    return (
      <GradientBackground>
        <Stack.Screen options={{ title: "Service Details" }} />
        <View className="flex-1 px-5 pt-4">
          <GlassCard intensity="medium">
            <EmptyState
              variant="no-results"
              description="Service information not available"
            />
          </GlassCard>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <BackgroundOrbs />
      <Stack.Screen
        options={{
          title: `${service.origin_name.split(" ")[0]} → ${service.destination_name.split(" ")[0]}`,
        }}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={theme.primary.DEFAULT}
          />
        }
      >
        <View className="px-5 pt-4 pb-8">
          {/* Service Header */}
          <SlideIn direction="top" delay={0}>
            <GlassCard intensity="strong" glowBorder className="mb-4">
              {/* Train info */}
              <View className="flex-row items-center gap-3 mb-3">
                <View className="w-12 h-12 rounded-2xl bg-primary/20 items-center justify-center">
                  <Train size={24} color={theme.primary.DEFAULT} />
                </View>
                <View className="flex-1">
                  <Text className="text-text text-lg font-bold">
                    {service.operator_name || "Train Service"}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <Text className="text-text-muted text-sm">
                      {service.headcode || service.train_uid}
                    </Text>
                    {service.category && (
                      <View className="bg-white/10 rounded px-2 py-0.5">
                        <Text className="text-text-muted text-xs">
                          {service.category}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Favourite button */}
                <AnimatedPressable
                  onPress={handleToggleFavourite}
                  className={`w-11 h-11 rounded-full items-center justify-center ${
                    isFavourited ? "bg-error/20" : "bg-white/10"
                  }`}
                  pressedScale={0.9}
                >
                  <Heart
                    size={22}
                    color={isFavourited ? theme.error : theme.text.muted}
                    fill={isFavourited ? theme.error : "transparent"}
                  />
                </AnimatedPressable>
              </View>

              {/* Route summary */}
              <View className="h-px bg-white/10 my-3" />
              <View className="flex-row items-center">
                <MapPin size={16} color={theme.primary.DEFAULT} />
                <Text
                  className="text-text text-sm font-medium ml-2 flex-1"
                  numberOfLines={1}
                >
                  {service.origin_name}
                </Text>
                <ArrowRight
                  size={16}
                  color={theme.text.muted}
                  className="mx-2"
                />
                <MapPin size={16} color={theme.success} />
                <Text
                  className="text-text text-sm font-medium ml-2 flex-1"
                  numberOfLines={1}
                >
                  {service.destination_name}
                </Text>
              </View>

              {/* Stats row */}
              <View className="flex-row items-center gap-4 mt-3">
                <View className="flex-row items-center">
                  <Clock size={14} color={theme.text.muted} />
                  <Text className="text-text-muted text-sm ml-1">
                    {service.stops.length} stops
                  </Text>
                </View>
              </View>
            </GlassCard>
          </SlideIn>

          {/* Stops List */}
          <FadeIn delay={100}>
            <GlassCard intensity="light">
              <Text className="text-text-muted text-xs font-semibold mb-4 tracking-wide uppercase">
                Calling Points
              </Text>

              {service.stops.map((stop, index) => (
                <ServiceStopCard
                  key={`${stop.station_code}-${index}`}
                  stop={stop}
                  isOrigin={index === 0}
                  isDestination={index === service.stops.length - 1}
                  isHighlighted={
                    index === highlightedStops.fromIndex ||
                    index === highlightedStops.toIndex
                  }
                  isFirst={index === 0}
                  isLast={index === service.stops.length - 1}
                />
              ))}
            </GlassCard>
          </FadeIn>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}
