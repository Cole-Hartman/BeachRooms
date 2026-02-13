import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { supabase } from "@/lib/supabase";

interface SignOutButtonProps {
  style?: object;
}

export function SignOutButton({ style }: SignOutButtonProps) {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign Out Error", "Failed to sign out");
      console.error("Sign out error:", error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handleSignOut}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>Sign Out</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#dc3545",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
