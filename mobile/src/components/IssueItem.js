import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";

export default function IssueItem({ issue, onToggle }) {
  const isHigh = issue.priority === "High";
  const isMedium = issue.priority === "Medium";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggle(issue.id)}
      style={[
        styles.container,
        issue.resolved && styles.containerResolved,
      ]}
    >
      <View style={styles.leftRow}>
        <View
          style={[
            styles.checkbox,
            issue.resolved && styles.checkboxResolved,
          ]}
        >
          {issue.resolved && (
            <Ionicons name="checkmark" size={14} color="#000000" />
          )}
        </View>

        <Text
          style={[
            styles.title,
            issue.resolved && styles.titleResolved,
          ]}
          numberOfLines={2}
        >
          {issue.title}
        </Text>
      </View>

      <View
        style={[
          styles.priorityBadge,
          isHigh && styles.priorityHigh,
          isMedium && styles.priorityMedium,
          !isHigh && !isMedium && styles.priorityLow,
        ]}
      >
        <Text
          style={[
            styles.priorityText,
            isHigh && styles.priorityTextHigh,
            isMedium && styles.priorityTextMedium,
            !isHigh && !isMedium && styles.priorityTextLow,
          ]}
        >
          {issue.priority || "Low"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing(1.8),
    marginVertical: theme.spacing(0.6),
  },
  containerResolved: {
    opacity: 0.6,
    backgroundColor: "rgba(24, 24, 27, 0.5)",
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: theme.spacing(1),
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: theme.colors.muted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing(1.5),
  },
  checkboxResolved: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  title: {
    fontSize: 14,
    color: theme.colors.foreground,
    flex: 1,
  },
  titleResolved: {
    textDecorationLine: "line-through",
    color: theme.colors.muted,
  },
  priorityBadge: {
    paddingHorizontal: theme.spacing(1.2),
    paddingVertical: theme.spacing(0.4),
    borderRadius: theme.radius.pill,
  },
  priorityHigh: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  priorityMedium: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
  },
  priorityLow: {
    backgroundColor: "rgba(113, 113, 122, 0.15)",
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "600",
  },
  priorityTextHigh: {
    color: theme.colors.danger,
  },
  priorityTextMedium: {
    color: theme.colors.warning,
  },
  priorityTextLow: {
    color: theme.colors.subtle,
  },
});
