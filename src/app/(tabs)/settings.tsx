import { ScreenLayout } from "@/components/layout";
import { Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <ScreenLayout title="Settings">
      <View className="gap-4">
        <Text className="text-gray-100">Configure your preferences here.</Text>
      </View>
    </ScreenLayout>
  );
}
