import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useContext } from "react";

import { ThemeContext } from "@/context/ThemeContext";

export default function UploadModal() {
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext); // styles
  const styles = createStyles(theme, colorScheme);

  return (
    <View style={styles.container}>
      <Button title="hello" />
      <Button title="goodbye" />
    </View>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-evenly",
      width: "100%",
      backgroundColor: theme.background,
    },
  });
}
