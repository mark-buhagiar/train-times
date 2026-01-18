/**
 * StationAutocomplete component
 * Search and select UK train stations with autocomplete functionality
 */

import { useStationSearch } from "@/hooks/useStations";
import { theme } from "@/lib/theme";
import { useRecentStationsStore } from "@/stores";
import { Station } from "@/types/stations";
import { Clock, MapPin, Search, X } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  TextInput as RNTextInput,
  Text,
  View,
} from "react-native";

interface StationAutocompleteProps {
  /** Label for the input field */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Currently selected station */
  value?: Station | null;
  /** Callback when a station is selected */
  onSelect: (station: Station) => void;
  /** Error message to display */
  error?: string;
}

export function StationAutocomplete({
  label,
  placeholder = "Search stations...",
  value,
  onSelect,
  error,
}: StationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<RNTextInput>(null);

  const { results, isLoading } = useStationSearch(query, 15);
  const { recentStations, addRecentStation } = useRecentStationsStore();

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setQuery("");
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    Keyboard.dismiss();
  }, []);

  const handleSelect = useCallback(
    (station: Station) => {
      onSelect(station);
      addRecentStation(station);
      handleClose();
    },
    [onSelect, addRecentStation, handleClose]
  );

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Show recent stations when no query, otherwise show search results
  const displayStations = query.trim() ? results : recentStations;
  const showRecentHeader = !query.trim() && recentStations.length > 0;

  return (
    <>
      {/* Trigger Button */}
      <View>
        {label && (
          <Text className="text-text-secondary text-sm mb-2 font-medium">
            {label}
          </Text>
        )}
        <Pressable
          onPress={handleOpen}
          className={`
            h-14 px-4 rounded-2xl flex-row items-center
            border ${error ? "border-error" : "border-white/10"}
          `}
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
          accessibilityLabel={label || "Select station"}
          accessibilityRole="button"
        >
          <View className="w-8 h-8 rounded-xl bg-primary/20 items-center justify-center mr-3">
            <MapPin
              size={16}
              color={value ? theme.primary.DEFAULT : theme.text.muted}
            />
          </View>
          <Text
            className={`flex-1 text-base font-medium ${value ? "text-text" : "text-text-muted"}`}
            numberOfLines={1}
          >
            {value ? `${value.name} (${value.crs})` : placeholder}
          </Text>
          {value && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onSelect(null as any);
              }}
              hitSlop={8}
              accessibilityLabel="Clear selection"
            >
              <X size={20} color={theme.text.muted} />
            </Pressable>
          )}
        </Pressable>
        {error && <Text className="text-error text-xs mt-1">{error}</Text>}
      </View>

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
              <Text className="text-primary text-base font-medium">Cancel</Text>
            </Pressable>
          </View>

          {/* Results List */}
          <FlatList
            data={displayStations}
            keyExtractor={(item) => item.crs}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              showRecentHeader ? (
                <View className="flex-row items-center px-4 py-3 bg-surface">
                  <Clock size={16} color={theme.text.muted} />
                  <Text className="text-text-muted text-sm ml-2 font-medium">
                    Recent Stations
                  </Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View className="items-center py-12 px-4">
                {isLoading ? (
                  <Text className="text-text-muted">Loading stations...</Text>
                ) : query.trim() ? (
                  <Text className="text-text-muted">
                    No stations found for "{query}"
                  </Text>
                ) : (
                  <Text className="text-text-muted">
                    Start typing to search stations
                  </Text>
                )}
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelect(item)}
                className="flex-row items-center px-4 py-3 border-b border-border active:bg-surface"
              >
                <MapPin size={20} color={theme.text.muted} />
                <View className="flex-1 ml-3">
                  <Text className="text-text text-base">{item.name}</Text>
                  <Text className="text-text-muted text-sm">{item.crs}</Text>
                </View>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </>
  );
}
