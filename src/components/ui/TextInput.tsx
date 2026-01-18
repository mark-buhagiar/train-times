import { theme } from "@/lib/theme";
import { X } from "lucide-react-native";
import { forwardRef, useState } from "react";
import {
  Pressable,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  Text,
  View,
} from "react-native";

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  clearable?: boolean;
  onClear?: () => void;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({ label, error, helperText, clearable, onClear, value, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const showClear = clearable && value && value.length > 0;

    return (
      <View className="mb-4">
        {label && (
          <Text className="text-gray-100 text-sm mb-2 font-medium">
            {label}
          </Text>
        )}
        <View className="relative">
          <RNTextInput
            ref={ref}
            value={value}
            className={`
              h-[50px] px-4 rounded-[10px] bg-surface text-white text-base
              border ${
                isFocused
                  ? "border-primary"
                  : error
                    ? "border-error"
                    : "border-border"
              }
              ${showClear ? "pr-12" : ""}
            `}
            placeholderTextColor={theme.text.muted}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            accessibilityLabel={label}
            accessibilityHint={helperText}
            {...props}
          />
          {showClear && (
            <Pressable
              onPress={onClear}
              className="absolute right-3 top-0 bottom-0 justify-center"
              accessibilityLabel="Clear input"
              accessibilityRole="button"
            >
              <X size={20} color={theme.text.muted} />
            </Pressable>
          )}
        </View>
        {error && <Text className="text-error text-xs mt-1">{error}</Text>}
        {helperText && !error && (
          <Text className="text-text-muted text-xs mt-1">{helperText}</Text>
        )}
      </View>
    );
  }
);

TextInput.displayName = "TextInput";
