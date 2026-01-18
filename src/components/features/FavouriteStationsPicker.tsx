/**
 * FavouriteStationsPicker component
 * Multi-select component for favourite stations with search functionality
 */

import { Card } from "@/components/ui/Card";
import { useStationSearch } from "@/hooks/useStations";
import { theme } from "@/lib/theme";
import { haptics } from "@/lib/utils/haptics";
import { useSettingsStore } from "@/stores";
import { Station } from "@/types/stations";
import { LinearGradient } from "expo-linear-gradient";
import { Check, MapPin, Plus, Search, Star, Trash2, X } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated as RNAnimated,
  FlatList,
  Keyboard,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  TextInput as RNTextInput,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
} from "react-native-reanimated";

interface FavouriteStationChipProps {
  station: Station;
  onRemove: (crs: string) => void;
}

const SWIPE_THRESHOLD = 80;

function FavouriteStationRow({
  station,
  onRemove,
}: FavouriteStationChipProps) {
  const translateX = useRef(new RNAnimated.Value(0)).current;
  const [isSwiping, setIsSwiping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isWeb = Platform.OS === "web";

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (isWeb) return false;
        return (
          Math.abs(gestureState.dx) > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        );
      },
      onPanResponderGrant: () => {
        setIsSwiping(true);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -SWIPE_THRESHOLD - 20));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsSwiping(false);
        if (gestureState.dx < -SWIPE_THRESHOLD) {
          RNAnimated.timing(translateX, {
            toValue: -400,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            haptics.selection();
            onRemove(station.crs);
          });
        } else {
          RNAnimated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 8,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        setIsSwiping(false);
        RNAnimated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const handleDeletePress = useCallback(() => {
    haptics.selection();
    onRemove(station.crs);
  }, [station.crs, onRemove]);

  const rowContent = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          backgroundColor: "rgba(245, 166, 35, 0.2)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Star size={16} color="#F5A623" fill="#F5A623" />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text className="text-text text-sm font-semibold">{station.name}</Text>
        <Text className="text-text-muted text-xs mt-0.5">{station.crs}</Text>
      </View>
    </View>
  );

  // Web version with hover delete button
  if (isWeb) {
    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        layout={Layout.springify().damping(15)}
        style={{ marginBottom: 8 }}
      >
        <View
          style={{ position: "relative" }}
          // @ts-ignore - web only
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {rowContent}

          {/* Delete button - positioned absolutely on the right */}
          <Pressable
            onPress={handleDeletePress}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              width: 32,
              height: 32,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${theme.error}20`,
              opacity: isHovered ? 1 : 0,
              transform: [{ translateY: -16 }],
            }}
          >
            <Trash2 size={14} color={theme.error} />
          </Pressable>
        </View>
      </Animated.View>
    );
  }

  // Native version with swipe-to-delete
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      layout={Layout.springify().damping(15)}
      style={{ marginBottom: 8, position: "relative", overflow: "hidden", borderRadius: 12 }}
    >
      {/* Delete background */}
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 12, overflow: "hidden" }}>
        <LinearGradient
          colors={["#c53030", theme.error]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={{ flex: 1, alignItems: "flex-end", justifyContent: "center", paddingRight: 24 }}
        >
          <Trash2 size={20} color="#fff" />
        </LinearGradient>
      </View>

      {/* Row content */}
      <RNAnimated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
      >
        {rowContent}
      </RNAnimated.View>
    </Animated.View>
  );
}

export function FavouriteStationsPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<RNTextInput>(null);

  const {
    favouriteStations,
    addFavouriteStation,
    removeFavouriteStation,
    isFavouriteStation,
  } = useSettingsStore();
  const { results, isLoading } = useStationSearch(query, 20);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setQuery("");
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    Keyboard.dismiss();
  }, []);

  const handleToggleStation = useCallback(
    (station: Station) => {
      if (isFavouriteStation(station.crs)) {
        removeFavouriteStation(station.crs);
        haptics.selection();
      } else {
        addFavouriteStation(station);
        haptics.notification("success");
      }
    },
    [isFavouriteStation, removeFavouriteStation, addFavouriteStation]
  );

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <>
      <Card variant="default" className="overflow-hidden">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-xl bg-amber-500/20 items-center justify-center mr-3">
              <Star size={16} color="#F5A623" fill="#F5A623" />
            </View>
            <Text className="text-text text-base font-semibold">
              Favourite Stations
            </Text>
          </View>
          <Pressable
            onPress={handleOpen}
            className="flex-row items-center bg-primary/20 rounded-full px-3 py-2 active:opacity-70"
          >
            <Plus size={16} color={theme.primary.DEFAULT} />
            <Text className="text-primary text-sm font-medium ml-1">Add</Text>
          </Pressable>
        </View>

        {/* Favourite Stations List */}
        {favouriteStations.length > 0 ? (
          <View>
            {favouriteStations.map((station) => (
              <FavouriteStationRow
                key={station.crs}
                station={station}
                onRemove={removeFavouriteStation}
              />
            ))}
          </View>
        ) : (
          <View className="py-4 items-center">
            <Text className="text-text-muted text-sm text-center">
              No favourite stations yet.{"\n"}
              Tap "Add" to select your frequent stations.
            </Text>
          </View>
        )}
      </Card>

      {/* Search Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle={Platform.OS === "ios" ? "pageSheet" : "fullScreen"}
        onRequestClose={handleClose}
      >
        <View className="flex-1 bg-background">
          {/* Header */}
          <View className="flex-row items-center px-4 py-3 border-b border-border">
            <View className="flex-1 flex-row items-center bg-surface rounded-[10px] px-3 h-[44px]">
              <Search size={20} color={theme.text.muted} />
              <RNTextInput
                ref={inputRef}
                value={query}
                onChangeText={setQuery}
                placeholder="Search by name or CRS code"
                placeholderTextColor={theme.text.muted}
                className="flex-1 ml-2 text-text text-base"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery("")} hitSlop={8}>
                  <X size={18} color={theme.text.muted} />
                </Pressable>
              )}
            </View>
            <Pressable onPress={handleClose} className="ml-3 py-2">
              <Text className="text-primary text-base font-medium">Done</Text>
            </Pressable>
          </View>

          {/* Selected Count */}
          {favouriteStations.length > 0 && (
            <View className="px-4 py-2 bg-surface border-b border-border">
              <Text className="text-text-muted text-sm">
                {favouriteStations.length} station
                {favouriteStations.length !== 1 ? "s" : ""} selected
              </Text>
            </View>
          )}

          {/* Results List */}
          <FlatList
            data={results}
            keyExtractor={(item) => item.crs}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View className="items-center py-12 px-4">
                {isLoading ? (
                  <Text className="text-text-muted">Loading stations...</Text>
                ) : query.trim() ? (
                  <Text className="text-text-muted">
                    No stations found for "{query}"
                  </Text>
                ) : (
                  <Text className="text-text-muted text-center">
                    Start typing to search stations{"\n"}
                    by name or CRS code
                  </Text>
                )}
              </View>
            }
            renderItem={({ item }) => {
              const isSelected = isFavouriteStation(item.crs);
              return (
                <Pressable
                  onPress={() => handleToggleStation(item)}
                  className={`flex-row items-center px-4 py-3 border-b border-border ${
                    isSelected ? "bg-primary/10" : "active:bg-surface"
                  }`}
                >
                  <View
                    className={`w-6 h-6 rounded-full items-center justify-center mr-3 ${
                      isSelected ? "bg-primary" : "border border-white/20"
                    }`}
                  >
                    {isSelected && (
                      <Check size={14} color="#fff" strokeWidth={3} />
                    )}
                  </View>
                  <MapPin
                    size={20}
                    color={
                      isSelected ? theme.primary.DEFAULT : theme.text.muted
                    }
                  />
                  <View className="flex-1 ml-3">
                    <Text
                      className={`text-base ${isSelected ? "text-primary font-semibold" : "text-text"}`}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-text-muted text-sm">{item.crs}</Text>
                  </View>
                  {isSelected && (
                    <Star
                      size={18}
                      color={theme.primary.DEFAULT}
                      fill={theme.primary.DEFAULT}
                    />
                  )}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
}
