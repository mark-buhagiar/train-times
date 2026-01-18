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
      <View
        className="w-64 pt-6"
        style={{
          backgroundColor: "rgba(255,255,255,0.02)",
          borderRightWidth: 1,
          borderRightColor: "rgba(255,255,255,0.05)",
        }}
      >
        {/* App Title */}
        <View className="px-6 mb-8">
          <Text className="text-primary text-sm font-semibold tracking-widest uppercase mb-1">
            UK Trains
          </Text>
          <Text className="text-text text-2xl font-bold">Train Times</Text>
        </View>

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
                className={`flex-row items-center gap-3 px-4 py-3 rounded-xl ${
                  isActive ? "" : "hover:bg-white/5"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: `${theme.primary.DEFAULT}20`,
                        borderWidth: 1,
                        borderColor: `${theme.primary.DEFAULT}30`,
                      }
                    : {}
                }
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
          backgroundColor: "rgba(10, 15, 26, 0.95)",
          borderTopColor: "rgba(255,255,255,0.05)",
          borderTopWidth: 1,
          height: 88,
          paddingBottom: 24,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
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
