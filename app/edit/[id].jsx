import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Button,
} from "react-native";
import { useState, useEffect, useContext } from "react";
//import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Octicons from "@expo/vector-icons/Octicons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import SelectDropdown from "react-native-select-dropdown";

import DateTimePicker from "@react-native-community/datetimepicker";

import { ThemeContext } from "@/context/ThemeContext";

export default function EditClimbScreen() {
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext); // styles
  const [text, setText] = useState("test");
  const styles = createStyles(theme, colorScheme);
  const { id } = useLocalSearchParams();
  const [climb, setClimb] = useState({}); // climb state
  //const [checkboxState, setCheckboxState] = useState();

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const onDateChange = (e, selectedDate) => {
    setDate(selectedDate);
    setShow(false);
    setClimb((prev) => ({
      ...prev,
      date:
        date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear(),
    }));
  };
  const showMode = (modeToShow) => {
    setShow(true);
    setMode(modeToShow);
  };
  const router = useRouter();

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
                <Text style={styles.text}>{selectedItem || climb.grade}</Text>
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

        <DateTimePicker
          value={date}
          mode={"date"}
          //is24Hour={true}
          onChange={onDateChange}
        />

        <SelectDropdown
          data={color}
          onSelect={(selectedItem) =>
            setClimb((prev) => ({ ...prev, color: selectedItem }))
          }
          renderButton={(selectedItem, isOpen) => {
            return (
              <View style={styles.input}>
                <Text style={styles.text}>{selectedItem || climb.color}</Text>
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
                <Text style={styles.text}>{selectedItem || climb.rating}</Text>
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
          text="Completed?"
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
      //flex: 1,
      borderColor: "grey",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginHorizontal: "auto",
      minWidth: "60%",
      fontSize: 16,
      lineHeight: 16,
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
