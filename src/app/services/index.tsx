import { ServiceCard, ServiceCardSkeleton } from "@/components/features";
import { EmptyState, FadeIn, SlideIn } from "@/components/ui";
import { useStationTimetable } from "@/hooks";
import { theme } from "@/lib/theme";
import { haptics } from "@/lib/utils";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

export default function ServicesScreen() {
  const router = useRouter();
  const { from, to, when } = useLocalSearchParams<{
    from: string;
    to: string;
    when?: string;
  }>();

  // Fetch station timetable
  const {
    data: timetable,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useStationTimetable({
    from: from || "",
    to,
    when: when || null,
  });

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    await haptics.impact("light");
    await refetch();
  }, [refetch]);

  // Navigate to service details
  const handleServicePress = useCallback(
    (serviceId: string) => {
      haptics.impact("light");
      router.push({
        pathname: "/services/[id]",
        params: { id: serviceId, from, to },
      });
    },
    [router, from, to]
  );

  // Format time display
  const formatTimeDisplay = () => {
    if (!when) return "Departing now";
    const date = new Date(when);
    const isToday = new Date().toDateString() === date.toDateString();
    if (isToday) {
      return `Departing at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
    return `${date.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })} at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  // Loading state
  if (isLoading && !timetable) {
    return (
      <View className="flex-1 bg-background px-4">
        <Stack.Screen options={{ title: "Services" }} />
        <View className="gap-4 pt-4">
          {/* Search summary */}
          <View className="bg-surface rounded-card p-4">
            <Text className="text-text text-lg font-semibold">
              {from} → {to}
            </Text>
            <Text className="text-text-muted text-sm mt-1">
              {formatTimeDisplay()}
            </Text>
          </View>

          {/* Loading skeletons */}
          <View className="gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </View>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View className="flex-1 bg-background px-4">
        <Stack.Screen options={{ title: "Services" }} />
        <View className="gap-4 pt-4">
          {/* Search summary */}
          <SlideIn direction="top" delay={0}>
            <View className="bg-surface rounded-2xl p-4">
              <Text className="text-text text-lg font-semibold">
                {from} → {to}
              </Text>
              <Text className="text-text-muted text-sm mt-1">
                {formatTimeDisplay()}
              </Text>
            </View>
          </SlideIn>

          {/* Error message */}
          <FadeIn delay={100}>
            <View className="bg-surface rounded-2xl p-6">
              <EmptyState
                variant="error"
                description={
                  error.message || "Please check your connection and try again"
                }
                actionText="Try again"
                onAction={handleRefresh}
              />
            </View>
          </FadeIn>
        </View>
      </View>
    );
  }

  // Empty state
  const services = timetable?.departures?.all || [];
  if (services.length === 0) {
    return (
      <View className="flex-1 bg-background px-4">
        <Stack.Screen options={{ title: "Services" }} />
        <View className="gap-4 pt-4">
          {/* Search summary */}
          <SlideIn direction="top" delay={0}>
            <View className="bg-surface rounded-2xl p-4">
              <Text className="text-text text-lg font-semibold">
                {timetable?.station_name || from} → {to}
              </Text>
              <Text className="text-text-muted text-sm mt-1">
                {formatTimeDisplay()}
              </Text>
            </View>
          </SlideIn>

          {/* Empty message */}
          <FadeIn delay={100}>
            <View className="bg-surface rounded-2xl p-4">
              <EmptyState variant="no-services" />
            </View>
          </FadeIn>
        </View>
      </View>
    );
  }

  // Success state with services list
  return (
    <View className="flex-1 bg-background px-4">
      <Stack.Screen options={{ title: "Services" }} />
      <FlatList
        data={services}
        keyExtractor={(item) => item.service}
        renderItem={({ item, index }) => (
          <SlideIn direction="bottom" delay={index * 50}>
            <ServiceCard
              service={item}
              onPress={() => handleServicePress(item.service)}
            />
          </SlideIn>
        )}
        contentContainerClassName="gap-3 pb-6 pt-4"
        ListHeaderComponent={
          <SlideIn direction="top" delay={0}>
            <View className="bg-surface rounded-2xl p-4 mb-2">
              <Text className="text-text text-lg font-semibold">
                {timetable?.station_name || from} → {to}
              </Text>
              <Text className="text-text-muted text-sm mt-1">
                {formatTimeDisplay()} • {services.length} service
                {services.length !== 1 ? "s" : ""}
              </Text>
            </View>
          </SlideIn>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={theme.primary.DEFAULT}
            colors={[theme.primary.DEFAULT]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
