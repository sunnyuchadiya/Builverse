import React from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "../components/GlassCard";
import CustomButton from "../components/CustomButton";
import { theme } from "../theme";

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>Account</Text>
          <Text style={styles.title}>User Profile</Text>
        </View>

        {/* PROFILE CARD */}
        <GlassCard elevated style={styles.profileCard}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200" }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>Nexus Engineer</Text>
          <Text style={styles.userEmail}>developer@nexus.design</Text>

          <View style={styles.badgeRow}>
            <View style={styles.roleBadge}>
              <Ionicons name="shield-checkmark" size={14} color={theme.colors.primary} />
              <Text style={styles.roleText}>Pro Member</Text>
            </View>
            <View style={styles.roleBadge}>
              <Ionicons name="code-slash" size={14} color={theme.colors.indigo} />
              <Text style={styles.indigoText}>Design Engineer</Text>
            </View>
          </View>
        </GlassCard>

        {/* STATS METRICS */}
        <View style={styles.statsRow}>
          <GlassCard style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </GlassCard>
          <GlassCard style={styles.statBox}>
            <Text style={styles.statNumber}>48</Text>
            <Text style={styles.statLabel}>Issues Fixed</Text>
          </GlassCard>
          <GlassCard style={styles.statBox}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Uptime</Text>
          </GlassCard>
        </View>

        {/* SETTINGS OPTIONS */}
        <Text style={styles.sectionHeader}>Preferences & Account</Text>

        <GlassCard style={styles.menuCard}>
          <View style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={20} color={theme.colors.foreground} />
            <Text style={styles.menuText}>Push Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.subtle} />
          </View>

          <View style={styles.divider} />

          <View style={styles.menuItem}>
            <Ionicons name="key-outline" size={20} color={theme.colors.foreground} />
            <Text style={styles.menuText}>MongoDB JWT Security Tokens</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.subtle} />
          </View>

          <View style={styles.divider} />

          <View style={styles.menuItem}>
            <Ionicons name="phone-portrait-outline" size={20} color={theme.colors.foreground} />
            <Text style={styles.menuText}>Android Emulator Mode</Text>
            <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
          </View>
        </GlassCard>

        <CustomButton
          title="Sign Out / Switch Account"
          variant="outline"
          size="lg"
          style={styles.logoutButton}
          onPress={() => navigation.navigate("LoginScreen")}
        />
      </ScrollView>
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
  header: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  title: {
    ...theme.font.h1,
    fontSize: 24,
  },
  profileCard: {
    alignItems: "center",
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2.5),
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginBottom: theme.spacing(1.5),
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.foreground,
  },
  userEmail: {
    fontSize: 13,
    color: theme.colors.muted,
    marginBottom: theme.spacing(1.5),
  },
  badgeRow: {
    flexDirection: "row",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.elevated,
    paddingHorizontal: theme.spacing(1.5),
    paddingVertical: theme.spacing(0.6),
    borderRadius: theme.radius.pill,
    marginHorizontal: theme.spacing(0.5),
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
    marginLeft: 6,
  },
  indigoText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.indigo,
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing(3),
  },
  statBox: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
    padding: theme.spacing(2),
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.foreground,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.muted,
    marginTop: 2,
  },
  sectionHeader: {
    ...theme.font.h3,
    fontSize: 16,
    marginBottom: theme.spacing(1.5),
  },
  menuCard: {
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing(1.2),
    paddingHorizontal: theme.spacing(1),
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.foreground,
    marginLeft: theme.spacing(1.5),
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 4,
  },
  logoutButton: {
    borderColor: theme.colors.danger,
  },
});
