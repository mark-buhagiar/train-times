import { StationAutocomplete } from "@/components/features";
import { ScreenLayout } from "@/components/layout";
import {
  AnimatedPressable,
  EmptyState,
  FadeIn,
  GlassCard,
  PressableGlassCard,
  SlideIn,
  SwipeableCard,
  TimePicker,
} from "@/components/ui";
import { useLocation } from "@/hooks";
import { theme } from "@/lib/theme";
import { haptics } from "@/lib/utils";
import { useJourneysStore, useSearchStore } from "@/stores";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowDownUp,
  ArrowRight,
  Clock,
  MapPin,
  Navigation,
  Search,
  Sparkles,
  Train,
} from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { Platform, ScrollView, Text, View } from "react-native";

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
    removeRecentSearch,
  } = useSearchStore();

  const { getRecommendedJourneys, updateJourneyLastUsed } = useJourneysStore();
  const { location, isLoading: isLoadingLocation } = useLocation({
    autoFetch: true,
  });

  const [isSearching, setIsSearching] = useState(false);

  // Get recommended journeys based on current location and time
  const recommendedJourneys = useMemo(() => {
    return getRecommendedJourneys(
      location?.latitude ?? null,
      location?.longitude ?? null
    );
  }, [getRecommendedJourneys, location]);

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
    <ScreenLayout
      title="Find Your Train"
      subtitle="UK Train Times"
      icon={Train}
      iconBgClass="bg-primary/20"
      iconColor={theme.primary.DEFAULT}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="pb-8"
      >
        {/* Main Search Card */}
        <SlideIn direction="bottom" delay={100}>
          <GlassCard intensity="strong" glowBorder className="mb-6">
            <View className="gap-4">
              {/* From Station */}
              <View>
                <Text className="text-text-secondary text-xs font-semibold mb-2 tracking-wide uppercase">
                  From
                </Text>
                <StationAutocomplete
                  placeholder="Departing from..."
                  value={fromStation}
                  onSelect={setFromStation}
                />
              </View>

              {/* Swap Button - Always visible to prevent layout shift */}
              <View className="items-center -my-2">
                <AnimatedPressable
                  onPress={handleSwapStations}
                  disabled={!fromStation || !toStation}
                  className={`w-10 h-10 rounded-full items-center justify-center border ${
                    fromStation && toStation
                      ? "bg-primary/20 border-primary/30"
                      : "bg-white/5 border-white/10"
                  }`}
                  accessibilityLabel="Swap stations"
                  pressedScale={0.9}
                >
                  <ArrowDownUp
                    size={18}
                    color={
                      fromStation && toStation
                        ? theme.primary.DEFAULT
                        : theme.text.muted
                    }
                  />
                </AnimatedPressable>
              </View>

              {/* To Station */}
              <View>
                <Text className="text-text-secondary text-xs font-semibold mb-2 tracking-wide uppercase">
                  To
                </Text>
                <StationAutocomplete
                  placeholder="Arriving at..."
                  value={toStation}
                  onSelect={setToStation}
                />
              </View>

              {/* Divider */}
              <View className="h-px bg-white/10 my-1" />

              {/* Time Picker */}
              <View>
                <Text className="text-text-secondary text-xs font-semibold mb-2 tracking-wide uppercase">
                  When
                </Text>
                <TimePicker value={when} onChange={setWhen} />
              </View>
            </View>
          </GlassCard>
        </SlideIn>

        {/* Search Button */}
        <FadeIn delay={200}>
          <AnimatedPressable
            onPress={handleSearch}
            disabled={!canSearch || isSearching}
            pressedScale={0.98}
            className="mb-8"
          >
            <LinearGradient
              colors={
                canSearch
                  ? [theme.primary.DEFAULT, "#667eea"]
                  : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-2xl py-5 flex-row items-center justify-center gap-3"
              style={
                canSearch
                  ? {
                      shadowColor: theme.primary.DEFAULT,
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.4,
                      shadowRadius: 16,
                    }
                  : {}
              }
            >
              {isSearching ? (
                <View className="flex-row items-center gap-2">
                  <Sparkles size={22} color="#fff" />
                  <Text className="text-white text-lg font-bold">
                    Searching...
                  </Text>
                </View>
              ) : (
                <>
                  <Search
                    size={22}
                    color={canSearch ? "#fff" : theme.text.muted}
                  />
                  <Text
                    className={`text-lg font-bold ${canSearch ? "text-white" : "text-text-muted"}`}
                  >
                    Search Trains
                  </Text>
                </>
              )}
            </LinearGradient>
          </AnimatedPressable>
        </FadeIn>

        {/* Recommended Journeys */}
        {recommendedJourneys.length > 0 && (
          <FadeIn delay={250}>
            <View className="mb-8">
              <View className="flex-row items-center gap-2 mb-4">
                <View className="w-8 h-8 rounded-full bg-green-500/20 items-center justify-center">
                  <MapPin size={16} color="#22c55e" />
                </View>
                <View className="flex-1">
                  <Text className="text-text text-sm font-semibold">
                    Suggested for you
                  </Text>
                  <Text className="text-text-muted text-xs">
                    Based on your location & time
                  </Text>
                </View>
                {isLoadingLocation && (
                  <View className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                )}
              </View>
              <View className="gap-3">
                {recommendedJourneys.slice(0, 3).map((journey) => (
                  <PressableGlassCard
                    key={journey.id}
                    intensity="medium"
                    glowBorder
                    onPress={() => {
                      haptics.impact("light");
                      setFromStation(journey.fromStation);
                      setToStation(journey.toStation);
                      updateJourneyLastUsed(journey.id);
                    }}
                  >
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-4">
                        <Navigation size={18} color={theme.primary.DEFAULT} />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          <Text className="text-text text-base font-semibold">
                            {journey.fromStation.name}
                          </Text>
                          <ArrowRight size={14} color={theme.text.muted} />
                          <Text
                            className="text-text text-base font-semibold flex-1"
                            numberOfLines={1}
                          >
                            {journey.toStation.name}
                          </Text>
                        </View>
                        <Text className="text-text-muted text-xs mt-1">
                          {journey.fromStation.crs} → {journey.toStation.crs}
                        </Text>
                      </View>
                      <View className="w-8 h-8 rounded-full bg-green-500/20 items-center justify-center">
                        <Sparkles size={14} color="#22c55e" />
                      </View>
                    </View>
                  </PressableGlassCard>
                ))}
              </View>
            </View>
          </FadeIn>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 ? (
          <FadeIn delay={300}>
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <Clock size={16} color={theme.text.muted} />
                  <Text className="text-text-muted text-sm font-semibold tracking-wide uppercase">
                    Recent Journeys
                  </Text>
                </View>
                <Text className="text-text-muted text-xs">
                  {Platform.OS === "web" ? "Hover to delete" : "Swipe left"}
                </Text>
              </View>
              <View className="gap-0">
                {recentSearches.slice(0, 5).map((search) => (
                  <SwipeableCard
                    key={`${search.from.crs}-${search.to.crs}`}
                    onPress={() =>
                      handleRecentSearchPress(search.from, search.to)
                    }
                    onDelete={() => {
                      haptics.impact("medium");
                      removeRecentSearch(search.from, search.to);
                    }}
                    deleteAlertTitle="Remove Recent Search"
                    deleteAlertMessage={`Remove ${search.from.name} → ${search.to.name}?`}
                    intensity="light"
                  >
                    <View className="flex-row items-center">
                      <View className="flex-1">
                        <View className="flex-row items-center gap-3">
                          <Text className="text-text text-base font-semibold">
                            {search.from.name}
                          </Text>
                          <View className="w-6 h-6 rounded-full bg-primary/20 items-center justify-center">
                            <ArrowRight
                              size={14}
                              color={theme.primary.DEFAULT}
                            />
                          </View>
                          <Text className="text-text text-base font-semibold flex-1">
                            {search.to.name}
                          </Text>
                        </View>
                        <Text className="text-text-muted text-xs mt-2 font-medium">
                          {search.from.crs} → {search.to.crs}
                        </Text>
                      </View>
                    </View>
                  </SwipeableCard>
                ))}
              </View>
            </View>
          </FadeIn>
        ) : (
          <FadeIn delay={300}>
            <GlassCard intensity="light" className="mt-4 mb-8">
              <EmptyState
                variant="no-recent"
                title="No recent searches"
                description="Your recent journeys will appear here for quick access"
              />
            </GlassCard>
          </FadeIn>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}
