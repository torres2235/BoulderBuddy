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

  const handleSave = async () => {
    try {
      const savedClimb = { ...climb, title: climb.title };
      const jsonValue = await AsyncStorage.getItem("ClimbApp");
      const storageClimbs = jsonValue !== null ? JSON.parse(jsonValue) : null;

      if (storageClimbs && storageClimbs.length) {
        const otherClimbs = storageClimbs.filter(
          (climb) => climb.id !== savedClimb.id
        );
        const allClimbs = [...otherClimbs, savedClimb];
        await AsyncStorage.setItem("ClimbApp", JSON.stringify(allClimbs));
      } else {
        await AsyncStorage.setItem("ClimbApp", JSON.stringify([savedClimb]));
      }

      router.push(`/climbs/${id}`);
    } catch (e) {
      console.error(e);
    }
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Edit Title"
          placeholderTextColor="grey"
          value={climb?.title || ""}
          onChangeText={(text) =>
            setClimb((prev) => ({ ...prev, title: text }))
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push(`/climbs/${id}`)}
          style={[styles.saveButton, { backgroundColor: "red" }]}
        >
          <Text style={[styles.saveButtonText, { color: "white" }]}>
            Cancel
          </Text>
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
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      gap: 6,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    input: {
      flex: 1,
      borderColor: "grey",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      minWidth: 0,
      color: theme.text,
    },
    saveButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    saveButtonText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "black" : "white",
    },
  });
}
