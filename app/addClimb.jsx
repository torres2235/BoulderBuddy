import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { data } from "@/data/ClimbItems";
import { ThemeContext } from "@/context/ThemeContext";

export default function AddClimb() {
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext); // styles
  const styles = createStyles(theme, colorScheme);

  const { id } = useLocalSearchParams();
  const [climbs, setClimbs] = useState([]);
  const router = useRouter();
  const [text, setText] = useState("");

  useEffect(() => {
    // load our data (user or default)
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("ClimbApp");
        const storageClimbs = jsonValue !== null ? JSON.parse(jsonValue) : null;

        if (storageClimbs && storageClimbs.length) {
          setClimbs(storageClimbs.sort((a, b) => b.id - a.id)); // use user data
        } else {
          setClimbs(data.sort((a, b) => b.id - a.id)); // use default data
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [data]);

  useEffect(() => {
    // watches for changes in the climbs state
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(climbs);
        await AsyncStorage.setItem("ClimbApp", jsonValue);
      } catch (e) {
        console.error(e);
      }
    };

    storeData();
  }, [climbs]);

  const addClimb = () => {
    // Create
    if (text.trim()) {
      const newId = climbs.length > 0 ? climbs[0].id + 1 : 1;
      setClimbs([{ id: newId, title: text, completed: false }, ...climbs]);
      setText("");
    }

    router.push(`/`);
  };

  //   const handleSave = async () => {
  //     try {
  //       const savedClimb = { ...climb, title: climb.title };
  //       const jsonValue = await AsyncStorage.getItem("ClimbApp");
  //       const storageClimbs = jsonValue != null ? JSON.parse(jsonValue) : null;

  //       if (storageClimbs && storageClimbs.length) {
  //         const otherClimbs = storageClimbs.filter(
  //           (climb) => climb.id !== savedClimb.id
  //         ); // get all other climbs items
  //         const allClimbs = [...otherClimbs, savedClimb]; // pass in a new version of our editted climb and all other climbs
  //         await AsyncStorage.setItem("ClimbApp", JSON.stringify(allClimbs));
  //       } else {
  //         await AsyncStorage.setItem("ClimbApp", JSON.stringify([savedClimb])); // if we had an empty Climb list, create a new one
  //       }

  //       router.push("/"); // head back to our index page
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };

  return (
    <SafeAreaView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add Title"
          placeholderTextColor="grey"
          value={text}
          onChangeText={setText}
        />
      </View>
      <View style={styles.inputContainer}>
        <Pressable onPress={addClimb} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/")}
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
