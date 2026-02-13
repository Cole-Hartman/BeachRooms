import { Alert, StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import { supabase } from "@/lib/supabase";

// Lazy load native module to prevent crash in Expo Go
let GoogleSignin: typeof import("@react-native-google-signin/google-signin").GoogleSignin | null = null;
let statusCodes: typeof import("@react-native-google-signin/google-signin").statusCodes | null = null;

try {
  const module = require("@react-native-google-signin/google-signin");
  GoogleSignin = module.GoogleSignin;
  statusCodes = module.statusCodes;

  // Configure Google Sign-In
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });
} catch {
  // Native module not available (Expo Go)
}

export function GoogleSignInButton() {
  const handleGoogleSignIn = async () => {
    if (!GoogleSignin || !statusCodes) {
      Alert.alert(
        "Development Build Required",
        "Google Sign-In requires a development build. Run: npx expo run:ios"
      );
      return;
    }

    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (!response.data?.idToken) {
        throw new Error("No ID token returned from Google");
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.data.idToken,
      });

      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        statusCodes &&
        error.code === statusCodes.SIGN_IN_CANCELLED
      ) {
        return;
      }
      Alert.alert("Sign In Error", "Failed to sign in with Google");
      console.error("Google sign in error:", error);
    }
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <Text style={styles.unavailableText}>
          Google Sign-In is not available on web
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleGoogleSignIn}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.googleIcon}>G</Text>
      </View>
      <Text style={styles.buttonText}>Sign in with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  iconContainer: {
    marginRight: 12,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4285F4",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  unavailableText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    padding: 16,
  },
});
