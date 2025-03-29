import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView,
} from "react-native";
import { useState, useEffect, useContext } from "react";
//import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Octicons from "@expo/vector-icons/Octicons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import SelectDropdown from "react-native-select-dropdown";
import * as ImagePicker from "expo-image-picker";

import DateTimePicker from "@react-native-community/datetimepicker";

import { ThemeContext } from "@/context/ThemeContext";

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const dimensions = Dimensions.get("window");
const imageWidth = dimensions.width;

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
    "V0",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
    "V7",
    "V8",
    "V9",
    "V10",
    "V11",
    "V12",
  ];

  const color = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "pink",
    "black",
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

  const uploadImage = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        allowEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        // save image
        setClimb((prev) => ({ ...prev, image: result.assets[0].uri }));
      }
    } catch (e) {
      console.error(e);
      setModalVisible(false);
    }
  };

  const pickImage = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        // save image
        setClimb((prev) => ({ ...prev, image: result.assets[0].uri }));
      }
    } catch (e) {
      console.error(e);
      setModalVisible(false);
    }
  };

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
    <DismissKeyboard>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={{ marginLeft: 25 }}
            onPress={() => router.push(`/climbs/${climb.id}`)}
          >
            <Octicons name="chevron-left" size={36} color={theme.text} />
          </Pressable>
          <Text style={styles.headerText}>Edit Climb</Text>
          <View />
        </View>
        <ScrollView>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => pickImage()}>
              <Image source={{ uri: climb.image }} style={styles.image} />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Edit Title"
              placeholderTextColor="grey"
              value={climb?.title || ""}
              onBlur={() => Keyboard.dismiss()}
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
                    <Text style={styles.text}>
                      {selectedItem || climb.grade}
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
                    <Text style={styles.text}>
                      {selectedItem || climb.color}
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
                    <Text style={styles.text}>
                      {selectedItem || climb.rating}
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
          <View
            style={[
              styles.inputContainer,
              {
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              },
            ]}
          >
            <Pressable onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
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
        </ScrollView>
      </SafeAreaView>
    </DismissKeyboard>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      position: "fixed",
      backgroundColor: colorScheme === "dark" ? "light" : "dark",
      top: 0,
    },
    headerText: {
      textAlign: "center",
      color: theme.text,
      fontSize: 36,
      fontWeight: 600,
    },
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: theme.background,
    },
    image: {
      width: "85%",
      aspectRatio: 1,
      //flex: 1,
      //resizeMode: "cover",
      //justifyContent: "center",
      borderRadius: 8,
      borderColor: theme.text,
      borderWidth: 1,
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
