import React from "react";
import { StyleSheet, View } from "react-native";
import { theme } from "../theme";

export default function GlassCard({ children, style, elevated = false, ...props }) {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevatedCard,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing(2),
    marginVertical: theme.spacing(1),
    ...theme.shadows.sm,
  },
  elevatedCard: {
    backgroundColor: theme.colors.elevated,
    borderColor: theme.colors.borderSubtle,
    ...theme.shadows.md,
  },
});
