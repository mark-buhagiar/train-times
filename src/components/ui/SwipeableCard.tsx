/**
 * SwipeableCard - A card that can be swiped to delete on mobile
 * or shows a delete button on hover for web
 */

import { theme } from "@/lib/theme";
import { haptics } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { Trash2 } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Animated,
  PanResponder,
  Platform,
  Pressable,
  View,
} from "react-native";
import { PressableGlassCard } from "./GlassCard";

const SWIPE_THRESHOLD = 80;

interface SwipeableCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  onDelete: () => void;
  /** Alert title for long-press confirmation */
  deleteAlertTitle?: string;
  /** Alert message for long-press confirmation */
  deleteAlertMessage?: string;
  /** Intensity of the glass effect */
  intensity?: "light" | "medium" | "strong";
}

export function SwipeableCard({
  children,
  onPress,
  onDelete,
  deleteAlertTitle = "Delete",
  deleteAlertMessage = "Are you sure you want to delete this item?",
  intensity = "medium",
}: SwipeableCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isSwiping, setIsSwiping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isWeb = Platform.OS === "web";

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes on native
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
        // Only allow left swipe (negative dx)
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -SWIPE_THRESHOLD - 20));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsSwiping(false);
        if (gestureState.dx < -SWIPE_THRESHOLD) {
          // Trigger delete
          Animated.timing(translateX, {
            toValue: -400,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onDelete();
          });
        } else {
          // Snap back
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 8,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        setIsSwiping(false);
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const handleLongPress = useCallback(() => {
    haptics.impact("medium");
    Alert.alert(deleteAlertTitle, deleteAlertMessage, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  }, [deleteAlertTitle, deleteAlertMessage, onDelete]);

  const handleDeletePress = useCallback(() => {
    haptics.impact("medium");
    onDelete();
  }, [onDelete]);

  // Web version with hover delete button
  if (isWeb) {
    return (
      <View
        className="relative mb-3"
        // @ts-ignore - web only
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <PressableGlassCard onPress={onPress} intensity={intensity}>
          {children}
        </PressableGlassCard>

        {/* Delete button - positioned absolutely on the right */}
        <Pressable
          onPress={handleDeletePress}
          className="absolute right-3 top-1/2 w-9 h-9 rounded-full items-center justify-center"
          style={{
            backgroundColor: `${theme.error}20`,
            opacity: isHovered ? 1 : 0,
            transform: [{ translateY: -18 }],
          }}
        >
          <Trash2 size={16} color={theme.error} />
        </Pressable>
      </View>
    );
  }

  // Native version with swipe-to-delete
  return (
    <View className="relative overflow-hidden rounded-3xl mb-3">
      {/* Delete background */}
      <View className="absolute inset-0 rounded-3xl overflow-hidden">
        <LinearGradient
          colors={["#c53030", theme.error]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          className="flex-1 items-end justify-center pr-6"
        >
          <Trash2 size={24} color="#fff" />
        </LinearGradient>
      </View>

      {/* Card content */}
      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
      >
        <PressableGlassCard
          onPress={onPress}
          onLongPress={handleLongPress}
          intensity={intensity}
          disabled={isSwiping}
        >
          {children}
        </PressableGlassCard>
      </Animated.View>
    </View>
  );
}
