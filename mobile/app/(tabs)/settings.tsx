import Constants from "expo-constants";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ROWS: Array<{ label: string; url: string }> = [
  { label: "Privacy Policy", url: "https://rhythmixapp.com.au/privacy.html" },
  { label: "Terms of Service", url: "https://rhythmixapp.com.au/terms.html" },
  { label: "Refunds", url: "https://rhythmixapp.com.au/refunds.html" },
  { label: "Contact / Support", url: "https://rhythmixapp.com.au/founder.html" },
];

export default function SettingsScreen() {
  const version = Constants.expoConfig?.version ?? "0.0.0";

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.list}>
          {ROWS.map((row) => (
            <Pressable
              key={row.url}
              onPress={() => Linking.openURL(row.url)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <Text style={styles.rowText}>{row.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.version}>RHYTHMIX v{version}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 32, gap: 16 },
  title: { color: "#ffffff", fontSize: 28, fontWeight: "700" },
  list: { marginTop: 8, gap: 1, backgroundColor: "#1a1a1a", borderRadius: 12, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#141414",
  },
  rowPressed: { backgroundColor: "#1f1f1f" },
  rowText: { color: "#ffffff", fontSize: 16 },
  chevron: { color: "#6a6a6a", fontSize: 22 },
  version: { color: "#5a5a5a", fontSize: 12, textAlign: "center", marginTop: "auto", paddingBottom: 16 },
});
