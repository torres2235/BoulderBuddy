import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { data } from "@/data/ClimbItems";

export default function AddClimb() {
  const [climbs, setClimbs] = useState(data.sort((a, b) => b.id - a.id));
  const [text, setText] = useState("");

  const addClimb = () => {
    // Create
    if (text.trim()) {
      const newId = climbs.length > 0 ? todos[0].id + 1 : 1;
      setClimbs([{ id: newId, title: text, completed: false }, ...climbs]);
      setText("");
    }
  };
}
