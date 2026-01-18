/**
 * TimePicker component
 * Allows selecting a time between -3 hours and +24 hours from now
 */

import { theme } from "@/lib/theme";
import { formatTimeOption } from "@/lib/utils/date";
import { ChevronDown, Clock } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Modal, Platform, Pressable, Text, View } from "react-native";

interface TimePickerProps {
  /** Label for the input field */
  label?: string;
  /** Currently selected time (ISO string or null for "now") */
  value: string | null;
  /** Callback when a time is selected */
  onChange: (time: string | null) => void;
  /** Error message to display */
  error?: string;
}

interface TimeOption {
  label: string;
  value: string | null;
  isNow: boolean;
}

/**
 * Generate time options from -3 hours to +24 hours in 15-minute intervals
 */
function generateTimeOptions(): TimeOption[] {
  const options: TimeOption[] = [];
  const now = new Date();

  // Add "Now" option first
  options.push({
    label: "Now",
    value: null,
    isNow: true,
  });

  // Generate times from -3 hours to +24 hours in 15-minute intervals
  const startMinutes = -3 * 60; // -3 hours
  const endMinutes = 24 * 60; // +24 hours

  for (
    let offsetMinutes = startMinutes;
    offsetMinutes <= endMinutes;
    offsetMinutes += 15
  ) {
    const time = new Date(now.getTime() + offsetMinutes * 60 * 1000);

    // Round to nearest 15 minutes for cleaner times
    time.setMinutes(Math.round(time.getMinutes() / 15) * 15);
    time.setSeconds(0);
    time.setMilliseconds(0);

    options.push({
      label: formatTimeOption(time, now),
      value: time.toISOString(),
      isNow: false,
    });
  }

  return options;
}

export function TimePicker({ label, value, onChange, error }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const timeOptions = useMemo(() => generateTimeOptions(), []);

  const selectedOption = useMemo(() => {
    if (value === null) {
      return timeOptions[0]; // "Now" option
    }
    return timeOptions.find((opt) => opt.value === value) || timeOptions[0];
  }, [value, timeOptions]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSelect = useCallback(
    (option: TimeOption) => {
      onChange(option.value);
      handleClose();
    },
    [onChange, handleClose]
  );

  // Find index of selected item for initial scroll
  const selectedIndex = useMemo(() => {
    const index = timeOptions.findIndex(
      (opt) => opt.value === value || (opt.isNow && value === null)
    );
    return Math.max(0, index);
  }, [timeOptions, value]);

  return (
    <>
      {/* Trigger Button */}
      <View className="mb-4">
        {label && (
          <Text className="text-text-secondary text-sm mb-2 font-medium">
            {label}
          </Text>
        )}
        <Pressable
          onPress={handleOpen}
          className={`
            h-[50px] px-4 rounded-[10px] bg-surface flex-row items-center
            border ${error ? "border-error" : "border-border"}
          `}
          accessibilityLabel={label || "Select time"}
          accessibilityRole="button"
        >
          <Clock size={20} color={theme.text.muted} />
          <Text
            className={`flex-1 ml-3 text-base ${
              value === null ? "text-text" : "text-text"
            }`}
          >
            {selectedOption.label}
          </Text>
          <ChevronDown size={20} color={theme.text.muted} />
        </Pressable>
        {error && <Text className="text-error text-xs mt-1">{error}</Text>}
      </View>

      {/* Time Selection Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle={Platform.OS === "ios" ? "pageSheet" : "fullScreen"}
        onRequestClose={handleClose}
      >
        <View className="flex-1 bg-background">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
            <Text className="text-text text-lg font-semibold">Select Time</Text>
            <Pressable onPress={handleClose} className="py-2">
              <Text className="text-primary text-base font-medium">Done</Text>
            </Pressable>
          </View>

          {/* Time Options List */}
          <FlatList
            data={timeOptions}
            keyExtractor={(item, index) => item.value || `now-${index}`}
            initialScrollIndex={selectedIndex > 5 ? selectedIndex - 2 : 0}
            getItemLayout={(_, index) => ({
              length: 52,
              offset: 52 * index,
              index,
            })}
            renderItem={({ item }) => {
              const isSelected =
                (item.isNow && value === null) || item.value === value;

              return (
                <Pressable
                  onPress={() => handleSelect(item)}
                  className={`
                    flex-row items-center px-4 py-3 border-b border-border
                    ${isSelected ? "bg-primary-muted" : "active:bg-surface"}
                  `}
                >
                  <Clock
                    size={20}
                    color={
                      isSelected ? theme.primary.DEFAULT : theme.text.muted
                    }
                  />
                  <Text
                    className={`flex-1 ml-3 text-base ${
                      isSelected ? "text-primary font-semibold" : "text-text"
                    }`}
                  >
                    {item.label}
                  </Text>
                  {isSelected && (
                    <View className="w-2 h-2 rounded-full bg-primary" />
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
