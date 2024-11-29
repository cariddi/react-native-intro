
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from "react-native";

export default function IdeaScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Idea</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
});
