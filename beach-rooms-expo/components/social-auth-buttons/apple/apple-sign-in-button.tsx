import { Alert, StyleSheet, Text, TouchableOpacity, Platform } from "react-native";
import { supabase } from "@/lib/supabase";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

export function AppleSignInButton() {
  const handleAppleSignIn = async () => {
    if (Platform.OS === "android") {
      Alert.alert("Not Available", "Apple Sign-In is only available on iOS and web");
      return;
    }

    try {
      const redirectTo = makeRedirectUri();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
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
      Alert.alert("Sign In Error", "Failed to sign in with Apple");
      console.error("Apple sign in error:", error);
    }
  };

  // Hide on Android since Apple Sign-In isn't available there
  if (Platform.OS === "android") {
    return null;
  }

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
