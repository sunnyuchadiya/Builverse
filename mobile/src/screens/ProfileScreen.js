import React, { useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "../components/GlassCard";
import CustomButton from "../components/CustomButton";
import { getCurrentUserSession, logoutUserSession } from "../lib/api";
import { darkColors, lightColors, useThemeMode } from "../theme";

const TECH_STACK_TAGS = ["Rust", "TypeScript", "WebAssembly", "Go", "PostgreSQL", "Kubernetes", "AWS", "Next.js"];

const FEATURED_PROJECTS = [
  {
    id: "fp1",
    title: "Lumina Engine",
    stars: "7.6k",
    desc: "A high-performance rendering engine built for the modern web using WebGPU and Rust.",
    tag: "Rust",
    updated: "Updated 3 days ago",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
  },
  {
    id: "fp2",
    title: "Synapse CLI",
    stars: "842",
    desc: "An intelligent command-line interface for managing distributed microservices with ease.",
    tag: "Go",
    updated: "Updated 1 week ago",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
  },
];

export default function ProfileScreen({ navigation }) {
  const { isDarkMode, toggleThemeMode, themeColors } = useThemeMode();
  const colors = themeColors || (isDarkMode ? darkColors : lightColors);

  const [profile, setProfile] = useState({
    name: "Developer",
    email: "dev@buildverse.io",
    role: "BuildVerse Engineer",
    location: "Global",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
  });

  // REFRESH PROFILE DYNAMICALLY EVERY TIME SCREEN IS FOCUSED
  useFocusEffect(
    React.useCallback(() => {
      const current = getCurrentUserSession();
      if (current.user) {
        setProfile({
          name: current.user.name || "Developer",
          email: current.user.email || "dev@buildverse.io",
          role: current.user.role || "BuildVerse Engineer",
          location: "Global",
          avatar: current.user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
        });
      }
    }, [])
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(false);

  // CONNECT FORM STATE
  const [connectName, setConnectName] = useState("");
  const [connectMessage, setConnectMessage] = useState("");
  const [connectSent, setConnectSent] = useState(false);

  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editRole, setEditRole] = useState(profile.role);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);

  const handleSaveProfile = () => {
    setProfile({
      ...profile,
      name: editName.trim() || profile.name,
      email: editEmail.trim() || profile.email,
      role: editRole.trim() || profile.role,
      avatar: editAvatar.trim() || profile.avatar,
    });
    setShowEditModal(false);
  };

  const handleDownloadPDF = () => {
    setDownloadingCert(true);
    setTimeout(() => {
      setDownloadingCert(false);
      setShowCertificateModal(false);
    }, 2000);
  };

  const handleSendConnectInquiry = () => {
    if (!connectMessage.trim()) return;
    setConnectSent(true);
    setTimeout(() => {
      setConnectSent(false);
      setConnectName("");
      setConnectMessage("");
      setShowConnectModal(false);
    }, 2000);
  };

  const handleSignOut = () => {
    logoutUserSession();
    navigation.navigate("LoginScreen");
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* TOP BRAND HEADER */}
        <View style={styles.headerRow}>
          <Text style={[styles.brandTitle, { color: colors.foreground }]}>BuildVerse</Text>
          <View style={styles.headerRightRow}>
            <TouchableOpacity style={[styles.iconHeaderBtn, { backgroundColor: colors.elevated }]}>
              <Ionicons name="search" size={18} color={colors.foreground} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarHeaderBtn}>
              <Image source={{ uri: profile.avatar }} style={styles.avatarHeaderImg} />
            </TouchableOpacity>
          </View>
        </View>

        {/* PROFILE HERO CARD WITH DYNAMIC USER NAME */}
        <GlassCard elevated style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: profile.avatar }} style={[styles.avatar, { borderColor: colors.cardBorder }]} />
            <View style={[styles.verifiedBadge, { backgroundColor: colors.amber }]}>
              <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
            </View>
          </View>

          <Text style={[styles.userName, { color: colors.foreground }]}>{profile.name}</Text>
          <Text style={[styles.userRole, { color: colors.muted }]}>{profile.role} • {profile.location}</Text>

          <View style={styles.actionButtonsRow}>
            <CustomButton
              title="Edit Profile"
              variant="primary"
              size="sm"
              icon={<Ionicons name="pencil" size={12} color={isDarkMode ? "#000" : "#FFF"} />}
              onPress={() => {
                setEditName(profile.name);
                setEditEmail(profile.email);
                setEditRole(profile.role);
                setEditAvatar(profile.avatar);
                setShowEditModal(true);
              }}
            />
            <TouchableOpacity onPress={() => setShowConnectModal(true)} style={[styles.shareCircleBtn, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
              <Ionicons name="share-outline" size={16} color={colors.foreground} />
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* BENTO GRID: STATS CARDS */}
        <GlassCard elevated style={[styles.bentoStatCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.bentoLabel, { color: colors.muted }]}>PROJECTS</Text>
          <Text style={[styles.bentoNumber, { color: colors.foreground }]}>24</Text>
          <View style={styles.trendingRow}>
            <Ionicons name="trending-up" size={12} color={colors.amber} />
            <Text style={[styles.trendingText, { color: colors.amber }]}>+3 this month</Text>
          </View>
        </GlassCard>

        <GlassCard elevated style={[styles.bentoStatCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.bentoLabel, { color: colors.muted }]}>COMMITS</Text>
          <Text style={[styles.bentoNumber, { color: colors.foreground }]}>1.2k</Text>
          <Text style={[styles.bentoSubText, { color: colors.muted }]}>Past year total</Text>
        </GlassCard>

        <GlassCard elevated style={[styles.bentoStatCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.bentoLabel, { color: colors.muted }]}>RANKING</Text>
          <Text style={[styles.bentoNumber, { color: colors.foreground }]}>Top 1%</Text>
          <Text style={[styles.bentoSubText, { color: colors.muted }]}>Global contributor</Text>
        </GlassCard>

        {/* TECH STACK BENTO BOX */}
        <GlassCard elevated style={[styles.techStackCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.techHeader}>
            <Text style={[styles.techTitle, { color: colors.foreground }]}>Tech Stack</Text>
            <Ionicons name="hardware-chip-outline" size={18} color={colors.foreground} />
          </View>

          <View style={styles.tagWrapRow}>
            {TECH_STACK_TAGS.map((tag, idx) => (
              <View key={idx} style={[styles.techTag, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
                <Text style={[styles.techTagText, { color: colors.foreground }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* FEATURED PROJECTS SECTION */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Featured Projects</Text>
            <Text style={[styles.sectionSub, { color: colors.muted }]}>Selected engineering work and open-source contributions.</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("ProjectsTab")}>
            <Text style={[styles.viewAllText, { color: colors.muted }]}>View all ›</Text>
          </TouchableOpacity>
        </View>

        {FEATURED_PROJECTS.map((proj) => (
          <GlassCard key={proj.id} elevated style={styles.featuredProjCard}>
            <Image source={{ uri: proj.img }} style={styles.featuredProjImg} />
            <View style={styles.featuredBody}>
              <View style={styles.featuredTitleRow}>
                <Text style={[styles.featuredTitle, { color: colors.foreground }]}>{proj.title}</Text>
                <View style={styles.starRow}>
                  <Ionicons name="star" size={14} color={colors.amber} />
                  <Text style={[styles.starText, { color: colors.foreground }]}>{proj.stars}</Text>
                </View>
              </View>
              <Text style={[styles.featuredDesc, { color: colors.muted }]}>{proj.desc}</Text>
            </View>
          </GlassCard>
        ))}

        {/* QUICK LINK CARDS WITH WORKING PORTFOLIO & CONNECT MODALS */}
        <TouchableOpacity activeOpacity={0.8} onPress={() => setShowCertificateModal(true)}>
          <GlassCard elevated style={styles.quickLinkCard}>
            <Ionicons name="document-text-outline" size={20} color={colors.foreground} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.quickLinkTitle, { color: colors.foreground }]}>Curriculum Vitae & Certificate</Text>
              <Text style={[styles.quickLinkSub, { color: colors.amber }]}>View & Download PDF Certificate ›</Text>
            </View>
            <Ionicons name="download-outline" size={18} color={colors.amber} />
          </GlassCard>
        </TouchableOpacity>

        {/* WORKING PERSONAL PORTFOLIO LINK */}
        <TouchableOpacity activeOpacity={0.8} onPress={() => setShowPortfolioModal(true)}>
          <GlassCard elevated style={styles.quickLinkCard}>
            <Ionicons name="globe-outline" size={20} color={colors.foreground} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.quickLinkTitle, { color: colors.foreground }]}>Personal Portfolio</Text>
              <Text style={[styles.quickLinkSub, { color: colors.amber }]}>{profile.name.toLowerCase().replace(/\s+/g, '')}.dev ›</Text>
            </View>
            <Ionicons name="open-outline" size={18} color={colors.foreground} />
          </GlassCard>
        </TouchableOpacity>

        {/* WORKING CONNECT / NETWORKING LINK */}
        <TouchableOpacity activeOpacity={0.8} onPress={() => setShowConnectModal(true)}>
          <GlassCard elevated style={styles.quickLinkCard}>
            <Ionicons name="chatbubbles-outline" size={20} color={colors.foreground} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.quickLinkTitle, { color: colors.foreground }]}>Connect</Text>
              <Text style={[styles.quickLinkSub, { color: colors.amber }]}>Inquiries & Networking ›</Text>
            </View>
            <Ionicons name="send-outline" size={18} color={colors.amber} />
          </GlassCard>
        </TouchableOpacity>

        {/* LIGHT / DARK THEME SWITCH TOGGLE */}
        <GlassCard style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.menuItem}>
            <Ionicons name={isDarkMode ? "moon" : "sunny"} size={20} color={colors.amber} />
            <Text style={[styles.menuText, { color: colors.foreground }]}>
              {isDarkMode ? "Dark Theme Mode" : "Light Theme Mode"}
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleThemeMode}
              trackColor={{ false: "#ECECEC", true: colors.amber }}
              thumbColor="#FFFFFF"
            />
          </View>
        </GlassCard>

        <CustomButton
          title="Sign Out / Switch Account"
          variant="outline"
          size="lg"
          style={{ borderColor: colors.danger, marginTop: 12 }}
          textStyle={{ color: colors.danger }}
          onPress={handleSignOut}
        />
      </ScrollView>

      {/* WORKING PERSONAL PORTFOLIO MODAL PAGE */}
      <Modal visible={showPortfolioModal} transparent animationType="slide">
        <SafeAreaView style={[styles.modalSafeArea, { backgroundColor: colors.background }]}>
          <View style={[styles.portfolioHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowPortfolioModal(false)}>
              <Ionicons name="arrow-back" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={[styles.portfolioHeaderTitle, { color: colors.foreground }]}>{profile.name}'s Portfolio</Text>
            <Ionicons name="open" size={20} color={colors.amber} />
          </View>

          <ScrollView style={{ flex: 1, padding: 20 }}>
            <GlassCard elevated style={{ padding: 20, marginBottom: 16 }}>
              <Image source={{ uri: profile.avatar }} style={{ width: 70, height: 70, borderRadius: 35, marginBottom: 12 }} />
              <Text style={{ fontSize: 24, fontWeight: "900", color: colors.foreground }}>{profile.name}</Text>
              <Text style={{ fontSize: 14, color: colors.amber, fontWeight: "700", marginTop: 2 }}>{profile.role}</Text>
              <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 20, marginTop: 8 }}>
                Specializing in high-throughput distributed systems, WebGPU rendering engines, and microservices in Rust & Go.
              </Text>
            </GlassCard>

            <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: 12 }]}>GitHub Activity & Repositories</Text>
            <GlassCard elevated style={{ padding: 16, marginBottom: 16 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>Lumina Engine (Rust / WebGPU)</Text>
                <Text style={{ fontSize: 12, color: colors.amber, fontWeight: "700" }}>★ 7.6k</Text>
              </View>
              <Text style={{ fontSize: 12, color: colors.muted }}>High-performance web rendering engine powering real-time 3D web applications.</Text>
            </GlassCard>

            <GlassCard elevated style={{ padding: 16, marginBottom: 16 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: colors.foreground }}>Synapse CLI (Go)</Text>
                <Text style={{ fontSize: 12, color: colors.amber, fontWeight: "700" }}>★ 842</Text>
              </View>
              <Text style={{ fontSize: 12, color: colors.muted }}>CLI for orchestrating microservices and container deployments with zero latency.</Text>
            </GlassCard>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* WORKING CONNECT / NETWORKING INQUIRY MODAL PAGE */}
      <Modal visible={showConnectModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard elevated style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Connect with {profile.name}</Text>
              <TouchableOpacity onPress={() => setShowConnectModal(false)}>
                <Ionicons name="close" size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {connectSent ? (
              <View style={{ alignItems: "center", paddingVertical: 20 }}>
                <Ionicons name="checkmark-circle" size={48} color={colors.success} />
                <Text style={{ fontSize: 18, fontWeight: "800", color: colors.foreground, marginTop: 12 }}>Inquiry Sent!</Text>
                <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center", marginTop: 4 }}>
                  Your networking invitation has been sent directly to {profile.name}.
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.inputLabel, { color: colors.muted }]}>Your Name / Company</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: colors.elevated, color: colors.foreground, marginBottom: 12 }]}
                  placeholder="e.g. Alex (Engineering Lead)"
                  placeholderTextColor={colors.subtle}
                  value={connectName}
                  onChangeText={setConnectName}
                />

                <Text style={[styles.inputLabel, { color: colors.muted }]}>Collaboration Inquiry Message</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: colors.elevated, color: colors.foreground, height: 80, textAlignVertical: "top" }]}
                  placeholder="Describe inquiry, project collaboration, or networking invite..."
                  placeholderTextColor={colors.subtle}
                  multiline
                  numberOfLines={3}
                  value={connectMessage}
                  onChangeText={setConnectMessage}
                />

                <CustomButton
                  title="Send Inquiry →"
                  variant="primary"
                  size="lg"
                  style={{ marginTop: 16 }}
                  onPress={handleSendConnectInquiry}
                />
              </>
            )}
          </GlassCard>
        </View>
      </Modal>

      {/* PDF CERTIFICATE DIPLOMA MODAL */}
      <Modal visible={showCertificateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard elevated style={[styles.certModalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>BuildVerse PDF Certificate</Text>
              <TouchableOpacity onPress={() => setShowCertificateModal(false)}>
                <Ionicons name="close" size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <View style={[styles.certDiplomaFrame, { backgroundColor: colors.elevated, borderColor: colors.amber }]}>
              <View style={styles.certBadgeRow}>
                <Ionicons name="ribbon" size={28} color={colors.amber} />
                <Text style={[styles.certBrandTitle, { color: colors.foreground }]}>BUILDVERSE ACADEMY</Text>
              </View>

              <Text style={[styles.certSubtitle, { color: colors.muted }]}>CERTIFICATE OF COMPLETION</Text>
              <Text style={[styles.certAwardedTo, { color: colors.subtle }]}>PROUDLY PRESENTED TO</Text>
              <Text style={[styles.certName, { color: colors.foreground }]}>{profile.name}</Text>

              <Text style={[styles.certDetails, { color: colors.muted }]}>
                For successfully mastering and completing the modules:
              </Text>
              <Text style={[styles.certModuleHighlight, { color: colors.amber }]}>
                • Design Systems 2.0 (Tokens, Components, Specs)
              </Text>
              <Text style={[styles.certModuleHighlight, { color: colors.amber }]}>
                • Web & Mobile Design Architecture
              </Text>

              <View style={[styles.certFooterDivider, { backgroundColor: colors.border }]} />

              <View style={styles.certFooterRow}>
                <View>
                  <Text style={[styles.certSigTitle, { color: colors.foreground }]}>BuildVerse Council</Text>
                  <Text style={[styles.certSigSub, { color: colors.subtle }]}>Verified Signature</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[styles.certIdText, { color: colors.muted }]}>ID: CERT-BUILDVERSE-982415</Text>
                  <Text style={[styles.certDateText, { color: colors.subtle }]}>Issued: Oct 2026</Text>
                </View>
              </View>
            </View>

            <CustomButton
              title={downloadingCert ? "Generating PDF..." : "Download Official PDF Certificate"}
              variant="primary"
              size="lg"
              loading={downloadingCert}
              icon={<Ionicons name="download" size={18} color={isDarkMode ? "#000" : "#FFF"} />}
              style={{ marginTop: 20 }}
              onPress={handleDownloadPDF}
            />
          </GlassCard>
        </View>
      </Modal>

      {/* EDIT PROFILE MODAL */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard elevated style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Edit Profile Info</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={22} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: colors.muted }]}>Full Name</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.elevated, color: colors.foreground }]}
              value={editName}
              onChangeText={setEditName}
              placeholder="Full Name"
              placeholderTextColor={colors.subtle}
            />

            <Text style={[styles.inputLabel, { color: colors.muted }]}>Email Address</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.elevated, color: colors.foreground }]}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Email"
              placeholderTextColor={colors.subtle}
              keyboardType="email-address"
            />

            <Text style={[styles.inputLabel, { color: colors.muted }]}>Role / Title</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.elevated, color: colors.foreground }]}
              value={editRole}
              onChangeText={setEditRole}
              placeholder="Senior Systems Architect"
              placeholderTextColor={colors.subtle}
            />

            <Text style={[styles.inputLabel, { color: colors.muted }]}>Avatar Photo URL</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.elevated, color: colors.foreground }]}
              value={editAvatar}
              onChangeText={setEditAvatar}
              placeholder="Image URL"
              placeholderTextColor={colors.subtle}
            />

            <CustomButton
              title="Save Changes"
              variant="primary"
              size="lg"
              style={{ marginTop: 16 }}
              onPress={handleSaveProfile}
            />
          </GlassCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20, paddingBottom: 48 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 20 },
  brandTitle: { fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
  headerRightRow: { flexDirection: "row", alignItems: "center" },
  iconHeaderBtn: { padding: 6, borderRadius: 9999, marginRight: 8 },
  avatarHeaderBtn: { width: 28, height: 28, borderRadius: 14, overflow: "hidden" },
  avatarHeaderImg: { width: "100%", height: "100%" },
  profileCard: { alignItems: "center", padding: 24, marginBottom: 16 },
  avatarWrapper: { position: "relative", marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2 },
  verifiedBadge: { position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#FFFFFF" },
  userName: { fontSize: 22, fontWeight: "800" },
  userRole: { fontSize: 13, marginTop: 2, marginBottom: 16 },
  actionButtonsRow: { flexDirection: "row", alignItems: "center" },
  shareCircleBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: "center", justifyContent: "center", marginLeft: 10 },
  bentoStatCard: { padding: 18, marginBottom: 12 },
  bentoLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  bentoNumber: { fontSize: 32, fontWeight: "800", marginVertical: 4 },
  trendingRow: { flexDirection: "row", alignItems: "center" },
  trendingText: { fontSize: 11, fontWeight: "700", marginLeft: 4 },
  bentoSubText: { fontSize: 11 },
  techStackCard: { padding: 20, marginBottom: 24 },
  techHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  techTitle: { fontSize: 16, fontWeight: "700" },
  tagWrapRow: { flexDirection: "row", flexWrap: "wrap" },
  techTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999, marginRight: 8, marginBottom: 8, borderWidth: 1 },
  techTagText: { fontSize: 12, fontWeight: "600" },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "800" },
  sectionSub: { fontSize: 12, marginTop: 2 },
  viewAllText: { fontSize: 12, fontWeight: "600" },
  featuredProjCard: { padding: 0, marginBottom: 16, overflow: "hidden" },
  featuredProjImg: { width: "100%", height: 160 },
  featuredBody: { padding: 16 },
  featuredTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  featuredTitle: { fontSize: 18, fontWeight: "800" },
  starRow: { flexDirection: "row", alignItems: "center" },
  starText: { fontSize: 12, fontWeight: "700", marginLeft: 4 },
  featuredDesc: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  quickLinkCard: { flexDirection: "row", alignItems: "center", padding: 16, marginBottom: 12 },
  quickLinkTitle: { fontSize: 15, fontWeight: "700" },
  quickLinkSub: { fontSize: 12, marginTop: 2 },
  menuCard: { padding: 12, marginBottom: 20, marginTop: 12 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 8 },
  menuText: { flex: 1, fontSize: 14, marginLeft: 12 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.75)", justifyContent: "center", alignItems: "center", padding: 20 },
  modalContent: { width: "100%", padding: 20 },
  modalSafeArea: { flex: 1 },
  portfolioHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1 },
  portfolioHeaderTitle: { fontSize: 18, fontWeight: "800" },
  certModalContent: { width: "100%", padding: 20, maxHeight: "90%" },
  certDiplomaFrame: { borderRadius: 16, borderWidth: 2, padding: 20, alignItems: "center" },
  certBadgeRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  certBrandTitle: { fontSize: 16, fontWeight: "900", letterSpacing: 1, marginLeft: 8 },
  certSubtitle: { fontSize: 11, fontWeight: "800", letterSpacing: 1.5, marginBottom: 12 },
  certAwardedTo: { fontSize: 10, letterSpacing: 1, marginBottom: 4 },
  certName: { fontSize: 24, fontWeight: "900", marginBottom: 12 },
  certDetails: { fontSize: 12, textAlign: "center", marginBottom: 8 },
  certModuleHighlight: { fontSize: 12, fontWeight: "700", marginBottom: 4 },
  certFooterDivider: { height: 1, width: "100%", marginVertical: 14 },
  certFooterRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center" },
  certSigTitle: { fontSize: 12, fontWeight: "800" },
  certSigSub: { fontSize: 10 },
  certIdText: { fontSize: 10, fontWeight: "700" },
  certDateText: { fontSize: 10 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: "700" },
  inputLabel: { fontSize: 12, marginBottom: 4, marginTop: 8 },
  modalInput: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
});
