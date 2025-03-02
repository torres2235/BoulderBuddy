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

import { Colors } from "@/constants/Colors";
import { data } from "@/data/ClimbItems";
import ClimbImages from "@/data/ClimbImages";

export default function Index() {
  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;

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

  const renderItem = ({ item }) => (
    <View style={styles.climbItem}>
      <Pressable onPress={() => handlePress(item.id)} style={styles.image}>
        <Image source={ClimbImages[item.id - 1]} style={styles.image} />
      </Pressable>
      <Text style={styles.climbTitle}>{item.title}</Text>
      <View style={styles.climbText}>
        <Text>{item.grade}</Text>
        <Text>{item.color}</Text>
        <Text>{item.date}</Text>
      </View>
    </View>
  );

  const separatorComp = <View style={styles.separator} />;

  return (
    <Container style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  separator: {
    height: 1,
    backgroundColor: "#1e1e1e",
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
  },
  climbTitle: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 18,
  },
  climbText: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
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
