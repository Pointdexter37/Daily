import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "../providers/AppProvider";
import { AuthProvider } from "../providers/AuthProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#081120" }
          }}
        />
      </AppProvider>
    </AuthProvider>
  );
}
