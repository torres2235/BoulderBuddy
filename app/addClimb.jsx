import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { data } from "@/data/ClimbItems";
import { ThemeContext } from "@/context/ThemeContext";

export default function AddClimb() {
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext); // styles
  const styles = createStyles(theme, colorScheme);
  //const [checkboxState, setCheckboxState] = useState();

  //const { id } = useLocalSearchParams();
  const [climbs, setClimbs] = useState([]);
  const router = useRouter();
  const [attributes, setAttribute] = useState({
    id: null,
    title: "",
    grade: "",
    color: "",
    date: "",
    rating: null,
    completed: false,
    tags: [],
  });

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
    const newId = climbs.length > 0 ? climbs[0].id + 1 : 1;
    attributes.id = newId;
    setClimbs([attributes, ...climbs]);
    setAttribute({
      id: null,
      title: "",
      grade: "",
      color: "",
      date: "",
      rating: 0,
      completed: false,
      tags: [],
    });

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
          //value={text}
          onChangeText={(value) =>
            setAttribute({ ...attributes, title: value })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Add Grade"
          placeholderTextColor="grey"
          onChangeText={(value) =>
            setAttribute({ ...attributes, grade: value })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Add Date"
          placeholderTextColor="grey"
          onChangeText={(value) => setAttribute({ ...attributes, date: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Add Hold Color"
          placeholderTextColor="grey"
          onChangeText={(value) =>
            setAttribute({ ...attributes, color: value })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Add Rating"
          placeholderTextColor="grey"
          onChangeText={(value) =>
            setAttribute({ ...attributes, rating: value })
          }
        />
        <BouncyCheckbox
          disableText
          fillColor="#9342f5"
          size={50}
          iconImageStyle={styles.iconImageStyle}
          iconStyle={{ borderColor: "#9342f5" }}
          text="Completed"
          //   onPress={(boolean) => {
          //     setClimb((prev) => ({ ...prev, completed: boolean }));
          //   }}
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
