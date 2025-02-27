import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, PRessable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditScreen() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView>
      <Text>[id]</Text>
    </SafeAreaView>
  );
}
