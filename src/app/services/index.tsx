import { ServiceCard, ServiceCardSkeleton } from "@/components/features";
import { ScreenLayout } from "@/components/layout";
import { useStationTimetable } from "@/hooks";
import { theme } from "@/lib/theme";
import { haptics } from "@/lib/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertCircle, RefreshCw, TrainFront } from "lucide-react-native";
import { useCallback } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";

export default function ServicesScreen() {
  const router = useRouter();
  const { from, to, when } = useLocalSearchParams<{
    from: string;
    to: string;
    when?: string;
  }>();

  // Parse the when param - undefined means "now"
  const whenDate = when ? new Date(when) : undefined;

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
      <ScreenLayout title="Services">
        <View className="gap-4">
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
      </ScreenLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <ScreenLayout title="Services">
        <View className="gap-4">
          {/* Search summary */}
          <View className="bg-surface rounded-card p-4">
            <Text className="text-text text-lg font-semibold">
              {from} → {to}
            </Text>
            <Text className="text-text-muted text-sm mt-1">
              {formatTimeDisplay()}
            </Text>
          </View>

          {/* Error message */}
          <View className="bg-surface rounded-card p-6 items-center">
            <AlertCircle size={48} color={theme.error} />
            <Text className="text-text text-lg font-semibold mt-4">
              Unable to load services
            </Text>
            <Text className="text-text-muted text-center mt-2">
              {error.message || "Please check your connection and try again"}
            </Text>
            <Pressable
              onPress={handleRefresh}
              className="mt-4 bg-primary px-6 py-3 rounded-button flex-row items-center"
            >
              <RefreshCw
                size={18}
                color={theme.text.DEFAULT}
                className="mr-2"
              />
              <Text className="text-text font-semibold ml-2">Try again</Text>
            </Pressable>
          </View>
        </View>
      </ScreenLayout>
    );
  }

  // Empty state
  const services = timetable?.departures?.all || [];
  if (services.length === 0) {
    return (
      <ScreenLayout title="Services">
        <View className="gap-4">
          {/* Search summary */}
          <View className="bg-surface rounded-card p-4">
            <Text className="text-text text-lg font-semibold">
              {timetable?.station_name || from} → {to}
            </Text>
            <Text className="text-text-muted text-sm mt-1">
              {formatTimeDisplay()}
            </Text>
          </View>

          {/* Empty message */}
          <View className="bg-surface rounded-card p-8 items-center">
            <TrainFront size={64} color={theme.text.muted} />
            <Text className="text-text text-lg font-semibold mt-4">
              No services found
            </Text>
            <Text className="text-text-muted text-center mt-2">
              There are no trains scheduled for this route at the selected time
            </Text>
          </View>
        </View>
      </ScreenLayout>
    );
  }

  // Success state with services list
  return (
    <ScreenLayout title="Services">
      <FlatList
        data={services}
        keyExtractor={(item) => item.service}
        renderItem={({ item }) => (
          <ServiceCard
            service={item}
            onPress={() => handleServicePress(item.service)}
          />
        )}
        contentContainerClassName="gap-3 pb-6"
        ListHeaderComponent={
          <View className="bg-surface rounded-card p-4 mb-2">
            <Text className="text-text text-lg font-semibold">
              {timetable?.station_name || from} → {to}
            </Text>
            <Text className="text-text-muted text-sm mt-1">
              {formatTimeDisplay()} • {services.length} service
              {services.length !== 1 ? "s" : ""}
            </Text>
          </View>
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
    </ScreenLayout>
  );
}
