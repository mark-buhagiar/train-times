import { Platform } from "react-native";

/**
 * Platform-aware haptic feedback utility.
 * Provides haptic feedback on iOS/Android, no-op on web.
 */

type ImpactStyle = "light" | "medium" | "heavy";

export const haptics = {
  /**
   * Trigger impact feedback
   */
  impact: async (style: ImpactStyle = "light") => {
    if (Platform.OS === "web") {
      return; // No haptics on web
    }

    try {
      const Haptics = require("expo-haptics");
      const styleMap = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
      };
      await Haptics.impactAsync(styleMap[style]);
    } catch {
      // Haptics not available
    }
  },

  /**
   * Trigger selection feedback (light tap)
   */
  selection: async () => {
    if (Platform.OS === "web") {
      return;
    }

    try {
      const Haptics = require("expo-haptics");
      await Haptics.selectionAsync();
    } catch {
      // Haptics not available
    }
  },

  /**
   * Trigger notification feedback
   */
  notification: async (type: "success" | "warning" | "error" = "success") => {
    if (Platform.OS === "web") {
      return;
    }

    try {
      const Haptics = require("expo-haptics");
      const typeMap = {
        success: Haptics.NotificationFeedbackType.Success,
        warning: Haptics.NotificationFeedbackType.Warning,
        error: Haptics.NotificationFeedbackType.Error,
      };
      await Haptics.notificationAsync(typeMap[type]);
    } catch {
      // Haptics not available
    }
  },
};
