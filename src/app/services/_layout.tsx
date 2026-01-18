import { theme } from "@/lib/theme";
import { Stack, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, Text } from "react-native";

function BackButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      className="flex-row items-center -ml-2"
    >
      <ChevronLeft size={24} color={theme.primary.DEFAULT} />
      <Text className="text-primary text-base">Back</Text>
    </Pressable>
  );
}

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
        headerLeft: () => <BackButton />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Services",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Service Details",
        }}
      />
    </Stack>
  );
}
