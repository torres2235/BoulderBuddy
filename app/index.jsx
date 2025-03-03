import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  ScrollView,
  Appearance,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Octicons from "@expo/vector-icons/Octicons";

import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/context/ThemeContext";
import { data } from "@/data/ClimbItems";
import ClimbImages from "@/data/ClimbImages";

export default function Index() {
  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);

  const [climbs, setClimbs] = useState(data.sort((a, b) => b.id - a.id));
  const completed = [];
  const projected = [];
  for (let i = 0; i < climbs.length; i++) {
    if (climbs[i].completed) {
      completed.push(climbs[i]);
    } else {
      projected.push(climbs[i]);
    }
  }
  const [text, setText] = useState("");
  const router = useRouter();

  const handlePress = (id) => {
    router.push(`/climbs/${id}`);
  };
  const styles = createStyles(theme, colorScheme);
  const renderItem = (
    { item } // Read
  ) => (
    <View style={styles.climbItem}>
      <Pressable onPress={() => handlePress(item.id)} style={styles.image}>
        <Image source={ClimbImages[item.id - 1]} style={styles.image} />
      </Pressable>
      <Text style={styles.climbTitle}>{item.title}</Text>
      <View style={styles.climbTextContainer}>
        <Text style={styles.climbText}>{item.grade}</Text>
        <Text style={styles.climbText}>{item.color}</Text>
        <Text style={styles.climbText}>{item.date}</Text>
      </View>
    </View>
  );

  const separatorComp = <View style={styles.separator} />;

  return (
    <Container style={styles.container}>
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
      <View style={{ height: 500 }}>
        <Text style={styles.heading}>Current Projects</Text>
        <FlatList
          data={projected}
          renderItem={renderItem}
          keyExtractor={(climb) => climb.id}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
      {separatorComp}
      <View style={{ height: 500 }}>
        <Text style={styles.heading}>Completed</Text>
        <FlatList
          data={completed}
          renderItem={renderItem}
          keyExtractor={(climb) => climb.id}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
      {separatorComp}
    </Container>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    flatListContainer: {
      flex: 1,
      flexDirection: "row",
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
      marginBottom: 10,
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
  });
}
