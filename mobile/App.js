import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeModeProvider, theme } from "./src/theme";

export default function App() {
  return (
    <SafeAreaProvider style={styles.root}>
      <ThemeModeProvider>
        <View style={styles.root}>
          <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
          <AppNavigator />
        </View>
      </ThemeModeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});