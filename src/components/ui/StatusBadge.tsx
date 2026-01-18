import { theme } from "@/lib/theme";
import { Check, Clock, X } from "lucide-react-native";
import { Text, View } from "react-native";

export type ServiceStatus = "on-time" | "delayed" | "cancelled" | "early";

interface StatusBadgeProps {
  status: ServiceStatus | string;
  size?: "sm" | "md";
  showIcon?: boolean;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; icon?: "check" | "clock" | "x" }
> = {
  "on-time": {
    label: "On Time",
    bg: `${theme.success}20`,
    text: theme.success,
    icon: "check",
  },
  "on time": {
    label: "On Time",
    bg: `${theme.success}20`,
    text: theme.success,
    icon: "check",
  },
  early: {
    label: "Early",
    bg: `${theme.success}20`,
    text: theme.success,
    icon: "check",
  },
  delayed: {
    label: "Delayed",
    bg: `${theme.warning}20`,
    text: theme.warning,
    icon: "clock",
  },
  late: {
    label: "Delayed",
    bg: `${theme.warning}20`,
    text: theme.warning,
    icon: "clock",
  },
  cancelled: {
    label: "Cancelled",
    bg: `${theme.error}20`,
    text: theme.error,
    icon: "x",
  },
};

const iconComponents = {
  check: Check,
  clock: Clock,
  x: X,
};

export function StatusBadge({
  status,
  size = "sm",
  showIcon = true,
}: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().trim();
  const config = statusConfig[normalizedStatus] || statusConfig["on-time"];
  const IconComponent = config.icon ? iconComponents[config.icon] : null;

  const sizeConfig = {
    sm: { padding: "px-2.5 py-1", text: "text-[11px]", iconSize: 10 },
    md: { padding: "px-3 py-1.5", text: "text-xs", iconSize: 12 },
  };

  const { padding, text: textSize, iconSize } = sizeConfig[size];

  return (
    <View
      className={`rounded-full flex-row items-center gap-1 ${padding}`}
      style={{ backgroundColor: config.bg }}
      accessibilityLabel={`Status: ${config.label}`}
    >
      {showIcon && IconComponent && (
        <IconComponent size={iconSize} color={config.text} strokeWidth={3} />
      )}
      <Text
        className={`font-bold tracking-wide uppercase ${textSize}`}
        style={{ color: config.text }}
      >
        {config.label}
      </Text>
    </View>
  );
}
