import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Octicons from "@expo/vector-icons/Octicons";

import { ThemeContext } from "@/context/ThemeContext";

const dimensions = Dimensions.get("window");
const imageWidth = dimensions.width;

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
      <View style={styles.header}>
        <Pressable style={{ marginLeft: 10 }} onPress={() => router.push("/")}>
          <Octicons name="chevron-left" size={36} color={theme.text} />
        </Pressable>
        <Text style={styles.headerText}>{climb.title}</Text>
        <View />
      </View>
      <Image source={{ uri: climb.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <View style={styles.gradeInfo}>
          <View
            style={[
              styles.colorIndicator,
              { backgroundColor: theme[climb.color] },
            ]}
          />
          <Text style={[styles.text, { fontWeight: "bold", fontSize: 24 }]}>
            {climb.grade}
          </Text>
        </View>
        <View style={styles.ratingInfo}>
          <Octicons name="feed-star" size={24} color={theme.text} />
          <Text style={[styles.text, { fontWeight: 450, fontSize: 24 }]}>
            {climb.rating}/5
          </Text>
        </View>
        <Text style={{ color: "grey" }}>
          {climb.completed === true
            ? `Date Completed: ${climb.date}`
            : `Date Started: ${climb.date}`}
        </Text>
        <Text style={[styles.text, { fontSize: 24 }]}>Tags: </Text>
        <Text style={styles.text}>{climb.tags}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => handlePress(climb.id)}
          style={[styles.Button, { backgroundColor: theme.blue }]}
        >
          <Text style={styles.ButtonText}>Edit</Text>
        </Pressable>
        <Pressable
          onPress={() => handlePress(climb.id)}
          style={[styles.Button, { backgroundColor: theme.red }]}
        >
          <Text style={styles.ButtonText}>Delete</Text>
        </Pressable>
      </View>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    header: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      position: "fixed",
      backgroundColor: colorScheme === "dark" ? "light" : "dark",
      top: 0,
      marginBottom: 15,
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
      width: imageWidth,
      height: imageWidth,
      borderRadius: 8,
    },
    textContainer: {
      flexDirection: "column",
      justifyContent: "flex-start",
      padding: 10,
      gap: 10,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    gradeInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    colorIndicator: {
      width: 24,
      aspectRatio: 1,
      borderRadius: 30,
    },
    ratingInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    text: {
      color: theme.text,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    Button: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      width: "20%",
      padding: 10,
    },
    ButtonText: {
      fontSize: 18,
      color: theme.white,
    },
  });
}
