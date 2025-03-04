import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Octicons from "@expo/vector-icons/Octicons";

import { ThemeContext } from "@/context/ThemeContext";

export default function ViewClimbScreen() {
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext); // styles
  const styles = createStyles(theme, colorScheme);
  const { id } = useLocalSearchParams();
  const [climb, setClimb] = useState({}); // climb state
  const router = useRouter();

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const jsonValue = await AsyncStorage.getItem("ClimbApp");
        const storageClimbs = jsonValue !== null ? JSON.parse(jsonValue) : null;

        if (storageClimbs && storageClimbs.length) {
          const myClimb = storageClimbs.find(
            (climb) => climb.id.toString() === id // find the specific climb with the id we are looking at
          );
          setClimb(myClimb);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData(id);
  }, [id]);

  const handlePress = (id) => {
    router.push(`/edit/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() =>
          setColorScheme(colorScheme === "light" ? "dark" : "light")
        }
        style={{ marginLeft: 10 }}
      >
        {colorScheme === "dark" ? (
          <Octicons
            name="moon"
            size={36}
            color={theme.text}
            selectable={undefined}
            style={{ width: 36 }}
          />
        ) : (
          <Octicons
            name="sun"
            size={36}
            color={theme.text}
            selectable={undefined}
            style={{ width: 36 }}
          />
        )}
      </Pressable>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{climb.title}</Text>
        <Text style={styles.text}>{climb.grade}</Text>
        <Text style={styles.text}>{climb.date}</Text>
        <Text style={styles.text}>{climb.color}</Text>
        <Text style={styles.text}>{climb.rating}</Text>
        <Text style={styles.text}>{climb.completed}</Text>
        <Text style={styles.text}>{climb.tags}</Text>
      </View>
      <View style={styles.textContainer}>
        <Pressable onPress={() => handlePress(climb.id)} style={styles.Button}>
          <Text style={styles.ButtonText}>Edit</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/")}
          style={[styles.Button, { backgroundColor: "red" }]}
        >
          <Text style={[styles.ButtonText, { color: "white" }]}>Return</Text>
        </Pressable>
      </View>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: theme.background,
    },
    textContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      gap: 6,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    text: {
      color: theme.text,
    },
    Button: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    ButtonText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "black" : "white",
    },
  });
}
