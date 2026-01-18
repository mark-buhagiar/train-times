import { ScreenLayout } from "@/components/layout";
import { SkeletonCard, SkeletonText } from "@/components/ui";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenLayout title="Service Details">
      <View className="gap-4">
        {/* Placeholder - will be implemented in Phase 7 */}
        <View className="bg-surface rounded-card p-4">
          <Text className="text-text-secondary text-sm mb-2">Service ID</Text>
          <Text className="text-text text-lg font-semibold">{id}</Text>
        </View>

        <View className="bg-surface rounded-card p-4 gap-3">
          <SkeletonText lines={1} />
          <SkeletonText lines={3} />
        </View>

        <SkeletonCard />
        <SkeletonCard />
      </View>
    </ScreenLayout>
  );
}
