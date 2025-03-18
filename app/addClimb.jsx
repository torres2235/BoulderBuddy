import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import SelectDropdown from "react-native-select-dropdown";

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

  const grades = [
    "v0",
    "v1",
    "v2",
    "v3",
    "v4",
    "v5",
    "v6",
    "v7",
    "v8",
    "v9",
    "v10",
    "v11",
    "v12",
  ];

  const color = [
    "Red",
    "Orange",
    "Yellow",
    "Green",
    "Blue",
    "Purple",
    "Pink",
    "Black",
  ];

  const rating = [0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

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
          placeholder="Add Title"
          placeholderTextColor="grey"
          onChangeText={(value) =>
            setAttribute({ ...attributes, title: value })
          }
        />
        <SelectDropdown
          data={grades}
          onSelect={(selectedItem) =>
            setClimb((prev) => ({ ...prev, grade: selectedItem }))
          }
          // defaultValueByIndex={8} // use default value by index or default value
          // defaultValue={'kiss'} // use default value by index or default value
          renderButton={(selectedItem, isOpen) => {
            return (
              <View style={styles.input}>
                <Text style={styles.text}>
                  {selectedItem || "Select the Grade"}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: "#D2D9DF" }),
                }}
              >
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            );
          }}
          dropdownStyle={styles.dropdownMenuStyle}
        />
        <TextInput
          style={styles.input}
          placeholder="Add Date"
          placeholderTextColor="grey"
          onChangeText={(value) => setAttribute({ ...attributes, date: value })}
        />
        <SelectDropdown
          data={color}
          onSelect={(selectedItem) =>
            setClimb((prev) => ({ ...prev, color: selectedItem }))
          }
          renderButton={(selectedItem, isOpen) => {
            return (
              <View style={styles.input}>
                <Text style={styles.text}>
                  {selectedItem || "Select the hold color"}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: "#D2D9DF" }),
                }}
              >
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            );
          }}
          dropdownStyle={styles.dropdownMenuStyle}
        />
        <SelectDropdown
          data={rating}
          onSelect={(selectedItem) =>
            setClimb((prev) => ({ ...prev, rating: selectedItem }))
          }
          // defaultValueByIndex={8} // use default value by index or default value
          // defaultValue={'kiss'} // use default value by index or default value
          renderButton={(selectedItem, isOpen) => {
            return (
              <View style={styles.input}>
                <Text style={styles.text}>{selectedItem || "Rating"}</Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: "#D2D9DF" }),
                }}
              >
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            );
          }}
          dropdownStyle={styles.dropdownMenuStyle}
        />
        <BouncyCheckbox
          fillColor="#9342f5"
          size={50}
          iconImageStyle={styles.iconImageStyle}
          iconStyle={{ borderColor: "#9342f5" }}
          //textStyle={{ color: "#010101", fontWeight: "600" }}
          text="Completed?"
          onPress={(boolean) => {
            setAttribute({ ...attributes, completed: boolean });
          }}
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
      //flex: 1,
      borderColor: "grey",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginHorizontal: "auto",
      fontSize: 16,
      minWidth: "60%",
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
    text: {
      color: theme.text,
    },
  });
}
