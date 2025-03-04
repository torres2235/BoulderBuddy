import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="climbs/view[id]" />
          <Stack.Screen name="climbs/edit[id]" />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
