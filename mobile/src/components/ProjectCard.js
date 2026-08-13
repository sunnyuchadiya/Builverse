import React from "react";
import { StyleSheet, Text, View } from "react-native";
import GlassCard from "./GlassCard";
import { theme } from "../theme";

export default function ProjectCard({ project, onToggleStatus }) {
  const isCompleted = project.progress >= 100 || project.status === "completed";

  return (
    <GlassCard style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>
          {project.name}
        </Text>
        <View
          style={[
            styles.tagBadge,
            isCompleted ? styles.tagCompleted : styles.tagActive,
          ]}
        >
          <Text
            style={[
              styles.tagText,
              isCompleted ? styles.tagTextCompleted : styles.tagTextActive,
            ]}
          >
            {project.tag || (isCompleted ? "Completed" : "Active")}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {project.description}
      </Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValue}>{project.progress}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(100, Math.max(0, project.progress))}%` },
              isCompleted && { backgroundColor: theme.colors.primary },
            ]}
          />
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing(2.5),
    marginVertical: theme.spacing(1),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  title: {
    ...theme.font.h3,
    flex: 1,
    marginRight: theme.spacing(1),
  },
  tagBadge: {
    paddingHorizontal: theme.spacing(1.5),
    paddingVertical: theme.spacing(0.5),
    borderRadius: theme.radius.pill,
    borderWidth: 1,
  },
  tagActive: {
    backgroundColor: "rgba(99, 102, 241, 0.12)",
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  tagCompleted: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  tagTextActive: {
    color: theme.colors.indigo,
  },
  tagTextCompleted: {
    color: theme.colors.primary,
  },
  description: {
    ...theme.font.subtitle,
    fontSize: 13,
    marginBottom: theme.spacing(2),
  },
  progressContainer: {
    marginTop: theme.spacing(0.5),
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing(0.8),
  },
  progressLabel: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.foreground,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radius.pill,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.indigo,
    borderRadius: theme.radius.pill,
  },
});
