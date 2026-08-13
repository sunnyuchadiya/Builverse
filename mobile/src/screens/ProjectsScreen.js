import React, { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "../components/GlassCard";
import ProjectCard from "../components/ProjectCard";
import CustomButton from "../components/CustomButton";
import { createProjectApi, fetchProjects } from "../lib/api";
import { theme } from "../theme";

export default function ProjectsScreen() {
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("Active");

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;

    const newProject = await createProjectApi(null, {
      name,
      description: description || "New collaborative workspace project",
      tag,
      progress: 10,
      status: "active",
    });

    setProjects((prev) => [newProject, ...prev]);
    setName("");
    setDescription("");
    setModalVisible(false);
  };

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === "Active") return p.status === "active";
    if (activeFilter === "Completed") return p.status === "completed";
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.subtitle}>Workspace</Text>
            <Text style={styles.title}>Projects & Teams</Text>
          </View>
          <CustomButton
            title="+ New"
            variant="primary"
            size="sm"
            onPress={() => setModalVisible(true)}
          />
        </View>

        {/* FILTER TABS */}
        <View style={styles.filterRow}>
          {["All", "Active", "Completed"].map((filter) => (
            <TouchableOpacity
              key={filter}
              activeOpacity={0.7}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterTab,
                activeFilter === filter && styles.filterTabActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ScrollView>
      </View>

      {/* CREATE NEW PROJECT MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard elevated style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Project</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.muted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Project Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Design System V2"
              placeholderTextColor={theme.colors.subtle}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe project scope..."
              placeholderTextColor={theme.colors.subtle}
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.modalActions}>
              <CustomButton
                title="Cancel"
                variant="outline"
                size="md"
                onPress={() => setModalVisible(false)}
              />
              <CustomButton
                title="Create Project"
                variant="primary"
                size="md"
                style={{ marginLeft: theme.spacing(1.5) }}
                onPress={handleCreate}
              />
            </View>
          </GlassCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing(2.5),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  title: {
    ...theme.font.h1,
    fontSize: 24,
  },
  filterRow: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterTab: {
    flex: 1,
    paddingVertical: theme.spacing(1),
    alignItems: "center",
    borderRadius: theme.radius.sm,
  },
  filterTabActive: {
    backgroundColor: theme.colors.elevated,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  filterTextActive: {
    color: theme.colors.primary,
  },
  scrollList: {
    paddingBottom: theme.spacing(6),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    padding: theme.spacing(2.5),
  },
  modalContent: {
    padding: theme.spacing(3),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2.5),
  },
  modalTitle: {
    ...theme.font.h2,
    fontSize: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.muted,
    marginBottom: theme.spacing(0.8),
  },
  input: {
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.foreground,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1.5),
    fontSize: 14,
    marginBottom: theme.spacing(2),
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: theme.spacing(1),
  },
});
