import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/theme";

export function EmailSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        Alert.alert(
          "Check your email",
          "We sent you a confirmation link to verify your account"
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete={isSignUp ? "new-password" : "current-password"}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsSignUp(!isSignUp)}
      >
        <Text style={styles.toggleText}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 12,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#444",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.dark.tint,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  toggleButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  toggleText: {
    color: Colors.dark.tint,
    fontSize: 14,
  },
});
