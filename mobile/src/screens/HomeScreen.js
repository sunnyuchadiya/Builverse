import React, { useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "../components/GlassCard";
import CustomButton from "../components/CustomButton";
import { getCurrentUserSession } from "../lib/api";
import { darkColors, lightColors, theme, useThemeMode } from "../theme";

const ACTIVE_PROJECTS = [
  { id: "p1", name: "Project Phoenix", subtitle: "Cloud Infrastructure V2", tag: "GitHub Sync", progress: 85, icon: "terminal" },
  { id: "p2", name: "Aero Engine", subtitle: "High Perf Logic API", tag: "Linear Tasks", pendingTasks: 12, icon: "rocket-outline" },
];

const RECENT_ACTIVITIES = [
  {
    id: "a1",
    user: "Sarah",
    action: "pushed 4 commits to main",
    time: "2 HOURS AGO",
    icon: "git-commit-outline",
    repo: "BuildVerse / Core Engine",
    branch: "main",
    commits: [
      "feat(auth): add JWT token refresh mechanism",
      "fix(ui): responsive card spacing for tablet layout",
      "refactor(db): Mongoose connection pooling optimization",
      "docs: update API endpoints documentation",
    ],
    stats: "+142 lines, -18 lines",
  },
  {
    id: "a2",
    user: "Alex",
    action: 'opened a new issue: "Auth redirect loop on OAuth login"',
    time: "5 HOURS AGO",
    icon: "alert-circle-outline",
    isError: true,
    repo: "BuildVerse / Web Auth",
    issueId: "#342",
    description: "OAuth callback handler enters infinite loop when token cookie expires during active session.",
    priority: "HIGH",
  },
  {
    id: "a3",
    user: "Community",
    action: "New event in 'React Delhi' community",
    time: "YESTERDAY",
    icon: "calendar-outline",
    isEvent: true,
    eventTitle: "React & Next.js 14 Ecosystem Deep Dive",
    location: "Connaught Place, Delhi & YouTube Live",
    attendees: 142,
  },
];

const MODULE_DETAILS = [
  {
    id: "m1",
    moduleNumber: "Module 1",
    duration: "24 mins",
    title: "Design Systems",
    summary: "Tokens, components, and the discipline to build scalable design systems.",
    icon: "layers-outline",
    topics: [
      "Atomic Token Architecture (Color, Spacing, Typography)",
      "Component API Design & Variant Specs in Figma",
      "Dark Mode & High-Contrast Elevation Shadows",
      "Syncing Design Tokens to React & React Native Codebases",
    ],
    takeaways: "Build a production-ready design system token scale that supports web, iOS, and Android seamlessly.",
    codeSnippet: `const tokens = {\n  colors: { primary: "#10b981", bg: "#09090b" },\n  radius: { sm: 8, md: 16, pill: 9999 }\n};`,
  },
  {
    id: "m2",
    moduleNumber: "Module 2",
    duration: "24 mins",
    title: "Web & Mobile Design",
    summary: "Layout, typography, and visual rhythm that feels effortless across devices.",
    icon: "phone-portrait-outline",
    topics: [
      "Fluid 12-Column Grids & Dynamic Flexbox Layouts",
      "Typography Scale & Optical Kerning Principles",
      "Touch-First Mobile Navigation & Gesture Thresholds",
      "Cross-Platform Visual Rhythm (iOS HIG vs Android Material3)",
    ],
    takeaways: "Master responsive layout math and dynamic typography that looks crisp on every screen density.",
    codeSnippet: `const fontScale = {\n  hero: { fontSize: 32, lineHeight: 38 },\n  body: { fontSize: 14, lineHeight: 20 }\n};`,
  },
];

export default function HomeScreen({ navigation }) {
  const { isDarkMode, themeColors } = useThemeMode();
  const colors = themeColors || (isDarkMode ? darkColors : lightColors);

  const [userSession, setUserSession] = useState(getCurrentUserSession());
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // DYNAMIC REFRESH ON SCREEN FOCUS
  useFocusEffect(
    React.useCallback(() => {
      setUserSession(getCurrentUserSession());
    }, [])
  );

  const userName = userSession?.user?.name || "Developer";
  const userAvatar = userSession?.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120";

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* TOP BRAND NAVBAR */}
        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => navigation.navigate("ProfileTab")} style={[styles.userAvatarBox, { borderColor: colors.cardBorder }]}>
            <Image
              source={{ uri: userAvatar }}
              style={styles.avatarImg}
            />
          </TouchableOpacity>
          <Text style={[styles.brandTitle, { color: colors.foreground }]}>BuildVerse</Text>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.elevated }]}>
            <Ionicons name="search" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* HERO HEADER SECTION WITH DYNAMIC USER NAME */}
        <View style={styles.heroHeader}>
          <Text style={[styles.dashBadge, { color: colors.amber }]}>DASHBOARD</Text>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>Welcome back, {userName}</Text>
          <Text style={[styles.heroSubtitle, { color: colors.muted }]}>
            You have 3 shipping goals today. Let's build something remarkable.
          </Text>
        </View>

        {/* ACTIVE PROJECTS HORIZONTAL SCROLL */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Active Projects</Text>
          <TouchableOpacity onPress={() => navigation.navigate("ProjectsTab")}>
            <Text style={[styles.viewAllText, { color: colors.amber }]}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {ACTIVE_PROJECTS.map((proj) => (
            <GlassCard key={proj.id} elevated style={styles.activeProjectCard}>
              <View style={styles.cardHeaderRow}>
                <View style={[styles.iconBox, { backgroundColor: colors.primary }]}>
                  <Ionicons name={proj.icon} size={20} color={isDarkMode ? "#000" : "#FFF"} />
                </View>
                <View style={[styles.tagBadge, { backgroundColor: colors.elevated }]}>
                  <Text style={[styles.tagBadgeText, { color: colors.muted }]}>{proj.tag}</Text>
                </View>
              </View>

              <Text style={[styles.projectName, { color: colors.foreground }]}>{proj.name}</Text>
              <Text style={[styles.projectSubtitle, { color: colors.muted }]}>{proj.subtitle}</Text>

              {proj.progress !== undefined ? (
                <View style={styles.progressBox}>
                  <View style={styles.progressLabelRow}>
                    <Text style={[styles.progressLabel, { color: colors.muted }]}>Progress</Text>
                    <Text style={[styles.progressVal, { color: colors.foreground }]}>{proj.progress}%</Text>
                  </View>
                  <View style={[styles.progressTrack, { backgroundColor: colors.elevated }]}>
                    <View style={[styles.progressFill, { width: `${proj.progress}%`, backgroundColor: colors.amber }]} />
                  </View>
                </View>
              ) : (
                <View style={styles.pendingRow}>
                  <Ionicons name="alert-circle" size={16} color={colors.amber} />
                  <Text style={[styles.pendingText, { color: colors.foreground }]}>{proj.pendingTasks} pending tasks</Text>
                </View>
              )}
            </GlassCard>
          ))}
        </ScrollView>

        {/* DEVELOPER METRICS (3-CARD ROW) */}
        <View style={styles.metricsRow}>
          <GlassCard style={styles.metricCard}>
            <Text style={[styles.metricNum, { color: colors.foreground }]}>42</Text>
            <Text style={[styles.metricLabel, { color: colors.muted }]}>Commits Week</Text>
          </GlassCard>

          <GlassCard style={styles.metricCard}>
            <Text style={[styles.metricNum, { color: colors.foreground }]}>12</Text>
            <Text style={[styles.metricLabel, { color: colors.muted }]}>PRs Merged</Text>
          </GlassCard>

          <GlassCard style={styles.metricCard}>
            <Text style={[styles.metricNum, { color: colors.foreground }]}>8</Text>
            <Text style={[styles.metricLabel, { color: colors.muted }]}>Communities</Text>
          </GlassCard>
        </View>

        {/* RECENT ACTIVITY FEED (INTERACTIVE CLICKABLE ITEMS) */}
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 16 }]}>Recent Activity</Text>
        <GlassCard elevated style={styles.activityFeedCard}>
          {RECENT_ACTIVITIES.map((act, index) => (
            <TouchableOpacity
              key={act.id}
              activeOpacity={0.7}
              onPress={() => setSelectedActivity(act)}
              style={[styles.activityItem, index < RECENT_ACTIVITIES.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            >
              <View style={[styles.actIconBox, { backgroundColor: colors.elevated }, act.isError && styles.errorIconBox, act.isEvent && styles.eventIconBox]}>
                <Ionicons
                  name={act.icon}
                  size={18}
                  color={act.isError ? colors.danger : act.isEvent ? colors.amber : colors.foreground}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.actUserText, { color: colors.foreground }]}>
                  <Text style={{ fontWeight: "700" }}>{act.user}</Text> {act.action}
                </Text>
                <Text style={[styles.actTimeText, { color: colors.subtle }]}>{act.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.subtle} />
            </TouchableOpacity>
          ))}
        </GlassCard>

        {/* CRAFT MODULES SECTION */}
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 16 }]}>Craft Learning Modules</Text>
        {MODULE_DETAILS.map((mod) => (
          <TouchableOpacity
            key={mod.id}
            activeOpacity={0.7}
            onPress={() => setSelectedModule(mod)}
          >
            <GlassCard elevated style={styles.moduleCard}>
              <View style={styles.moduleHeaderRow}>
                <View style={[styles.moduleIconBox, { backgroundColor: colors.elevated }]}>
                  <Ionicons name={mod.icon} size={20} color={colors.foreground} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.moduleTitle, { color: colors.foreground }]}>{mod.title}</Text>
                  <Text style={[styles.moduleSub, { color: colors.amber }]}>{mod.moduleNumber} • {mod.duration}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.subtle} />
              </View>
            </GlassCard>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* RECENT ACTIVITY DETAIL MODAL */}
      <Modal visible={!!selectedActivity} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard elevated style={[styles.activityModalCard, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actModalBadge, { color: colors.amber }]}>{selectedActivity?.time}</Text>
                <Text style={[styles.actModalTitle, { color: colors.foreground }]}>{selectedActivity?.user}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedActivity(null)}>
                <Ionicons name="close-circle" size={26} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.actModalActionText, { color: colors.muted }]}>{selectedActivity?.action}</Text>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {selectedActivity?.commits ? (
              <View>
                <Text style={[styles.subHeading, { color: colors.foreground }]}>Repo: {selectedActivity.repo}</Text>
                <Text style={[styles.branchBadge, { color: colors.amber }]}>Branch: {selectedActivity.branch} ({selectedActivity.stats})</Text>
                <Text style={[styles.subHeading, { color: colors.foreground, marginTop: 12 }]}>Commit History:</Text>
                {selectedActivity.commits.map((c, idx) => (
                  <View key={idx} style={styles.commitRow}>
                    <Ionicons name="git-commit" size={16} color={colors.amber} />
                    <Text style={[styles.commitText, { color: colors.foreground }]}>{c}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {selectedActivity?.issueId ? (
              <View>
                <Text style={[styles.subHeading, { color: colors.foreground }]}>Issue {selectedActivity.issueId} • {selectedActivity.repo}</Text>
                <View style={styles.priorityBadge}>
                  <Text style={[styles.priorityText, { color: colors.danger }]}>Priority: {selectedActivity.priority}</Text>
                </View>
                <Text style={[styles.issueDescText, { color: colors.muted }]}>{selectedActivity.description}</Text>
              </View>
            ) : null}

            {selectedActivity?.eventTitle ? (
              <View>
                <Text style={[styles.eventTitleText, { color: colors.foreground }]}>{selectedActivity.eventTitle}</Text>
                <Text style={[styles.eventLocText, { color: colors.muted }]}>📍 {selectedActivity.location}</Text>
                <Text style={[styles.eventAttendeesText, { color: colors.amber }]}>👥 {selectedActivity.attendees} Developers Registered</Text>
              </View>
            ) : null}

            <CustomButton
              title="Close Details"
              variant="primary"
              size="lg"
              style={{ marginTop: 20 }}
              onPress={() => setSelectedActivity(null)}
            />
          </GlassCard>
        </View>
      </Modal>

      {/* MODULE DETAIL SUB-PAGE MODAL */}
      <Modal visible={!!selectedModule} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard elevated style={[styles.moduleModalCard, { backgroundColor: colors.card }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalModuleBadge, { color: colors.amber }]}>
                    {selectedModule?.moduleNumber} • {selectedModule?.duration}
                  </Text>
                  <Text style={[styles.modalTitle, { color: colors.foreground }]}>{selectedModule?.title}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedModule(null)}>
                  <Ionicons name="close-circle" size={26} color={colors.muted} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalSummary, { color: colors.muted }]}>{selectedModule?.summary}</Text>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <Text style={[styles.subHeading, { color: colors.foreground }]}>Curriculum Breakdown & Topics</Text>
              {selectedModule?.topics.map((topic, idx) => (
                <View key={idx} style={styles.topicRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.amber} />
                  <Text style={[styles.topicText, { color: colors.foreground }]}>{topic}</Text>
                </View>
              ))}

              <CustomButton
                title="Start Learning Module"
                variant="primary"
                size="lg"
                style={{ marginTop: 20, marginBottom: 10 }}
                icon={<Ionicons name="play" size={18} color={isDarkMode ? "#000" : "#FFF"} />}
                onPress={() => {
                  const modTitle = selectedModule?.title;
                  setSelectedModule(null);
                  navigation.navigate("LearningScreen", { title: modTitle });
                }}
              />
            </ScrollView>
          </GlassCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20, paddingBottom: 48 },
  navRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 16 },
  userAvatarBox: { width: 34, height: 34, borderRadius: 17, overflow: "hidden", borderWidth: 1 },
  avatarImg: { width: "100%", height: "100%" },
  brandTitle: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  iconBtn: { padding: 6, borderRadius: 9999 },
  heroHeader: { marginBottom: 20 },
  dashBadge: { fontSize: 11, fontWeight: "700", letterSpacing: 1.5, marginBottom: 4 },
  heroTitle: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5, marginBottom: 4 },
  heroSubtitle: { fontSize: 13, lineHeight: 18 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  viewAllText: { fontSize: 12, fontWeight: "600" },
  horizontalScroll: { marginLeft: -20, paddingLeft: 20, marginBottom: 20 },
  activeProjectCard: { width: 250, marginRight: 12, padding: 18 },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  tagBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  tagBadgeText: { fontSize: 9, fontWeight: "700", textTransform: "uppercase" },
  projectName: { fontSize: 16, fontWeight: "800", marginBottom: 2 },
  projectSubtitle: { fontSize: 12, marginBottom: 14 },
  progressBox: { marginTop: 4 },
  progressLabelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  progressLabel: { fontSize: 11 },
  progressVal: { fontSize: 11, fontWeight: "800" },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  pendingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  pendingText: { fontSize: 12, fontWeight: "600", marginLeft: 6 },
  metricsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  metricCard: { flex: 1, marginHorizontal: 3, padding: 12, alignItems: "center" },
  metricNum: { fontSize: 20, fontWeight: "800" },
  metricLabel: { fontSize: 10, marginTop: 2, textAlign: "center" },
  activityFeedCard: { padding: 0, marginBottom: 20, overflow: "hidden" },
  activityItem: { flexDirection: "row", alignItems: "center", padding: 14 },
  actIconBox: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  errorIconBox: { backgroundColor: "rgba(220, 38, 38, 0.12)" },
  eventIconBox: { backgroundColor: "rgba(245, 158, 11, 0.12)" },
  actUserText: { fontSize: 13, lineHeight: 18 },
  actTimeText: { fontSize: 9, fontWeight: "700", marginTop: 2 },
  moduleCard: { padding: 14, marginBottom: 8 },
  moduleHeaderRow: { flexDirection: "row", alignItems: "center" },
  moduleIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  moduleTitle: { fontSize: 15, fontWeight: "700" },
  moduleSub: { fontSize: 11, fontWeight: "600", marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.8)", justifyContent: "center", alignItems: "center", padding: 20 },
  activityModalCard: { width: "100%", padding: 20 },
  actModalBadge: { fontSize: 11, fontWeight: "700", marginBottom: 2 },
  actModalTitle: { fontSize: 22, fontWeight: "800" },
  actModalActionText: { fontSize: 14, marginTop: 4 },
  divider: { height: 1, marginVertical: 14 },
  subHeading: { fontSize: 14, fontWeight: "700", marginBottom: 6 },
  branchBadge: { fontSize: 12, fontWeight: "600", marginBottom: 8 },
  commitRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  commitText: { fontSize: 12, marginLeft: 8, flex: 1 },
  priorityBadge: { backgroundColor: "rgba(220, 38, 38, 0.12)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: "flex-start", marginBottom: 8 },
  priorityText: { fontSize: 10, fontWeight: "700" },
  issueDescText: { fontSize: 13, lineHeight: 18 },
  eventTitleText: { fontSize: 16, fontWeight: "800", marginBottom: 6 },
  eventLocText: { fontSize: 13, marginBottom: 4 },
  eventAttendeesText: { fontSize: 12, fontWeight: "600" },
  moduleModalCard: { width: "100%", maxHeight: "85%", padding: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  modalModuleBadge: { fontSize: 12, fontWeight: "700", marginBottom: 4 },
  modalTitle: { fontSize: 22, fontWeight: "800" },
  modalSummary: { fontSize: 14, lineHeight: 20 },
  topicRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  topicText: { fontSize: 13, marginLeft: 10, flex: 1 },
});
