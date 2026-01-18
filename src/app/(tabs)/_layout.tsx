import { theme } from "@/lib/theme/colors";
import { router, Tabs, usePathname } from "expo-router";
import { Home, Settings, Star } from "lucide-react-native";
import {
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const NAV_ITEMS = [
  { name: "index", title: "Home", icon: Home, href: "/" },
  {
    name: "my-services",
    title: "My Services",
    icon: Star,
    href: "/my-services",
  },
  { name: "settings", title: "Settings", icon: Settings, href: "/settings" },
];

function WebSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <View className="flex-1 flex-row bg-background">
      {/* Sidebar */}
      <View className="w-64 bg-surface border-r border-border pt-6">
        {/* App Title */}
        <Text className="text-text text-xl font-bold px-6 mb-8">
          Train Times
        </Text>

        {/* Navigation Items */}
        <View className="gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/" && pathname === "/index");
            const Icon = item.icon;

            return (
              <Pressable
                key={item.name}
                onPress={() => router.push(item.href as any)}
                className={`flex-row items-center gap-3 px-3 py-3 rounded-lg ${
                  isActive ? "bg-primary-muted" : "hover:bg-surface-hover"
                }`}
              >
                <Icon
                  color={isActive ? theme.primary.DEFAULT : theme.text.muted}
                  size={22}
                />
                <Text
                  className={`text-base ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-text-secondary"
                  }`}
                >
                  {item.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1">{children}</View>
    </View>
  );
}

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isWideScreen = width >= 768;

  // Use sidebar layout for web on wider screens
  if (isWeb && isWideScreen) {
    return (
      <WebSidebar>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
          }}
        >
          <Tabs.Screen name="index" options={{ title: "Home" }} />
          <Tabs.Screen name="my-services" options={{ title: "My Services" }} />
          <Tabs.Screen name="settings" options={{ title: "Settings" }} />
        </Tabs>
      </WebSidebar>
    );
  }

  // Default mobile bottom tabs
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary.DEFAULT,
        tabBarInactiveTintColor: theme.text.muted,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface.DEFAULT,
          borderTopColor: theme.border.DEFAULT,
          height: 83,
          paddingBottom: 20,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="my-services"
        options={{
          title: "My Services",
          tabBarIcon: ({ color, size }) => <Star color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
