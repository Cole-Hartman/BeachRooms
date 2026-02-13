import { Alert, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { supabase } from "@/lib/supabase";

// Lazy load native module to prevent crash in Expo Go
let appleAuth: typeof import("@invertase/react-native-apple-authentication").appleAuth | null = null;

try {
  const module = require("@invertase/react-native-apple-authentication");
  appleAuth = module.appleAuth;
} catch {
  // Native module not available (Expo Go)
}

export function AppleSignInButton() {
  const handleAppleSignIn = async () => {
    if (!appleAuth) {
      Alert.alert(
        "Development Build Required",
        "Apple Sign-In requires a development build. Run: npx expo run:ios"
      );
      return;
    }

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error("No identity token returned from Apple");
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: appleAuthRequestResponse.identityToken,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("canceled")) {
        return;
      }
      Alert.alert("Sign In Error", "Failed to sign in with Apple");
      console.error("Apple sign in error:", error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleAppleSignIn}
      activeOpacity={0.7}
    >
      <Text style={styles.appleIcon}></Text>
      <Text style={styles.buttonText}>Sign in with Apple</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#000",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  appleIcon: {
    fontSize: 20,
    color: "#fff",
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
