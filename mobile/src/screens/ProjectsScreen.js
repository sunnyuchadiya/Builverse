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
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "../components/GlassCard";
import ProjectCard from "../components/ProjectCard";
import CustomButton from "../components/CustomButton";
import { createProjectApi, fetchProjects } from "../lib/api";
import { darkColors, lightColors, theme, useThemeMode } from "../theme";

const TECH_CHIPS = ["All Tech", "Rust", "Next.js", "AI & ML", "Web3", "Go"];

const AVAILABLE_TEAM_MEMBERS = [
  { id: "tm1", name: "Erik Solberg", role: "Lead Architect", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120" },
  { id: "tm2", name: "Astrid Lind", role: "DevOps Lead", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120" },
  { id: "tm3", name: "Sarah Chen", role: "Frontend Specialist", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120" },
  { id: "tm4", name: "Marcus Thorne", role: "Backend Engineer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120" },
];

const INITIAL_TEAMS = [
  {
    id: "t1",
    name: "Core Architecture",
    desc: "Refining the build system and distributed edge runtime for BuildVerse v2.0.",
    status: "Active",
    members: 6,
    icon: "terminal",
    lead: "Elias Thorne (You)",
    projectsCount: 4,
    techStack: ["Rust", "WASM", "Docker"],
  },
  {
    id: "t2",
    name: "AI Agent Squad",
    desc: "Building persistent agent workflows with Mongoose, Kafka, and LLM orchestration.",
    status: "Active",
    members: 4,
    icon: "sparkles",
    lead: "Sarah Chen",
    projectsCount: 3,
    techStack: ["Python", "Node.js", "MongoDB"],
  },
];

export default function ProjectsScreen({ route, navigation }) {
  const { isDarkMode, themeColors } = useThemeMode();
  const colors = themeColors || (isDarkMode ? darkColors : lightColors);

  const [projects, setProjects] = useState([]);
  const [activeChip, setActiveChip] = useState("All Tech");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // New Project Form state with Team Member Selection
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("Active");
  const [selectedMembers, setSelectedMembers] = useState(["tm1", "tm3"]);

  // RE-FETCH PROJECTS DYNAMICALLY EVERY TIME SCREEN IS FOCUSED
  useFocusEffect(
    React.useCallback(() => {
      fetchProjects().then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      });
    }, [])
  );

  // LISTEN FOR DELETED PROJECT ROUTE PARAM
  useEffect(() => {
    if (route.params?.deletedProjectId) {
      const deletedId = route.params.deletedProjectId;
      setProjects((prev) => prev.filter((p) => p.id !== deletedId));
    }
  }, [route.params?.deletedProjectId]);

  // LISTEN FOR UPDATED/COMPLETED PROJECT ROUTE PARAM & UPDATE REAL-TIME
  useEffect(() => {
    if (route.params?.updatedProject) {
      const updated = route.params.updatedProject;
      setProjects((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
    }
  }, [route.params?.updatedProject]);

  const toggleMemberSelection = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) return;

    const chosenMembers = AVAILABLE_TEAM_MEMBERS.filter((m) =>
      selectedMembers.includes(m.id)
    );

    const newProject = await createProjectApi(null, {
      name,
      description: description || "New collaborative workspace project",
      tag,
      progress: 15,
      status: "active",
      teamLeader: "Elias Thorne (You)",
      members: chosenMembers,
    });

    setProjects((prev) => [newProject, ...prev]);
    setName("");
    setDescription("");
    setModalVisible(false);

    navigation.navigate("ProjectDetailsScreen", {
      project: {
        ...newProject,
        teamLeader: "Elias Thorne (You)",
        members: chosenMembers,
      },
    });
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = searchQuery.trim()
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    let matchesChip = true;
    if (activeChip !== "All Tech") {
      const chipLower = activeChip.toLowerCase();
      matchesChip =
        p.name.toLowerCase().includes(chipLower) ||
        p.description.toLowerCase().includes(chipLower) ||
        (p.tag && p.tag.toLowerCase().includes(chipLower));
    }

    return matchesSearch && matchesChip;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* BRAND HEADER */}
        <View style={styles.headerRow}>
          <Text style={[styles.brandTitle, { color: colors.foreground }]}>
            BuildVerse<Text style={{ color: colors.amber }}>.</Text>
          </Text>
          <CustomButton
            title="+ New Project"
            variant="primary"
            size="sm"
            onPress={() => setModalVisible(true)}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
          {/* STITCH HEADER SECTION */}
          <View style={styles.stitchHeaderSection}>
            <Text style={[styles.discoverTitle, { color: colors.foreground }]}>Discover the future</Text>
            <Text style={[styles.discoverSubtitle, { color: colors.muted }]}>
              Browse the most innovative technical projects and connect with world-class engineering teams.
            </Text>

            {/* SEARCH INPUT */}
            <View style={[styles.searchBarBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Ionicons name="search" size={18} color={colors.muted} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.searchInput, { color: colors.foreground }]}
                placeholder="Search Projects (e.g., Rust, Next.js, AI...)"
                placeholderTextColor={colors.subtle}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={16} color={colors.muted} />
                </TouchableOpacity>
              )}
            </View>

            {/* TECH CHIPS FILTER SCROLL */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.techChipsRow}>
              {TECH_CHIPS.map((chip) => (
                <TouchableOpacity
                  key={chip}
                  activeOpacity={0.7}
                  onPress={() => setActiveChip(chip)}
                  style={[
                    styles.techChip,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                    activeChip === chip && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: colors.muted },
                      activeChip === chip && { color: isDarkMode ? "#000" : "#FFF" },
                    ]}
                  >
                    {chip}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* YOUR TEAMS CAROUSEL */}
          <View style={styles.teamsSection}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your Teams</Text>
              <TouchableOpacity onPress={() => setSelectedTeam(INITIAL_TEAMS[0])}>
                <Text style={[styles.manageLink, { color: colors.amber }]}>Manage Teams ›</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {INITIAL_TEAMS.map((team) => (
                <TouchableOpacity
                  key={team.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedTeam(team)}
                >
                  <GlassCard elevated style={styles.teamCard}>
                    <View style={styles.teamHeader}>
                      <View style={[styles.teamIconBox, { backgroundColor: colors.primary }]}>
                        <Ionicons name={team.icon} size={20} color={isDarkMode ? "#000" : "#FFF"} />
                      </View>
                      <View style={[styles.activeTagPill, { backgroundColor: colors.elevated }]}>
                        <Text style={[styles.activeTagText, { color: colors.foreground }]}>{team.status}</Text>
                      </View>
                    </View>

                    <Text style={[styles.teamName, { color: colors.foreground }]}>{team.name}</Text>
                    <Text style={[styles.teamDesc, { color: colors.muted }]} numberOfLines={2}>{team.desc}</Text>

                    <View style={[styles.teamFooter, { borderTopColor: colors.border }]}>
                      <Text style={[styles.membersCount, { color: colors.subtle }]}>{team.members} Members • {team.lead}</Text>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ALL PROJECTS LIST */}
          <View style={styles.sectionTitleRow}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: 12 }]}>
              All Active Projects ({filteredProjects.length})
            </Text>
          </View>

          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPress={() => navigation.navigate("ProjectDetailsScreen", { project })}
              />
            ))
          ) : (
            <GlassCard elevated style={styles.emptyCard}>
              <Ionicons name="folder-open-outline" size={32} color={colors.muted} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No projects found</Text>
              <Text style={[styles.emptySub, { color: colors.muted }]}>Try adjusting your search query or tech filter chips.</Text>
            </GlassCard>
          )}
        </ScrollView>
      </View>

      {/* TEAM DETAILS MODAL */}
      <Modal visible={!!selectedTeam} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard elevated style={[styles.teamModalCard, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalBadge, { color: colors.amber }]}>TEAM LEADER: {selectedTeam?.lead}</Text>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>{selectedTeam?.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedTeam(null)}>
                <Ionicons name="close-circle" size={26} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDesc, { color: colors.muted }]}>{selectedTeam?.desc}</Text>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <Text style={[styles.subHeading, { color: colors.foreground }]}>Team Leader Controls & Analytics</Text>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Main Leader:</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{selectedTeam?.lead}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Total Collaborators:</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{selectedTeam?.members} Engineers</Text>
            </View>

            <View style={styles.modalActions}>
              <CustomButton
                title="Manage Team Members"
                variant="primary"
                size="md"
                style={{ flex: 1 }}
                onPress={() => setSelectedTeam(null)}
              />
            </View>
          </GlassCard>
        </View>
      </Modal>

      {/* CREATE NEW PROJECT WITH TEAM MEMBER SELECTION MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard elevated style={[styles.createProjectModalCard, { backgroundColor: colors.card }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>Create New Project</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.muted} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.inputLabel, { color: colors.muted }]}>Project Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.elevated, borderColor: colors.border, color: colors.foreground }]}
                placeholder="e.g. Lumina Engine v2"
                placeholderTextColor={colors.subtle}
                value={name}
                onChangeText={setName}
              />

              <Text style={[styles.inputLabel, { color: colors.muted }]}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.elevated, borderColor: colors.border, color: colors.foreground }]}
                placeholder="Describe project goals and roadmap..."
                placeholderTextColor={colors.subtle}
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
              />

              <Text style={[styles.subHeading, { color: colors.foreground, marginTop: 8 }]}>
                Select Team Members to Invite & Auto-Create Group Chat:
              </Text>
              {AVAILABLE_TEAM_MEMBERS.map((tm) => {
                const isSelected = selectedMembers.includes(tm.id);
                return (
                  <TouchableOpacity
                    key={tm.id}
                    activeOpacity={0.7}
                    onPress={() => toggleMemberSelection(tm.id)}
                    style={[styles.memberSelectRow, isSelected && { backgroundColor: colors.elevated }]}
                  >
                    <View style={[styles.checkbox, isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                      {isSelected && <Ionicons name="checkmark" size={14} color={isDarkMode ? "#000" : "#FFF"} />}
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={[styles.memberNameText, { color: colors.foreground }]}>{tm.name}</Text>
                      <Text style={[styles.memberRoleText, { color: colors.muted }]}>{tm.role}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <View style={styles.modalActions}>
                <CustomButton
                  title="Cancel"
                  variant="outline"
                  size="md"
                  onPress={() => setModalVisible(false)}
                />
                <CustomButton
                  title="Create & Notify Team"
                  variant="primary"
                  size="md"
                  style={{ marginLeft: 12 }}
                  onPress={handleCreate}
                />
              </View>
            </ScrollView>
          </GlassCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16, marginTop: 8 },
  brandTitle: { fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
  scrollList: { paddingBottom: 48 },
  stitchHeaderSection: { marginBottom: 24 },
  discoverTitle: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5, marginBottom: 4 },
  discoverSubtitle: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  searchBarBox: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 13 },
  techChipsRow: { flexDirection: "row" },
  techChip: { borderWidth: 1, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999, marginRight: 8 },
  chipText: { fontSize: 12, fontWeight: "600" },
  teamsSection: { marginBottom: 24 },
  sectionTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  manageLink: { fontSize: 12, fontWeight: "600" },
  horizontalScroll: { marginLeft: -20, paddingLeft: 20 },
  teamCard: { width: 220, marginRight: 12, padding: 16 },
  teamHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  teamIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  activeTagPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999 },
  activeTagText: { fontSize: 10, fontWeight: "700" },
  teamName: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  teamDesc: { fontSize: 12, lineHeight: 16, marginBottom: 12 },
  teamFooter: { borderTopWidth: 1, paddingTop: 8 },
  membersCount: { fontSize: 11 },
  emptyCard: { alignItems: "center", padding: 24, marginVertical: 12 },
  emptyTitle: { fontSize: 16, fontWeight: "700", marginTop: 8 },
  emptySub: { fontSize: 12, marginTop: 4, textAlign: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.75)", justifyContent: "center", padding: 20 },
  teamModalCard: { padding: 20 },
  createProjectModalCard: { padding: 20, maxHeight: "85%" },
  modalBadge: { fontSize: 10, fontWeight: "800", letterSpacing: 1, marginBottom: 2 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: "800" },
  modalDesc: { fontSize: 13, lineHeight: 18 },
  divider: { height: 1, marginVertical: 14 },
  subHeading: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  infoLabel: { fontSize: 12 },
  infoValue: { fontSize: 12, fontWeight: "700" },
  inputLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6 },
  input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, marginBottom: 12 },
  textArea: { height: 70, textAlignVertical: "top" },
  memberSelectRow: { flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 10, marginBottom: 6 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  memberNameText: { fontSize: 13, fontWeight: "700" },
  memberRoleText: { fontSize: 11 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
});
