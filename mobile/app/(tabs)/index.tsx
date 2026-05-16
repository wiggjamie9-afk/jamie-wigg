import { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView, type WebViewNavigation } from "react-native-webview";

const SITE_URL = "https://rhythmixapp.com.au/";

export default function HomeScreen() {
  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);

  const handleNav = (nav: WebViewNavigation) => {
    setLoading(nav.loading);
  };

  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      <WebView
        ref={webRef}
        source={{ uri: SITE_URL }}
        onNavigationStateChange={handleNav}
        allowsBackForwardNavigationGestures
        startInLoadingState
        decelerationRate="normal"
        style={styles.web}
      />
      {loading && (
        <View style={styles.loader} pointerEvents="none">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },
  web: { flex: 1, backgroundColor: "#0a0a0a" },
  loader: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0a",
  },
});
