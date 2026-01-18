/**
 * GradientBackground - Premium animated gradient background
 * Creates a beautiful, subtle animated gradient effect
 */

import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface GradientBackgroundProps {
  children: ReactNode;
}

export function GradientBackground({ children }: GradientBackgroundProps) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={["#0a0f1a", "#0d1525", "#0a0f1a"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Subtle radial glow effect at top */}
      <LinearGradient
        colors={["rgba(66, 153, 225, 0.08)", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.8 }]}
      />
      {children}
    </View>
  );
}

/**
 * Decorative orbs for visual interest
 */
export function BackgroundOrbs() {
  return (
    <>
      {/* Top right orb */}
      <View
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: "rgba(66, 153, 225, 0.05)",
        }}
      />
      {/* Bottom left orb */}
      <View
        style={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: "rgba(159, 122, 234, 0.04)",
        }}
      />
    </>
  );
}
