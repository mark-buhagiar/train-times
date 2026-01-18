import { theme } from "@/lib/theme";
import { Stack, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, Text } from "react-native";

function BackButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      className="flex-row items-center -ml-1 py-2 pr-4"
    >
      <ChevronLeft size={22} color={theme.primary.DEFAULT} />
      <Text className="text-primary text-base font-medium">Back</Text>
    </Pressable>
  );
}

export default function ServicesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.background.DEFAULT,
        },
        headerTintColor: theme.text.DEFAULT,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
        },
        headerShadowVisible: false,
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
