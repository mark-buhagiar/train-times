import { ScreenLayout } from "@/components/layout";
import {
  EmptyState,
  GlassCard,
  SlideIn,
  SwipeableCard,
  TimeBadge,
} from "@/components/ui";
import { theme } from "@/lib/theme";
import { haptics } from "@/lib/utils";
import { FavouriteService, useFavouritesStore } from "@/stores";
import { router } from "expo-router";
import { ArrowRight, Heart, MapPin, Star } from "lucide-react-native";
import { useCallback } from "react";
import { Platform, ScrollView, Text, View } from "react-native";

interface FavouriteCardContentProps {
  service: FavouriteService;
}

function FavouriteCardContent({ service }: FavouriteCardContentProps) {
  return (
    <View className="flex-row items-center">
      {/* Time badge */}
      <View className="mr-4">
        <TimeBadge
          time={service.scheduledDeparture}
          statusColor={theme.primary.DEFAULT}
          showIcon
        />
      </View>

      {/* Route info */}
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <MapPin size={14} color={theme.primary.DEFAULT} />
          <Text
            className="text-text text-base font-semibold flex-1"
            numberOfLines={1}
          >
            {service.fromStation.name}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <ArrowRight size={14} color={theme.text.muted} />
          <Text
            className="text-text-secondary text-sm flex-1"
            numberOfLines={1}
          >
            {service.toStation.name}
          </Text>
        </View>
        <Text className="text-text-muted text-xs mt-1">
          {service.fromStation.crs} → {service.toStation.crs}
        </Text>
      </View>
    </View>
  );
}

export default function MyServicesScreen() {
  const { services, removeService } = useFavouritesStore();

  const handleServicePress = useCallback((service: FavouriteService) => {
    haptics.impact("light");
    // Extract service ID from template URL and navigate
    const serviceId = service.templateUrl.replace("service:", "");
    router.push({
      pathname: "/services/[id]",
      params: {
        id: serviceId,
        from: service.fromStation.crs,
        to: service.toStation.crs,
      },
    });
  }, []);

  const handleDeleteService = useCallback(
    (id: string) => {
      haptics.impact("medium");
      removeService(id);
    },
    [removeService]
  );

  return (
    <ScreenLayout
      title="My Services"
      subtitle="Saved"
      icon={Heart}
      iconBgClass="bg-primary/20"
      iconColor={theme.primary.DEFAULT}
      iconFilled
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
      >
        {services.length > 0 ? (
          <SlideIn direction="bottom" delay={100}>
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-text-muted text-sm font-semibold tracking-wide uppercase">
                  {services.length} Favourite
                  {services.length !== 1 ? "s" : ""}
                </Text>
                <Text className="text-text-muted text-xs">
                  {Platform.OS === "web"
                    ? "Hover to delete"
                    : "Swipe left to delete"}
                </Text>
              </View>

              {services.map((service) => (
                <View key={service.id} className="mb-3">
                  <SwipeableCard
                    onPress={() => handleServicePress(service)}
                    onDelete={() => handleDeleteService(service.id)}
                    deleteAlertTitle="Remove Favourite"
                    deleteAlertMessage={`Remove ${service.fromStation.name} → ${service.toStation.name}?`}
                  >
                    <FavouriteCardContent service={service} />
                  </SwipeableCard>
                </View>
              ))}
            </View>
          </SlideIn>
        ) : (
          <SlideIn direction="bottom" delay={100}>
            <GlassCard intensity="medium" className="mt-8">
              <EmptyState
                variant="no-favourites"
                title="No saved services"
                description="Tap the heart icon on any service to save it here for quick access"
                actionText="Find Trains"
                onAction={() => router.push("/")}
              />
            </GlassCard>
          </SlideIn>
        )}

        {/* Tip card */}
        {services.length > 0 && (
          <SlideIn direction="bottom" delay={200}>
            <GlassCard intensity="light" className="mt-6 mb-8">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-primary/20 items-center justify-center">
                  <Star size={18} color={theme.primary.DEFAULT} />
                </View>
                <View className="flex-1">
                  <Text className="text-text text-sm font-medium">Pro tip</Text>
                  <Text className="text-text-muted text-xs mt-0.5">
                    {Platform.OS === "web"
                      ? "Click the trash icon to remove a favourite"
                      : "Long press a service for more options"}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </SlideIn>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}
