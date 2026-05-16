import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LibraryScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Library</Text>
        <Text style={styles.subtitle}>
          Native screen. Tracks, playlists, and downloads will live here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 12,
  },
  title: { color: "#ffffff", fontSize: 28, fontWeight: "700" },
  subtitle: { color: "#a0a0a0", fontSize: 15, lineHeight: 22 },
});
