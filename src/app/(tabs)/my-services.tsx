import { ScreenLayout } from "@/components/layout";
import { colors } from "@/lib/theme";
import { Star } from "lucide-react-native";
import { Text, View } from "react-native";

export default function MyServicesScreen() {
  return (
    <ScreenLayout title="My Services">
      <View className="flex-1 items-center justify-center gap-4">
        <Star size={48} color={colors.gray[500]} />
        <Text className="text-gray-300 text-center">
          Your favourite services will appear here.
        </Text>
      </View>
    </ScreenLayout>
  );
}
