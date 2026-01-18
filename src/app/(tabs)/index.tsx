import { StationAutocomplete } from "@/components/features";
import { ScreenLayout } from "@/components/layout";
import { Button, PressableCard, TimePicker } from "@/components/ui";
import { theme } from "@/lib/theme";
import { useSearchStore } from "@/stores";
import { router } from "expo-router";
import { ArrowDownUp, ArrowRight, Clock } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const {
    fromStation,
    toStation,
    when,
    recentSearches,
    setFromStation,
    setToStation,
    setWhen,
    addRecentSearch,
  } = useSearchStore();

  const [isSearching, setIsSearching] = useState(false);

  const canSearch = fromStation && toStation;

  const handleSwapStations = useCallback(() => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  }, [fromStation, toStation, setFromStation, setToStation]);

  const handleSearch = useCallback(async () => {
    if (!fromStation || !toStation) return;

    setIsSearching(true);

    // Add to recent searches
    addRecentSearch(fromStation, toStation);

    // Navigate to services screen
    router.push({
      pathname: "/services",
      params: {
        from: fromStation.crs,
        to: toStation.crs,
        fromName: fromStation.name,
        toName: toStation.name,
        ...(when && { when }),
      },
    });

    setIsSearching(false);
  }, [fromStation, toStation, when, addRecentSearch]);

  const handleRecentSearchPress = useCallback(
    (
      from: { crs: string; name: string },
      to: { crs: string; name: string }
    ) => {
      setFromStation(from);
      setToStation(to);
    },
    [setFromStation, setToStation]
  );

  return (
    <ScreenLayout title="Find Your Train">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Station Selection */}
        <View className="gap-2">
          <StationAutocomplete
            label="From"
            placeholder="Departing from..."
            value={fromStation}
            onSelect={setFromStation}
          />

          {/* Swap Stations Button */}
          {fromStation && toStation && (
            <Pressable
              onPress={handleSwapStations}
              className="self-center -my-1 p-2 bg-surface rounded-full active:bg-surface-hover"
              accessibilityLabel="Swap stations"
            >
              <ArrowDownUp size={20} color={theme.text.muted} />
            </Pressable>
          )}

          <StationAutocomplete
            label="To"
            placeholder="Arriving at..."
            value={toStation}
            onSelect={setToStation}
          />
        </View>

        {/* Time Picker */}
        <View className="mt-4">
          <TimePicker label="When" value={when} onChange={setWhen} />
        </View>

        {/* Search Button */}
        <View className="mt-6">
          <Button
            title="Search Trains"
            onPress={handleSearch}
            disabled={!canSearch}
            loading={isSearching}
          />
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View className="mt-8">
            <Text className="text-text-secondary text-sm font-medium mb-3">
              Recent Searches
            </Text>
            <View className="gap-2">
              {recentSearches.slice(0, 5).map((search, index) => (
                <PressableCard
                  key={`${search.from.crs}-${search.to.crs}-${index}`}
                  onPress={() =>
                    handleRecentSearchPress(search.from, search.to)
                  }
                  variant="elevated"
                >
                  <View className="flex-row items-center">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-text text-base font-medium">
                          {search.from.name}
                        </Text>
                        <ArrowRight size={16} color={theme.text.muted} />
                        <Text className="text-text text-base font-medium">
                          {search.to.name}
                        </Text>
                      </View>
                      <Text className="text-text-muted text-xs mt-1">
                        {search.from.crs} → {search.to.crs}
                      </Text>
                    </View>
                    <Clock size={16} color={theme.text.muted} />
                  </View>
                </PressableCard>
              ))}
            </View>
          </View>
        )}

        {/* Bottom padding for scroll */}
        <View className="h-8" />
      </ScrollView>
    </ScreenLayout>
  );
}
