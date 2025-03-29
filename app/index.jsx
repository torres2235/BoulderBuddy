import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  SectionList,
  Image,
  ScrollView,
  Appearance,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Octicons from "@expo/vector-icons/Octicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

import { ThemeContext } from "@/context/ThemeContext";
import { data } from "@/data/ClimbItems";

export default function Index() {
  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext); // styles
  const styles = createStyles(theme, colorScheme);

  const [climbs, setClimbs] = useState([]);

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

  const completed = [];
  const projected = [];
  for (let i = 0; i < climbs.length; i++) {
    if (climbs[i].completed) {
      completed.push(climbs[i]);
    } else {
      projected.push(climbs[i]);
    }
  }
  const sections = [
    { title: "Projects", data: [{ list: projected }] },
    { title: "Completed", data: [{ list: completed }] },
  ];

  const router = useRouter(); // dynamic routing
  const handlePress = (id) => {
    router.push(`/climbs/${id}`);
  };

  const renderItem = (
    { item } // Read
  ) => (
    <View style={styles.climbItem}>
      <TouchableOpacity
        onPress={() => handlePress(item.id)}
        style={styles.imageContainer}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.dateText}>{item.date}</Text>
      <Text style={styles.climbTitle}>{item.title}</Text>
      <View
        style={[styles.colorIndicator, { backgroundColor: theme[item.color] }]}
      >
        <Text style={styles.climbGrade}>{item.grade}</Text>
      </View>
    </View>
  );

  const renderSection = ({ item }) => (
    <FlatList
      data={item.list}
      numColumns={2}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      //style={styles.flatListContainer}
    />
  );

  return (
    <Container edges={["top"]} style={styles.container}>
      <View style={styles.header}>
        <Pressable>
          <Ionicons
            name="menu"
            size={36}
            color={theme.text}
            style={{ marginLeft: 10 }}
          />
        </Pressable>
        <Text style={{ color: theme.text, fontSize: 36 }}>Boulder Buddy</Text>
        <Pressable
          onPress={() =>
            setColorScheme(colorScheme === "light" ? "dark" : "light")
          }
          style={{ marginRight: 10 }}
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
      </View>

      <View style={styles.mainContentContainer}>
        <SectionList
          sections={sections}
          renderItem={renderSection}
          renderSectionHeader={({ section }) => (
            <Text style={styles.heading}>{section.title}</Text>
          )}
        />
      </View>

      <View style={styles.footer}>
        <Pressable onPress={() => router.push("/addClimb")}>
          <AntDesign
            name="plussquareo"
            size={35}
            color={theme.black}
            selectable={undefined}
            style={{ width: 35 }}
          />
        </Pressable>
      </View>

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </Container>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      height: 56,
      justifyContent: "space-between",
      alignItems: "center",
      position: "fixed",
      backgroundColor: colorScheme === "dark" ? "light" : "dark",
      top: 0,
    },
    mainContentContainer: {
      flex: 1,
      flexDirection: "column",
    },
    heading: {
      fontWeight: 600, // semi-bold
      fontSize: 36,
      color: theme.text,
      backgroundColor: theme.background,
      paddingLeft: 16,
      paddingBottom: 10,
    },
    flatListContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
    },
    climbItem: {
      width: "45%",
      //height: "auto",
      minHeight: 200,
      marginHorizontal: "auto",
      borderColor: theme.text,
      background: theme.background,
      color: theme.text,
      marginBottom: 20,
    },
    imageContainer: {
      width: "100%",
      aspectRatio: 1,
      flex: 1,
      marginBottom: 10,

      // drop shadow
      shadowColor: "#171717",
      shadowOffset: { width: 1, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
    },
    image: {
      width: "100%",
      aspectRatio: 1,
      resizeMode: "cover",
      justifyContent: "center",
      borderRadius: 8,
    },
    climbTitle: {
      fontSize: 20,
      //fontWeight: 600,
      color: theme.text,
    },
    dateText: {
      size: 12,
      color: "grey",
    },
    colorIndicator: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      //alignSelf: "flex-start",
      height: 22,
      width: 35,
      borderRadius: 20,
      backgroundColor: "grey",
    },
    climbGrade: {
      fontSize: 16,
      color: "white",
    },
    footer: {
      position: "fixed",
      justifyContent: "center",
      alignItems: "center",
      //height: 44,
      bottom: 0,
      backgroundColor: colorScheme === "dark" ? "light" : "dark",
      borderTopColor: "grey",
      borderTopWidth: 1,
      paddingTop: 5,
      paddingBottom: 30,
      backgroundColor: "white",
    },
  });
}

// const clearAppData = async () => {
//   try {
//     await AsyncStorage.clear();

//     console.log("App data cleared successfully!");
//   } catch (error) {
//     console.error("Error clearing app data:", error);
//   }
// };
// clearAppData();
