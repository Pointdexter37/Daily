import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const tabIcon = {
  today: "checkbox-outline",
  tomorrow: "sparkles-outline",
  history: "time-outline",
  settings: "settings-outline"
} as const;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#f8fafc",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: "#0b1220",
          borderTopColor: "#1f2a44",
          height: 68,
          paddingBottom: 10,
          paddingTop: 8
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600"
        }
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: "Today",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={tabIcon.today} size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="tomorrow"
        options={{
          title: "Tomorrow",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={tabIcon.tomorrow} size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={tabIcon.history} size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={tabIcon.settings} size={size} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
