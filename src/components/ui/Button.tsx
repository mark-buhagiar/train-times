import { colors } from "@/lib/theme";
import { haptics } from "@/lib/utils/haptics";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from "react-native";

interface ButtonProps extends Omit<PressableProps, "children"> {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = true,
  ...props
}: ButtonProps) {
  const isPrimary = variant === "primary";

  const handlePress = () => {
    haptics.impact("light");
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={title}
      className={`
        h-[50px] rounded-[10px] justify-center items-center px-4
        ${fullWidth ? "w-full" : ""}
        ${isPrimary ? "bg-blue" : "border border-gray-500 bg-transparent"}
        ${disabled || loading ? "opacity-50" : "active:opacity-80"}
      `}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? colors.white : colors.gray[100]}
          size="small"
        />
      ) : (
        <Text
          className={`
            text-base font-semibold
            ${isPrimary ? "text-white" : "text-gray-100"}
          `}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
