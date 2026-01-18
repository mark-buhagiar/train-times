import { ServiceCard, ServiceCardSkeleton } from "@/components/features";
import {
  BackgroundOrbs,
  EmptyState,
  FadeIn,
  GlassCard,
  GradientBackground,
  SlideIn,
} from "@/components/ui";
import { useStationTimetable } from "@/hooks";
import { theme } from "@/lib/theme";
import { haptics } from "@/lib/utils";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowRight, Train } from "lucide-react-native";
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

  // Journey summary header component
  const JourneySummary = ({
    stationName,
    serviceCount,
  }: {
    stationName?: string;
    serviceCount?: number;
  }) => (
    <SlideIn direction="top" delay={0}>
      <GlassCard intensity="medium" className="mb-4">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-2xl bg-primary/20 items-center justify-center mr-4">
            <Train size={24} color={theme.primary.DEFAULT} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-text text-lg font-bold">
                {stationName || from}
              </Text>
              <View className="w-6 h-6 rounded-full bg-primary/20 items-center justify-center">
                <ArrowRight size={14} color={theme.primary.DEFAULT} />
              </View>
              <Text className="text-text text-lg font-bold">{to}</Text>
            </View>
            <Text className="text-text-muted text-sm mt-1">
              {formatTimeDisplay()}
              {serviceCount !== undefined &&
                ` • ${serviceCount} service${serviceCount !== 1 ? "s" : ""}`}
            </Text>
          </View>
        </View>
      </GlassCard>
    </SlideIn>
  );

  // Loading state
  if (isLoading && !timetable) {
    return (
      <GradientBackground>
        <BackgroundOrbs />
        <Stack.Screen options={{ title: "Services" }} />
        <View className="flex-1 px-5 pt-4">
          <JourneySummary />
          <View className="gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <FadeIn key={i} delay={i * 100}>
                <ServiceCardSkeleton />
              </FadeIn>
            ))}
          </View>
        </View>
      </GradientBackground>
    );
  }

  // Error state
  if (error) {
    return (
      <GradientBackground>
        <BackgroundOrbs />
        <Stack.Screen options={{ title: "Services" }} />
        <View className="flex-1 px-5 pt-4">
          <JourneySummary />
          <FadeIn delay={100}>
            <GlassCard intensity="medium">
              <EmptyState
                variant="error"
                description={
                  error.message || "Please check your connection and try again"
                }
                actionText="Try again"
                onAction={handleRefresh}
              />
            </GlassCard>
          </FadeIn>
        </View>
      </GradientBackground>
    );
  }

  // Empty state
  const services = timetable?.departures?.all || [];
  if (services.length === 0) {
    return (
      <GradientBackground>
        <BackgroundOrbs />
        <Stack.Screen options={{ title: "Services" }} />
        <View className="flex-1 px-5 pt-4">
          <JourneySummary stationName={timetable?.station_name} />
          <FadeIn delay={100}>
            <GlassCard intensity="medium">
              <EmptyState variant="no-services" />
            </GlassCard>
          </FadeIn>
        </View>
      </GradientBackground>
    );
  }

  // Success state with services list
  return (
    <GradientBackground>
      <BackgroundOrbs />
      <Stack.Screen options={{ title: "Services" }} />
      <FlatList
        data={services}
        keyExtractor={(item) => item.service}
        renderItem={({ item, index }) => (
          <SlideIn direction="bottom" delay={Math.min(index * 50, 300)}>
            <ServiceCard
              service={item}
              onPress={() => handleServicePress(item.service)}
            />
          </SlideIn>
        )}
        contentContainerClassName="gap-3 pb-6 pt-4 px-5"
        ListHeaderComponent={
          <JourneySummary
            stationName={timetable?.station_name}
            serviceCount={services.length}
          />
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
    </GradientBackground>
  );
}
