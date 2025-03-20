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

//import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/context/ThemeContext";
import { data } from "@/data/ClimbItems";
import ClimbImages from "@/data/ClimbImages";

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
        style={styles.image}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.climbTitle}>{item.title}</Text>
      <View style={styles.climbTextContainer}>
        <Text style={styles.climbText}>{item.grade}</Text>
        <Text style={styles.climbText}>{item.color}</Text>
        <Text style={styles.climbText}>{item.date}</Text>
      </View>
    </View>
  );

  const renderSection = ({ item }) => (
    <View>
      <FlatList
        data={item.list}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={styles.separator} />
    </View>
  );

  return (
    <Container style={styles.container}>
      <View style={styles.header}>
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
      </View>

      <View style={{ flex: 1, flexDirection: "column", height: 500 }}>
        <SectionList
          sections={sections}
          renderItem={renderSection}
          renderSectionHeader={({ section }) => (
            <Text style={styles.heading}>{section.title}</Text>
          )}
        />
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={() => router.push("/addClimb")}
          style={
            {
              // flex: 1,
              // flexDirection: "row",
              // justifyContent: "center",
              // alignItems: "center",
            }
          }
        >
          <AntDesign
            name="plussquareo"
            size={36}
            color={theme.text}
            selectable={undefined}
            style={{ width: 36 }}
          />
        </Pressable>
      </View>

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </Container>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    header: {
      //flex: 1,
      position: "fixed",

      top: 0,
    },
    container: {
      flex: 1,
      height: "100%",
      backgroundColor: theme.background,
    },
    flatListContainer: {
      flex: 1,
      flexDirection: "column",
      flexWrap: "wrap",
      justifyContent: Platform.OS === "web" ? "flex-start" : "space-evenly",
    },
    heading: {
      fontWeight: "bold",
      fontSize: 32,
      color: theme.text,
    },
    separator: {
      height: 1,
      backgroundColor: theme.text,
      width: "50%",
      maxWidth: 300,
      marginHorizontal: "auto",
      margin: 15,
    },
    climbItem: {
      width: 200,
      height: 200,
      marginHorizontal: "auto",
      //padding: 5,
      borderWidth: 1,
      borderColor: "#1e1e1e",
      borderRadius: 15,
      borderColor: theme.text,
      background: theme.background,
      color: theme.text,
    },
    climbTitle: {
      fontWeight: "bold",
      textDecorationLine: "underline",
      fontSize: 18,
      color: theme.text,
    },
    climbTextContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
    },
    climbText: {
      color: theme.text,
    },
    image: {
      width: "100%",
      height: "100%",
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
      borderTopLeftRadius: 14,
      borderTopRightRadius: 14,
    },
    footer: {
      //flex: 1,
      position: "fixed",

      bottom: 0,
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
