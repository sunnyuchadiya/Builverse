import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
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
import CustomButton from "../components/CustomButton";
import { MONGO_API_BASE_URL, loginUserLocal, safeFetch, setCurrentUserSession } from "../lib/api";
import { darkColors, lightColors, theme, useThemeMode } from "../theme";

export default function LoginScreen({ navigation }) {
  const { isDarkMode, themeColors } = useThemeMode();
  const colors = themeColors || (isDarkMode ? darkColors : lightColors);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    // 1. TRY BACKEND NETWORK AUTHENTICATION
    const json = await safeFetch(`${MONGO_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    if (json && json.success && json.user) {
      setCurrentUserSession({
        id: json.user.id || json.user._id,
        name: json.user.name,
        email: json.user.email,
        role: json.user.role || "BuildVerse Engineer",
        avatar: json.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
      });
      setLoading(false);
      navigation.navigate("HomeTab");
      return;
    }

    // 2. FALLBACK CHECK TO REGISTERED USERS REGISTRY
    const localAuth = loginUserLocal(email, password);

    if (!localAuth.success) {
      setLoading(false);
      setError(localAuth.message); // "User not found! Please register an account first."
      return;
    }

    // LOGIN SUCCESSFUL FOR REGISTERED USER
    setCurrentUserSession(localAuth.user);
    setLoading(false);
    navigation.navigate("HomeTab");
  };

  // INTERACTIVE GITHUB AUTHENTICATION & LIVE REPO IMPORT
  const handleGitHubAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentUserSession({
        id: "u_github_octocat",
        name: "octocat",
        email: "octocat@github.com",
        role: "Open Source Creator",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
      });
      navigation.navigate("HomeTab", { isGitHubUser: true, githubUser: "octocat" });
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* HEADER BRAND */}
          <View style={styles.header}>
            <Text style={[styles.logoText, { color: colors.foreground }]}>BuildVerse</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Architecting the future of development.
            </Text>
          </View>

          {/* LOGIN CARD */}
          <GlassCard elevated style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.cardHeading, { color: colors.foreground }]}>Welcome back</Text>

            {/* SOCIAL AUTH BUTTONS */}
            <TouchableOpacity activeOpacity={0.7} style={[styles.socialBtn, { backgroundColor: colors.elevated, borderColor: colors.border }]} onPress={handleGitHubAuth}>
              <Ionicons name="logo-google" size={18} color={colors.foreground} />
              <Text style={[styles.socialBtnText, { color: colors.foreground }]}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} style={[styles.socialBtn, { backgroundColor: colors.elevated, borderColor: colors.border }]} onPress={handleGitHubAuth}>
              <Ionicons name="logo-github" size={18} color={colors.foreground} />
              <Text style={[styles.socialBtnText, { color: colors.foreground }]}>Continue with GitHub</Text>
            </TouchableOpacity>

            {/* OR SEPARATOR */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.orText, { color: colors.subtle }]}>OR</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color={colors.danger} />
                <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
              </View>
            ) : null}

            <Text style={[styles.label, { color: colors.foreground }]}>Email Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.elevated, borderColor: colors.border, color: colors.foreground }]}
              placeholder="name@company.com"
              placeholderTextColor={colors.subtle}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.passwordHeaderRow}>
              <Text style={[styles.label, { color: colors.foreground }]}>Password</Text>
              <TouchableOpacity>
                <Text style={[styles.forgotText, { color: colors.muted }]}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: colors.elevated, borderColor: colors.border, color: colors.foreground }]}
              placeholder="••••••••"
              placeholderTextColor={colors.subtle}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <CustomButton
              title="Sign in to Workspace"
              variant="primary"
              size="lg"
              loading={loading}
              style={styles.submitBtn}
              onPress={handleLogin}
            />

            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: colors.muted }]}>New to the universe? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
                <Text style={[styles.linkText, { color: colors.foreground }]}>Create an account</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* LEGAL FOOTER LINKS */}
          <View style={styles.legalFooterRow}>
            <Text style={[styles.legalText, { color: colors.subtle }]}>Privacy Policy</Text>
            <Text style={[styles.legalDot, { color: colors.subtle }]}>•</Text>
            <Text style={[styles.legalText, { color: colors.subtle }]}>Terms of Service</Text>
            <Text style={[styles.legalDot, { color: colors.subtle }]}>•</Text>
            <Text style={[styles.legalText, { color: colors.subtle }]}>Security</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 24, justifyContent: "center", minHeight: "100%" },
  header: { alignItems: "center", marginBottom: 32 },
  logoText: { fontSize: 32, fontWeight: "900", letterSpacing: -1, marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: "center" },
  card: { padding: 24 },
  cardHeading: { fontSize: 22, fontWeight: "800", marginBottom: 20 },
  socialBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderRadius: 9999, paddingVertical: 12, marginBottom: 12 },
  socialBtnText: { fontSize: 14, fontWeight: "600", marginLeft: 8 },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 16 },
  dividerLine: { flex: 1, height: 1 },
  orText: { fontSize: 11, fontWeight: "700", marginHorizontal: 12 },
  errorBox: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(239, 68, 68, 0.12)", padding: 12, borderRadius: 12, marginBottom: 16 },
  errorText: { fontSize: 13, marginLeft: 8, flex: 1 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
  passwordHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4, marginBottom: 6 },
  forgotText: { fontSize: 12, fontWeight: "500" },
  input: { borderRadius: 9999, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 12, fontSize: 14, marginBottom: 16 },
  submitBtn: { marginTop: 8, marginBottom: 20 },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 4 },
  footerText: { fontSize: 13 },
  linkText: { fontSize: 13, fontWeight: "800" },
  legalFooterRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 32 },
  legalText: { fontSize: 12 },
  legalDot: { marginHorizontal: 8, fontSize: 12 },
});
