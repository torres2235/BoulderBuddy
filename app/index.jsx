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
      <View style={styles.climbText}>
        <Text>{item.title}</Text>
        <Text>{item.grade}</Text>
        <Text>{item.color}</Text>
        <Text>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <Container style={styles.container}>
      <FlatList
        data={climbs}
        renderItem={renderItem}
        keyExtractor={(climb) => climb.id}
        contentContainerStyle={styles.flatListContainer}
      />
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
    gap: 10,
  },
  climbItem: {
    //flexDirection: "column",
    width: 200,
    height: 200,
    marginHorizontal: "auto",
    marginBottom: 10,
  },
  climbText: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});
