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
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

import { data } from "@/data/ClimbItems";
import { ThemeContext } from "@/context/ThemeContext";
import UploadModal from "@/components/UploadModal";
import DefaultImage from "@/assets/images/default-image.png";

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default function AddClimb() {
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext); // styles
  const styles = createStyles(theme, colorScheme);
  const [modalVisible, setModalVisible] = useState(false);

  const [climbs, setClimbs] = useState([]);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const onDateChange = (e, selectedDate) => {
    setDate(selectedDate);
    setShow(false);
    setAttribute((prev) => ({
      ...prev,
      date:
        date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear(),
    }));
  };
  const router = useRouter();
  const [attributes, setAttribute] = useState({
    id: null,
    title: "",
    grade: "",
    color: "",
    date: date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear(),
    rating: null,
    completed: false,
    tags: [],
    image: Image.resolveAssetSource(DefaultImage).uri,
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
        setAttribute((prev) => ({ ...prev, image: result.assets[0].uri }));
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
        setAttribute((prev) => ({ ...prev, image: result.assets[0].uri }));
      }
    } catch (e) {
      console.error(e);
      setModalVisible(false);
    }
  };

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
      date:
        date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear(),
      rating: 0,
      completed: false,
      tags: [],
      image: Image.resolveAssetSource(DefaultImage).uri,
    });

    router.push(`/`);
  };

  return (
    <DismissKeyboard>
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
          <TouchableOpacity onPress={() => pickImage()}>
            <Image source={{ uri: attributes.image }} style={styles.image} />
          </TouchableOpacity>

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
              setAttribute((prev) => ({ ...prev, grade: selectedItem }))
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
          <DateTimePicker
            value={date}
            mode={"date"}
            //is24Hour={true}
            onChange={onDateChange}
          />
          <SelectDropdown
            data={color}
            onSelect={(selectedItem) =>
              setAttribute((prev) => ({ ...prev, color: selectedItem }))
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
              setAttribute((prev) => ({ ...prev, rating: selectedItem }))
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

        {/* <UploadModal
        modalVisible={modalVisible}
        onBackPress={() => {
          setModalVisible(false);
        }}
        onCameraPress={() => uploadImage()}
      /> */}
      </SafeAreaView>
    </DismissKeyboard>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: theme.background,
    },
    image: {
      width: 300,
      height: 300,
      //flex: 1,
      //resizeMode: "cover",
      //justifyContent: "center",
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
