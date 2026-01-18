import { theme } from "@/lib/theme";
import { Stack } from "expo-router";

export default function ServicesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.surface.DEFAULT,
        },
        headerTintColor: theme.text.DEFAULT,
        headerTitleStyle: {
          fontWeight: "600",
        },
        contentStyle: {
          backgroundColor: theme.background.DEFAULT,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Services",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Service Details",
          headerBackTitle: "Services",
        }}
      />
    </Stack>
  );
}
