import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useState, useEffect, useContext } from "react";
//import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Octicons from "@expo/vector-icons/Octicons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
//import RNBounceable from "@freakycoder/react-native-bounceable";

import { ThemeContext } from "@/context/ThemeContext";

export default function EditClimbScreen() {
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext); // styles
  const styles = createStyles(theme, colorScheme);
  const { id } = useLocalSearchParams();
  const [climb, setClimb] = useState({}); // climb state
  //const [checkboxState, setCheckboxState] = useState();
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

  const removeClimb = async () => {
    // delete
    try {
      const currClimb = { ...climb };
      const jsonValue = await AsyncStorage.getItem("ClimbApp");
      const storageClimbs = jsonValue !== null ? JSON.parse(jsonValue) : null;

      if (storageClimbs && storageClimbs.length) {
        const otherClimbs = storageClimbs.filter(
          (climb) => climb.id !== currClimb.id
        );
        await AsyncStorage.setItem("ClimbApp", JSON.stringify(otherClimbs));
      } else {
        await AsyncStorage.setItem("ClimbApp", JSON.stringify([savedClimb]));
      }

      router.push("/");
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
        <TextInput
          style={styles.input}
          placeholder="Edit Grade"
          placeholderTextColor="grey"
          value={climb?.grade || ""}
          onChangeText={(text) =>
            setClimb((prev) => ({ ...prev, grade: text }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Edit Date"
          placeholderTextColor="grey"
          value={climb?.date || ""}
          onChangeText={(text) => setClimb((prev) => ({ ...prev, date: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Edit Hold Color"
          placeholderTextColor="grey"
          value={climb?.color || ""}
          onChangeText={(text) =>
            setClimb((prev) => ({ ...prev, color: text }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Edit Rating"
          placeholderTextColor="grey"
          value={climb?.rating || ""}
          onChangeText={(text) =>
            setClimb((prev) => ({ ...prev, rating: text }))
          }
        />
        <BouncyCheckbox
          //ref={bouncyCheckboxRef}
          disableText
          fillColor="#9342f5"
          size={50}
          iconImageStyle={styles.iconImageStyle}
          iconStyle={{ borderColor: "#9342f5" }}
          text="Completed"
          isChecked={climb.completed}
          onPress={(boolean) => {
            setClimb((prev) => ({ ...prev, completed: boolean }));
          }}
        />
      </View>
      <View style={[styles.inputContainer, { flexDirection: "row" }]}>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push(`/climbs/${id}`)}
          style={[styles.saveButton, { backgroundColor: "green" }]}
        >
          <Text style={[styles.saveButtonText, { color: "white" }]}>
            Cancel
          </Text>
        </Pressable>
        <Pressable
          onPress={removeClimb}
          style={[styles.saveButton, { backgroundColor: "red" }]}
        >
          <Text style={[styles.saveButtonText, { color: "white" }]}>
            Delete
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
      flexDirection: "column",
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
      marginHorizontal: "auto",
      fontSize: 18,
      minWidth: "100%",
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
