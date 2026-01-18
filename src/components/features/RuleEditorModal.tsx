/**
 * RuleEditorModal - Modal for adding/editing journey recommendation rules
 */

import { Button } from "@/components/ui";
import { useLocation } from "@/hooks";
import { theme } from "@/lib/theme";
import { haptics } from "@/lib/utils";
import { RecommendationRule, SavedLocation, useJourneysStore } from "@/stores";
import * as Location from "expo-location";
import { Calendar, Clock, MapPin, Navigation, X } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

const DAYS = [
  { id: 0, short: "Sun", long: "Sunday" },
  { id: 1, short: "Mon", long: "Monday" },
  { id: 2, short: "Tue", long: "Tuesday" },
  { id: 3, short: "Wed", long: "Wednesday" },
  { id: 4, short: "Thu", long: "Thursday" },
  { id: 5, short: "Fri", long: "Friday" },
  { id: 6, short: "Sat", long: "Saturday" },
];

interface RuleEditorModalProps {
  visible: boolean;
  onClose: () => void;
  journeyId: string;
  editingRule?: RecommendationRule | null;
}

export function RuleEditorModal({
  visible,
  onClose,
  journeyId,
  editingRule,
}: RuleEditorModalProps) {
  const { addRule, updateRule, savedLocations, addLocation } =
    useJourneysStore();
  const {
    location: currentLocation,
    isLoading: isLoadingLocation,
    requestPermission,
    permissionStatus,
  } = useLocation();

  // Form state
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationCoords, setNewLocationCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [radius, setRadius] = useState(200);
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);

  const [timeEnabled, setTimeEnabled] = useState(false);
  const [timeStart, setTimeStart] = useState("09:00");
  const [timeEnd, setTimeEnd] = useState("17:00");

  const [daysEnabled, setDaysEnabled] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri default

  // Initialize form from editing rule
  useEffect(() => {
    if (editingRule) {
      if (editingRule.location) {
        setLocationEnabled(true);
        setSelectedLocationId(editingRule.locationId || null);
        setRadius(editingRule.location.radiusMeters);
      }
      if (editingRule.timeStart && editingRule.timeEnd) {
        setTimeEnabled(true);
        setTimeStart(editingRule.timeStart);
        setTimeEnd(editingRule.timeEnd);
      }
      if (editingRule.daysOfWeek && editingRule.daysOfWeek.length > 0) {
        setDaysEnabled(true);
        setSelectedDays(editingRule.daysOfWeek);
      }
    } else {
      // Reset form for new rule
      setLocationEnabled(false);
      setSelectedLocationId(null);
      setNewLocationName("");
      setNewLocationCoords(null);
      setRadius(200);
      setTimeEnabled(false);
      setTimeStart("09:00");
      setTimeEnd("17:00");
      setDaysEnabled(false);
      setSelectedDays([1, 2, 3, 4, 5]);
    }
  }, [editingRule, visible]);

  // Capture current location
  const handleCaptureLocation = useCallback(async () => {
    setIsCapturingLocation(true);

    // Request permission if needed
    if (permissionStatus !== Location.PermissionStatus.GRANTED) {
      const granted = await requestPermission();
      if (!granted) {
        setIsCapturingLocation(false);
        return;
      }
    }

    // Get location
    try {
      let coords: { lat: number; lon: number };

      if (Platform.OS === "web") {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
            });
          }
        );
        coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
      } else {
        const result = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        coords = { lat: result.coords.latitude, lon: result.coords.longitude };
      }

      setNewLocationCoords(coords);
      setSelectedLocationId(null); // Clear any existing selection
      haptics.notification("success");
    } catch (e) {
      console.error("Failed to get location:", e);
    }

    setIsCapturingLocation(false);
  }, [permissionStatus, requestPermission]);

  // Toggle day selection
  const handleToggleDay = useCallback((dayId: number) => {
    haptics.selection();
    setSelectedDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((d) => d !== dayId)
        : [...prev, dayId].sort((a, b) => a - b)
    );
  }, []);

  // Save rule
  const handleSave = useCallback(() => {
    // Build location object if needed
    let location: SavedLocation | undefined;

    if (locationEnabled) {
      if (selectedLocationId) {
        // Using existing location
        location = savedLocations.find((l) => l.id === selectedLocationId);
      } else if (newLocationCoords && newLocationName.trim()) {
        // Create new location
        location = addLocation({
          name: newLocationName.trim(),
          latitude: newLocationCoords.lat,
          longitude: newLocationCoords.lon,
          radiusMeters: radius,
        });
      }
    }

    const ruleData: Omit<RecommendationRule, "id"> = {
      location,
      locationId: location?.id,
      timeStart: timeEnabled ? timeStart : undefined,
      timeEnd: timeEnabled ? timeEnd : undefined,
      daysOfWeek:
        daysEnabled && selectedDays.length > 0 && selectedDays.length < 7
          ? selectedDays
          : undefined,
    };

    if (editingRule) {
      updateRule(journeyId, editingRule.id, ruleData);
    } else {
      addRule(journeyId, ruleData);
    }

    haptics.notification("success");
    onClose();
  }, [
    locationEnabled,
    selectedLocationId,
    newLocationCoords,
    newLocationName,
    radius,
    timeEnabled,
    timeStart,
    timeEnd,
    daysEnabled,
    selectedDays,
    savedLocations,
    addLocation,
    addRule,
    updateRule,
    journeyId,
    editingRule,
    onClose,
  ]);

  // Check if form is valid
  const isValid = locationEnabled || timeEnabled || daysEnabled;
  const needsLocationName =
    locationEnabled &&
    newLocationCoords &&
    !newLocationName.trim() &&
    !selectedLocationId;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : "fullScreen"}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
          <Pressable onPress={onClose} hitSlop={8}>
            <X size={24} color={theme.text.DEFAULT} />
          </Pressable>
          <Text className="text-text text-lg font-semibold">
            {editingRule ? "Edit Rule" : "Add Rule"}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Location Section */}
          <Animated.View entering={FadeIn.delay(100)}>
            <SectionToggle
              icon={MapPin}
              title="Location"
              description="Recommend when near a specific place"
              enabled={locationEnabled}
              onToggle={() => {
                haptics.selection();
                setLocationEnabled(!locationEnabled);
              }}
            />

            {locationEnabled && (
              <Animated.View
                entering={SlideInDown.duration(200)}
                className="ml-4 mb-4"
              >
                {/* Existing locations */}
                {savedLocations.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-text-muted text-xs mb-2 uppercase tracking-wide">
                      Saved Locations
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {savedLocations.map((loc) => (
                        <Pressable
                          key={loc.id}
                          onPress={() => {
                            haptics.selection();
                            setSelectedLocationId(loc.id);
                            setNewLocationCoords(null);
                            setRadius(loc.radiusMeters);
                          }}
                          style={{
                            backgroundColor:
                              selectedLocationId === loc.id
                                ? `${theme.primary.DEFAULT}30`
                                : "rgba(255,255,255,0.05)",
                            borderWidth: 1,
                            borderColor:
                              selectedLocationId === loc.id
                                ? theme.primary.DEFAULT
                                : "rgba(255,255,255,0.1)",
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                          }}
                        >
                          <Text
                            className={
                              selectedLocationId === loc.id
                                ? "text-primary font-medium"
                                : "text-text"
                            }
                          >
                            {loc.name}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}

                {/* Capture location */}
                <Pressable
                  onPress={handleCaptureLocation}
                  disabled={isCapturingLocation}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: newLocationCoords
                      ? `${theme.success}20`
                      : "rgba(255,255,255,0.05)",
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: newLocationCoords
                      ? theme.success
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  {isCapturingLocation ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.primary.DEFAULT}
                    />
                  ) : (
                    <Navigation
                      size={20}
                      color={
                        newLocationCoords
                          ? theme.success
                          : theme.primary.DEFAULT
                      }
                    />
                  )}
                  <View className="flex-1 ml-3">
                    <Text className="text-text font-medium">
                      {newLocationCoords
                        ? "Location captured!"
                        : "Use Current Location"}
                    </Text>
                    {newLocationCoords && (
                      <Text className="text-text-muted text-xs mt-1">
                        {newLocationCoords.lat.toFixed(6)},{" "}
                        {newLocationCoords.lon.toFixed(6)}
                      </Text>
                    )}
                  </View>
                </Pressable>

                {/* Location name input */}
                {newLocationCoords && !selectedLocationId && (
                  <View className="mb-4">
                    <Text className="text-text-muted text-xs mb-2">
                      Location Name
                    </Text>
                    <TextInput
                      value={newLocationName}
                      onChangeText={setNewLocationName}
                      placeholder="e.g., Home, Office"
                      placeholderTextColor={theme.text.muted}
                      className="bg-surface text-text rounded-xl px-4 py-3"
                      style={{
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                    />
                  </View>
                )}

                {/* Radius slider */}
                <View className="mb-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-text-muted text-xs">
                      Detection Radius
                    </Text>
                    <Text className="text-text font-medium">{radius}m</Text>
                  </View>
                  <View className="flex-row gap-2">
                    {[100, 200, 500, 1000].map((r) => (
                      <Pressable
                        key={r}
                        onPress={() => {
                          haptics.selection();
                          setRadius(r);
                        }}
                        style={{
                          flex: 1,
                          backgroundColor:
                            radius === r
                              ? `${theme.primary.DEFAULT}30`
                              : "rgba(255,255,255,0.05)",
                          borderWidth: 1,
                          borderColor:
                            radius === r
                              ? theme.primary.DEFAULT
                              : "rgba(255,255,255,0.1)",
                          borderRadius: 8,
                          paddingVertical: 8,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          className={
                            radius === r
                              ? "text-primary font-medium"
                              : "text-text"
                          }
                        >
                          {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </Animated.View>
            )}
          </Animated.View>

          {/* Time Section */}
          <Animated.View entering={FadeIn.delay(200)}>
            <SectionToggle
              icon={Clock}
              title="Time Window"
              description="Recommend during specific hours"
              enabled={timeEnabled}
              onToggle={() => {
                haptics.selection();
                setTimeEnabled(!timeEnabled);
              }}
            />

            {timeEnabled && (
              <Animated.View
                entering={SlideInDown.duration(200)}
                className="ml-4 mb-4"
              >
                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <Text className="text-text-muted text-xs mb-2">From</Text>
                    <TextInput
                      value={timeStart}
                      onChangeText={setTimeStart}
                      placeholder="HH:mm"
                      placeholderTextColor={theme.text.muted}
                      className="bg-surface text-text text-center rounded-xl px-4 py-3"
                      style={{
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-muted text-xs mb-2">To</Text>
                    <TextInput
                      value={timeEnd}
                      onChangeText={setTimeEnd}
                      placeholder="HH:mm"
                      placeholderTextColor={theme.text.muted}
                      className="bg-surface text-text text-center rounded-xl px-4 py-3"
                      style={{
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>
                </View>
                <Text className="text-text-muted text-xs mt-2 text-center">
                  Use 24-hour format (e.g., 09:00 - 17:00)
                </Text>
              </Animated.View>
            )}
          </Animated.View>

          {/* Days Section */}
          <Animated.View entering={FadeIn.delay(300)}>
            <SectionToggle
              icon={Calendar}
              title="Days of Week"
              description="Recommend only on specific days"
              enabled={daysEnabled}
              onToggle={() => {
                haptics.selection();
                setDaysEnabled(!daysEnabled);
              }}
            />

            {daysEnabled && (
              <Animated.View
                entering={SlideInDown.duration(200)}
                className="ml-4 mb-4"
              >
                <View className="flex-row gap-2">
                  {DAYS.map((day) => (
                    <Pressable
                      key={day.id}
                      onPress={() => handleToggleDay(day.id)}
                      style={{
                        flex: 1,
                        backgroundColor: selectedDays.includes(day.id)
                          ? `${theme.primary.DEFAULT}30`
                          : "rgba(255,255,255,0.05)",
                        borderWidth: 1,
                        borderColor: selectedDays.includes(day.id)
                          ? theme.primary.DEFAULT
                          : "rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        paddingVertical: 10,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        className={
                          selectedDays.includes(day.id)
                            ? "text-primary font-medium text-xs"
                            : "text-text text-xs"
                        }
                      >
                        {day.short}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Animated.View>
            )}
          </Animated.View>

          {/* Info note */}
          {!isValid && (
            <View className="mt-4 p-4 bg-amber-500/10 rounded-xl border border-amber-500/30">
              <Text className="text-amber-400 text-sm text-center">
                Enable at least one condition (location, time, or days)
              </Text>
            </View>
          )}

          {needsLocationName && (
            <View className="mt-4 p-4 bg-amber-500/10 rounded-xl border border-amber-500/30">
              <Text className="text-amber-400 text-sm text-center">
                Please name your location
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View className="px-4 py-4 border-t border-border">
          <Button
            title={editingRule ? "Save Changes" : "Add Rule"}
            onPress={handleSave}
            disabled={!isValid || !!needsLocationName}
          />
        </View>
      </View>
    </Modal>
  );
}

// Section toggle component
function SectionToggle({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: enabled
            ? `${theme.primary.DEFAULT}20`
            : "rgba(255,255,255,0.05)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          size={20}
          color={enabled ? theme.primary.DEFAULT : theme.text.muted}
        />
      </View>
      <View className="flex-1 ml-3">
        <Text
          className={
            enabled ? "text-text font-semibold" : "text-text-secondary"
          }
        >
          {title}
        </Text>
        <Text className="text-text-muted text-xs mt-0.5">{description}</Text>
      </View>
      <View
        style={{
          width: 48,
          height: 28,
          borderRadius: 14,
          backgroundColor: enabled
            ? theme.primary.DEFAULT
            : "rgba(255,255,255,0.1)",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: "#fff",
            alignSelf: enabled ? "flex-end" : "flex-start",
          }}
        />
      </View>
    </Pressable>
  );
}
