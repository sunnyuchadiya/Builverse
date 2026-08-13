import React, { useEffect, useState } from "react";
import {
  Modal,
  RefreshControl,
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
import IssueItem from "../components/IssueItem";
import CustomButton from "../components/CustomButton";
import { fetchProjects, fetchIssues, toggleIssueResolvedApi } from "../lib/api";
import { theme } from "../theme";

// Generate 28-day GitHub style contribution matrix
const GENERATE_HEATMAP = () => {
  const days = [];
  const now = new Date();
  for (let i = 27; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    // Random level 0-3 for realistic density
    const count = [0, 2, 5, 8, 1, 0, 4, 12, 3, 6, 0, 9, 4, 7][i % 14];
    const level = count === 0 ? 0 : count <= 3 ? 1 : count <= 7 ? 2 : 3;
    days.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count,
      level,
    });
  }
  return days;
};

export default function DashboardScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [issueFilter, setIssueFilter] = useState("all"); // all | pending | resolved

  // Modals state
  const [selectedDay, setSelectedDay] = useState(null);
  const [showAddIssueModal, setShowAddIssueModal] = useState(false);
  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssuePriority, setNewIssuePriority] = useState("Medium");

  const heatmapDays = GENERATE_HEATMAP();

  const loadData = async () => {
    setRefreshing(true);
    const [pList, iList] = await Promise.all([fetchProjects(), fetchIssues()]);
    setProjects(pList);
    setIssues(iList);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleIssue = async (id) => {
    setIssues((prev) =>
      prev.map((item) => (item.id === id ? { ...item, resolved: !item.resolved } : item))
    );
    const target = issues.find((i) => i.id === id);
    if (target) {
      await toggleIssueResolvedApi(id, target.resolved);
    }
  };

  const handleAddIssue = () => {
    if (!newIssueTitle.trim()) return;
    const createdIssue = {
      id: `i_${Date.now()}`,
      project_id: projects[0]?.id || "p1",
      title: newIssueTitle.trim(),
      priority: newIssuePriority,
      resolved: false,
      resolved_at: null,
    };
    setIssues((prev) => [createdIssue, ...prev]);
    setNewIssueTitle("");
    setShowAddIssueModal(false);
  };

  const filteredIssues = issues.filter((i) => {
    if (issueFilter === "pending") return !i.resolved;
    if (issueFilter === "resolved") return i.resolved;
    return true;
  });

  const activeProjectsCount = projects.filter((p) => p.status === "active").length;
  const resolvedIssuesCount = issues.filter((i) => i.resolved).length;
  const openIssuesCount = issues.filter((i) => !i.resolved).length;
  const velocityRate =
    issues.length > 0 ? Math.round((resolvedIssuesCount / issues.length) * 100) : 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadData}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* HEADER WITH LIVE MONGO BADGE */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.dashboardTitle}>Workspace Overview</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowAddIssueModal(true)}
            style={styles.addIssueHeaderBtn}
          >
            <Ionicons name="add" size={18} color="#000" />
            <Text style={styles.addIssueHeaderText}>Issue</Text>
          </TouchableOpacity>
        </View>

        {/* 4-CARD METRICS GRID */}
        <View style={styles.statsGridRow}>
          <GlassCard style={styles.statCard}>
            <Ionicons name="folder-open-outline" size={20} color={theme.colors.indigo} />
            <Text style={styles.statNumber}>{activeProjectsCount}</Text>
            <Text style={styles.statLabel}>Active Projects</Text>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <Ionicons name="checkmark-done-circle-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{resolvedIssuesCount}</Text>
            <Text style={styles.statLabel}>Resolved Issues</Text>
          </GlassCard>
        </View>

        <View style={styles.statsGridRow}>
          <GlassCard style={styles.statCard}>
            <Ionicons name="alert-circle-outline" size={20} color={theme.colors.warning} />
            <Text style={styles.statNumber}>{openIssuesCount}</Text>
            <Text style={styles.statLabel}>Open Issues</Text>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <Ionicons name="flash-outline" size={20} color={theme.colors.purple} />
            <Text style={styles.statNumber}>{velocityRate}%</Text>
            <Text style={styles.statLabel}>Velocity Rate</Text>
          </GlassCard>
        </View>

        {/* GITHUB-STYLE CONTRIBUTION STREAK HEATMAP GRID */}
        <GlassCard elevated style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <View style={styles.streakTitleRow}>
              <Text style={styles.fireEmoji}>🔥</Text>
              <View>
                <Text style={styles.streakTitle}>14 Day Streak</Text>

                <Text style={styles.streakSub}>Longest: 32 days • 142 commits this month</Text>
              </View>
            </View>
            <View style={styles.levelLegendRow}>
              <Text style={styles.legendText}>Less</Text>
              <View style={[styles.legendBox, styles.level0]} />
              <View style={[styles.legendBox, styles.level1]} />
              <View style={[styles.legendBox, styles.level2]} />
              <View style={[styles.legendBox, styles.level3]} />
              <Text style={styles.legendText}>More</Text>
            </View>
          </View>

          {/* 4 WEEKS × 7 DAYS GRID */}
          <Text style={styles.clickHint}>Tap any day cell to view activity details</Text>
          <View style={styles.heatmapGrid}>
            {heatmapDays.map((day, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => setSelectedDay(day)}
                style={[
                  styles.heatmapCell,
                  day.level === 0 && styles.level0,
                  day.level === 1 && styles.level1,
                  day.level === 2 && styles.level2,
                  day.level === 3 && styles.level3,
                ]}
              />
            ))}
          </View>
        </GlassCard>

        {/* WORKSPACE ISSUES MANAGEMENT SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Workspace Issues</Text>
          
          {/* ISSUE STATUS FILTER TABS */}
          <View style={styles.filterTabsRow}>
            {["all", "pending", "resolved"].map((tab) => (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.8}
                onPress={() => setIssueFilter(tab)}
                style={[styles.filterTab, issueFilter === tab && styles.filterTabActive]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    issueFilter === tab && styles.filterTabTextActive,
                  ]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {filteredIssues.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="sparkles-outline" size={24} color={theme.colors.muted} />
            <Text style={styles.emptyText}>No issues match this filter.</Text>
          </GlassCard>
        ) : (
          filteredIssues.map((issue) => (
            <IssueItem key={issue.id} issue={issue} onToggle={handleToggleIssue} />
          ))
        )}
      </ScrollView>

      {/* HEATMAP DAY DETAIL MODAL */}
      <Modal visible={!!selectedDay} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <GlassCard elevated style={styles.detailModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Activity: {selectedDay?.date}</Text>
              <TouchableOpacity onPress={() => setSelectedDay(null)}>
                <Ionicons name="close" size={22} color={theme.colors.muted} />
              </TouchableOpacity>
            </View>

            <View style={styles.activityLogBox}>
              <Ionicons name="git-commit" size={20} color={theme.colors.primary} />
              <Text style={styles.logText}>
                {selectedDay?.count || 0} commits & PR reviews logged on this day.
              </Text>
            </View>

            <Text style={styles.logSubText}>
              All contributions are synced with your MongoDB workspace account.
            </Text>

            <CustomButton
              title="Close"
              variant="outline"
              size="md"
              style={{ marginTop: 16 }}
              onPress={() => setSelectedDay(null)}
            />
          </GlassCard>
        </View>
      </Modal>

      {/* QUICK ADD ISSUE MODAL */}
      <Modal visible={showAddIssueModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard elevated style={styles.detailModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Workspace Issue</Text>
              <TouchableOpacity onPress={() => setShowAddIssueModal(false)}>
                <Ionicons name="close" size={22} color={theme.colors.muted} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Issue title (e.g. Add MongoDB index)..."
              placeholderTextColor={theme.colors.subtle}
              value={newIssueTitle}
              onChangeText={setNewIssueTitle}
            />

            <Text style={styles.prioLabel}>Priority Level</Text>
            <View style={styles.prioRow}>
              {["High", "Medium", "Low"].map((prio) => (
                <TouchableOpacity
                  key={prio}
                  activeOpacity={0.8}
                  onPress={() => setNewIssuePriority(prio)}
                  style={[
                    styles.prioBadge,
                    newIssuePriority === prio && styles.prioBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.prioText,
                      newIssuePriority === prio && styles.prioTextActive,
                    ]}
                  >
                    {prio}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <CustomButton
              title="Create Issue"
              variant="primary"
              size="lg"
              style={{ marginTop: 20 }}
              onPress={handleAddIssue}
            />
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
    padding: theme.spacing(2.5),
    paddingBottom: theme.spacing(6),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2.5),
    marginTop: theme.spacing(1),
  },
  greeting: {
    fontSize: 13,
    color: theme.colors.muted,
    marginBottom: 2,
  },
  dashboardTitle: {
    ...theme.font.h1,
    fontSize: 24,
  },
  addIssueHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing(1.5),
    paddingVertical: theme.spacing(0.8),
    borderRadius: theme.radius.pill,
    ...theme.shadows.glow,
  },
  addIssueHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000000",
    marginLeft: 4,
  },
  statsGridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing(1.5),
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: theme.spacing(1.8),
    alignItems: "flex-start",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.foreground,
    marginVertical: theme.spacing(0.5),
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.muted,
  },
  streakCard: {
    padding: theme.spacing(2.5),
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1),
  },
  streakHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing(1.5),
  },
  streakTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  fireEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  streakTitle: {
    ...theme.font.h3,
    fontSize: 16,
  },
  streakSub: {
    fontSize: 11,
    color: theme.colors.muted,
    marginTop: 2,
  },
  levelLegendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendText: {
    fontSize: 9,
    color: theme.colors.subtle,
    marginHorizontal: 3,
  },
  legendBox: {
    width: 8,
    height: 8,
    borderRadius: 2,
    marginHorizontal: 1.5,
  },
  clickHint: {
    fontSize: 10,
    color: theme.colors.subtle,
    marginBottom: 8,
  },
  heatmapGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  heatmapCell: {
    width: "12%",
    height: 24,
    borderRadius: 4,
    marginVertical: 4,
  },
  level0: {
    backgroundColor: theme.colors.elevated,
  },
  level1: {
    backgroundColor: "rgba(16, 185, 129, 0.3)",
  },
  level2: {
    backgroundColor: "rgba(16, 185, 129, 0.65)",
  },
  level3: {
    backgroundColor: theme.colors.primary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(1.5),
    marginTop: theme.spacing(1),
  },
  sectionTitle: {
    ...theme.font.h2,
    fontSize: 18,
  },
  filterTabsRow: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.pill,
    padding: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterTab: {
    paddingHorizontal: theme.spacing(1.2),
    paddingVertical: theme.spacing(0.5),
    borderRadius: theme.radius.pill,
  },
  filterTabActive: {
    backgroundColor: theme.colors.elevated,
  },
  filterTabText: {
    fontSize: 11,
    color: theme.colors.muted,
  },
  filterTabTextActive: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  emptyCard: {
    padding: theme.spacing(3),
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2.5),
  },
  detailModalCard: {
    width: "100%",
    padding: theme.spacing(2.5),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.foreground,
  },
  activityLogBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.elevated,
    padding: theme.spacing(1.5),
    borderRadius: theme.radius.md,
    marginBottom: 8,
  },
  logText: {
    fontSize: 13,
    color: theme.colors.foreground,
    marginLeft: 10,
    flex: 1,
  },
  logSubText: {
    fontSize: 11,
    color: theme.colors.subtle,
  },
  modalInput: {
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing(1.5),
    paddingVertical: theme.spacing(1.2),
    color: theme.colors.foreground,
    fontSize: 14,
    marginBottom: 16,
  },
  prioLabel: {
    fontSize: 12,
    color: theme.colors.muted,
    marginBottom: 8,
  },
  prioRow: {
    flexDirection: "row",
  },
  prioBadge: {
    flex: 1,
    paddingVertical: theme.spacing(0.8),
    alignItems: "center",
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.elevated,
    marginRight: 6,
  },
  prioBadgeActive: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  prioText: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  prioTextActive: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
});
