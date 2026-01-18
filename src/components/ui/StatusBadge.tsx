import { colors } from "@/lib/theme";
import { Text, View } from "react-native";

export type ServiceStatus = "on-time" | "delayed" | "cancelled" | "early";

interface StatusBadgeProps {
  status: ServiceStatus | string;
  size?: "sm" | "md";
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  "on-time": {
    label: "On Time",
    bg: "rgba(34, 197, 94, 0.2)",
    text: colors.success,
  },
  "on time": {
    label: "On Time",
    bg: "rgba(34, 197, 94, 0.2)",
    text: colors.success,
  },
  early: {
    label: "Early",
    bg: "rgba(34, 197, 94, 0.2)",
    text: colors.success,
  },
  delayed: {
    label: "Delayed",
    bg: "rgba(245, 158, 11, 0.2)",
    text: colors.warning,
  },
  late: {
    label: "Delayed",
    bg: "rgba(245, 158, 11, 0.2)",
    text: colors.warning,
  },
  cancelled: {
    label: "Cancelled",
    bg: "rgba(239, 68, 68, 0.2)",
    text: colors.error,
  },
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().trim();
  const config = statusConfig[normalizedStatus] || statusConfig["on-time"];

  const sizeClasses = {
    sm: "px-2 py-1",
    md: "px-3 py-1.5",
  };

  const textSizeClasses = {
    sm: "text-[11px]",
    md: "text-xs",
  };

  return (
    <View
      className={`rounded-[6px] ${sizeClasses[size]}`}
      style={{ backgroundColor: config.bg }}
      accessibilityLabel={`Status: ${config.label}`}
    >
      <Text
        className={`font-semibold ${textSizeClasses[size]}`}
        style={{ color: config.text }}
      >
        {config.label}
      </Text>
    </View>
  );
}
