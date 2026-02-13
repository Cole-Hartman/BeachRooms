import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppleSignInButton } from "@/components/social-auth-buttons/apple/apple-sign-in-button";
import { GoogleSignInButton } from "@/components/social-auth-buttons/google/google-sign-in-button";
import { Colors } from "@/constants/theme";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.branding}>
          <Text style={styles.logo}>BeachRooms</Text>
          <Text style={styles.tagline}>Find your study space at CSULB</Text>
        </View>

        <View style={styles.authButtons}>
          <View style={styles.buttonWrapper}>
            <AppleSignInButton />
          </View>
          <View style={styles.buttonWrapper}>
            <GoogleSignInButton />
          </View>
        </View>

        <Text style={styles.disclaimer}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  branding: {
    alignItems: "center",
    marginBottom: 64,
  },
  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: Colors.dark.tint,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: Colors.dark.text,
    opacity: 0.8,
  },
  authButtons: {
    width: "100%",
    gap: 16,
  },
  buttonWrapper: {
    width: "100%",
  },
  disclaimer: {
    marginTop: 32,
    fontSize: 12,
    color: Colors.dark.text,
    opacity: 0.5,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});
