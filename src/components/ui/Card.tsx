import { Pressable, PressableProps, View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "elevated";
}

interface PressableCardProps extends PressableProps {
  children: React.ReactNode;
  variant?: "default" | "elevated";
}

export function Card({
  children,
  className,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <View
      className={`
        bg-surface rounded-[12px] p-4
        ${variant === "elevated" ? "border border-border" : ""}
        ${className || ""}
      `}
      {...props}
    >
      {children}
    </View>
  );
}

export function PressableCard({
  children,
  variant = "default",
  onPress,
  ...props
}: PressableCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`
        bg-surface rounded-[12px] p-4
        ${variant === "elevated" ? "border border-border" : ""}
        active:opacity-80
      `}
      accessibilityRole="button"
      {...props}
    >
      {children}
    </Pressable>
  );
}
