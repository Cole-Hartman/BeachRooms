import { View, Text, StyleSheet } from "react-native";

export function AppleSignInButton() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Apple Sign-In is only available on iOS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#666",
    fontSize: 14,
  },
});
