import { theme } from "@/lib/theme";
import { useEffect, useRef } from "react";
import { Animated, DimensionValue, View } from "react-native";

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  className,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      className={className}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: theme.surface.hover,
        opacity,
      }}
    />
  );
}

// Preset skeleton components for common use cases
export function SkeletonText({
  lines = 1,
  lastLineWidth = "60%",
}: {
  lines?: number;
  lastLineWidth?: DimensionValue;
}) {
  return (
    <View className="gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          width={i === lines - 1 && lines > 1 ? lastLineWidth : "100%"}
        />
      ))}
    </View>
  );
}

export function SkeletonCard() {
  return (
    <View className="bg-surface rounded-[12px] p-4 gap-3">
      <View className="flex-row justify-between items-center">
        <Skeleton width={80} height={16} />
        <Skeleton width={60} height={24} borderRadius={6} />
      </View>
      <Skeleton width="70%" height={14} />
      <View className="flex-row gap-4 mt-1">
        <Skeleton width={100} height={12} />
        <Skeleton width={80} height={12} />
      </View>
    </View>
  );
}
