import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../theme";

export default function CustomButton({
  title,
  onPress,
  variant = "primary", // primary | secondary | outline | danger
  size = "md", // sm | md | lg
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) {
  const isOutline = variant === "outline";
  const isSecondary = variant === "secondary";
  const isDanger = variant === "danger";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        styles[`size_${size}`],
        styles[`variant_${variant}`],
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isOutline || isSecondary ? theme.colors.foreground : theme.colors.primaryForeground}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text
            style={[
              styles.text,
              styles[`textSize_${size}`],
              isOutline && styles.textOutline,
              isSecondary && styles.textSecondary,
              isDanger && styles.textDanger,
              variant === "primary" && styles.textPrimary,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: theme.spacing(1),
  },

  // Sizes
  size_sm: {
    paddingVertical: theme.spacing(1),
    paddingHorizontal: theme.spacing(2),
  },
  size_md: {
    paddingVertical: theme.spacing(1.5),
    paddingHorizontal: theme.spacing(3),
  },
  size_lg: {
    paddingVertical: theme.spacing(2),
    paddingHorizontal: theme.spacing(4),
  },

  // Variants
  variant_primary: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.glow,
  },
  variant_secondary: {
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  variant_outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  variant_danger: {
    backgroundColor: theme.colors.danger,
  },

  disabled: {
    opacity: 0.5,
  },

  // Text
  text: {
    fontWeight: "600",
  },
  textSize_sm: {
    fontSize: 13,
  },
  textSize_md: {
    fontSize: 15,
  },
  textSize_lg: {
    fontSize: 16,
  },

  textPrimary: {
    color: "#000000",
  },
  textSecondary: {
    color: theme.colors.foreground,
  },
  textOutline: {
    color: theme.colors.foreground,
  },
  textDanger: {
    color: "#ffffff",
  },
});
