import { Alert, StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import { supabase } from "@/lib/supabase";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

// Lazy load native module to prevent crash in Expo Go / web
let GoogleSignin: typeof import("@react-native-google-signin/google-signin").GoogleSignin | null = null;
let statusCodes: typeof import("@react-native-google-signin/google-signin").statusCodes | null = null;

if (Platform.OS !== "web") {
  try {
    const module = require("@react-native-google-signin/google-signin");
    GoogleSignin = module.GoogleSignin;
    statusCodes = module.statusCodes;

    // Configure Google Sign-In for native
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
  } catch {
    // Native module not available (Expo Go)
  }
}

export function GoogleSignInButton() {
  const handleNativeGoogleSignIn = async () => {
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

  const handleWebGoogleSignIn = async () => {
    try {
      const redirectTo = makeRedirectUri();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectTo
        );

        if (result.type === "success") {
          const url = new URL(result.url);
          const params = new URLSearchParams(url.hash.substring(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          }
        }
      }
    } catch (error) {
      Alert.alert("Sign In Error", "Failed to sign in with Google");
      console.error("Google sign in error:", error);
    }
  };

  const handleGoogleSignIn = Platform.OS === "web"
    ? handleWebGoogleSignIn
    : handleNativeGoogleSignIn;

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
});
