import { FavouriteStationsPicker } from "@/components/features";
import { ScreenLayout } from "@/components/layout";
import { Card } from "@/components/ui";
import { theme } from "@/lib/theme";
import Constants from "expo-constants";
import { Info, Smartphone } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

export default function SettingsScreen() {
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  const buildNumber = Constants.expoConfig?.ios?.buildNumber ?? "1";

  return (
    <ScreenLayout title="Settings">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Favourite Stations Section */}
        <View className="mb-6">
          <FavouriteStationsPicker />
        </View>

        {/* App Info Section */}
        <Card variant="default">
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 rounded-xl bg-primary/20 items-center justify-center mr-3">
              <Info size={16} color={theme.primary.DEFAULT} />
            </View>
            <Text className="text-text text-base font-semibold">About</Text>
          </View>

          {/* App Name & Icon */}
          <View className="items-center py-4 border-b border-border mb-4">
            <View className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 items-center justify-center mb-3">
              <Smartphone size={28} color={theme.primary.DEFAULT} />
            </View>
            <Text className="text-text text-lg font-semibold">Train Times</Text>
            <Text className="text-text-muted text-sm mt-1">
              UK Train Departures
            </Text>
          </View>

          {/* Version Info */}
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-text-secondary">Version</Text>
            <Text className="text-text font-medium">{appVersion}</Text>
          </View>

          <View className="flex-row justify-between items-center py-2">
            <Text className="text-text-secondary">Build</Text>
            <Text className="text-text font-medium">{buildNumber}</Text>
          </View>

          {/* Credits */}
          <View className="mt-4 pt-4 border-t border-border">
            <Text className="text-text-muted text-xs text-center">
              Powered by National Rail Enquiries
            </Text>
            <Text className="text-text-muted text-xs text-center mt-1">
              © {new Date().getFullYear()} Train Times
            </Text>
          </View>
        </Card>
      </ScrollView>
    </ScreenLayout>
  );
}
