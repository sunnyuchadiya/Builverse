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
import { MONGO_API_BASE_URL, registerUserLocal, safeFetch, setCurrentUserSession } from "../lib/api";
import { darkColors, lightColors, theme, useThemeMode } from "../theme";

const ROLE_OPTIONS = [
  "Senior Systems Architect",
  "Lead Frontend Engineer",
  "Backend Microservices Developer",
  "Full Stack Developer",
  "DevOps & Cloud Engineer",
];

const SKILL_TAGS = ["Rust", "React Native", "MongoDB", "Go", "Next.js", "Docker", "TypeScript"];

export default function RegisterScreen({ navigation }) {
  const { isDarkMode, themeColors } = useThemeMode();
  const colors = themeColors || (isDarkMode ? darkColors : lightColors);

  // STEP WIZARD STATE (Step 1 vs Step 2)
  const [step, setStep] = useState(1);

  // STEP 1 STATE
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // STEP 2 STATE
  const [selectedRole, setSelectedRole] = useState(ROLE_OPTIONS[0]);
  const [bio, setBio] = useState("Architecting high-performance distributed systems.");
  const [selectedSkills, setSelectedSkills] = useState(["Rust", "MongoDB", "React Native"]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleStep1Continue = () => {
    setError("");
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields (Name, Email, Password).");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setStep(2);
  };

  const handleFinalRegister = async () => {
    setError("");
    setLoading(true);

    const userPayload = {
      name: fullName.trim(),
      email: email.trim(),
      password,
      role: selectedRole,
      bio: bio.trim(),
      skills: selectedSkills,
    };

    // 1. SEND REAL POST REQUEST TO MONGODB API
    const json = await safeFetch(`${MONGO_API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userPayload),
    });

    if (json && json.success && json.user) {
      setCurrentUserSession({
        id: json.user.id || json.user._id,
        name: json.user.name,
        email: json.user.email,
        role: selectedRole,
        avatar: json.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
      });
      setLoading(false);
      navigation.navigate("HomeTab");
      return;
    }

    // 2. FALLBACK REGISTER USER IN REGISTRY AND LOG IN
    const registerRes = registerUserLocal(fullName.trim(), email.trim(), password);

    if (!registerRes.success) {
      setLoading(false);
      setError(registerRes.message);
      return;
    }

    setCurrentUserSession({
      ...registerRes.user,
      role: selectedRole,
    });

    setLoading(false);
    navigation.navigate("HomeTab");
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
              The architecture of your developer journey begins here.
            </Text>
          </View>

          {/* CREATE ACCOUNT CARD */}
          <GlassCard elevated style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            {/* STEP PROGRESS INDICATOR BAR */}
            <View style={styles.stepProgressRow}>
              <View style={[styles.stepBarActive, { backgroundColor: colors.foreground }]} />
              <View style={[step === 2 ? styles.stepBarActive : styles.stepBarInactive, { backgroundColor: step === 2 ? colors.foreground : colors.border }]} />
            </View>

            <Text style={[styles.cardHeading, { color: colors.foreground }]}>
              {step === 1 ? "Create your identity" : "Define your profile"}
            </Text>
            <Text style={[styles.stepSubText, { color: colors.muted }]}>
              Step {step} of 2
            </Text>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color={colors.danger} />
                <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
              </View>
            ) : null}

            {step === 1 ? (
              /* STEP 1: CREDENTIALS */
              <View>
                <Text style={[styles.label, { color: colors.foreground }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.elevated, borderColor: colors.border, color: colors.foreground }]}
                  placeholder="e.g. Sunny Patel"
                  placeholderTextColor={colors.subtle}
                  value={fullName}
                  onChangeText={setFullName}
                />

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

                <Text style={[styles.label, { color: colors.foreground }]}>Password</Text>
                <View style={[styles.passwordInputBox, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
                  <TextInput
                    style={[styles.passwordInput, { color: colors.foreground }]}
                    placeholder="Min. 6 characters"
                    placeholderTextColor={colors.subtle}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color={colors.muted}
                    />
                  </TouchableOpacity>
                </View>

                <CustomButton
                  title="Continue to Step 2 →"
                  variant="primary"
                  size="lg"
                  style={styles.submitBtn}
                  onPress={handleStep1Continue}
                />
              </View>
            ) : (
              /* STEP 2: PROFILE & ROLE SELECTION */
              <View>
                <Text style={[styles.label, { color: colors.foreground }]}>Select Engineering Role</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rolePickerScroll}>
                  {ROLE_OPTIONS.map((role) => (
                    <TouchableOpacity
                      key={role}
                      activeOpacity={0.8}
                      onPress={() => setSelectedRole(role)}
                      style={[
                        styles.roleChipPill,
                        { backgroundColor: colors.elevated, borderColor: colors.border },
                        selectedRole === role && { backgroundColor: colors.primary, borderColor: colors.primary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleChipText,
                          { color: colors.muted },
                          selectedRole === role && { color: isDarkMode ? "#000" : "#FFF", fontWeight: "700" },
                        ]}
                      >
                        {role}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={[styles.label, { color: colors.foreground, marginTop: 12 }]}>Developer Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { backgroundColor: colors.elevated, borderColor: colors.border, color: colors.foreground }]}
                  placeholder="Describe your engineering focus..."
                  placeholderTextColor={colors.subtle}
                  multiline
                  numberOfLines={2}
                  value={bio}
                  onChangeText={setBio}
                />

                <Text style={[styles.label, { color: colors.foreground }]}>Primary Skills</Text>
                <View style={styles.skillsWrapRow}>
                  {SKILL_TAGS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <TouchableOpacity
                        key={skill}
                        activeOpacity={0.7}
                        onPress={() => toggleSkill(skill)}
                        style={[
                          styles.skillBadge,
                          { backgroundColor: colors.elevated, borderColor: colors.border },
                          isSelected && { backgroundColor: colors.amber, borderColor: colors.amber },
                        ]}
                      >
                        <Text style={[styles.skillBadgeText, { color: isSelected ? "#FFFFFF" : colors.foreground }]}>
                          {skill} {isSelected ? "✓" : ""}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.step2ActionsRow}>
                  <CustomButton
                    title="← Back"
                    variant="outline"
                    size="lg"
                    style={{ flex: 1, marginRight: 8 }}
                    onPress={() => setStep(1)}
                  />
                  <CustomButton
                    title="Complete Registration →"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    style={{ flex: 2 }}
                    onPress={handleFinalRegister}
                  />
                </View>
              </View>
            )}
          </GlassCard>

          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: colors.muted }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
              <Text style={[styles.linkText, { color: colors.foreground }]}>Log in</Text>
            </TouchableOpacity>
          </View>

          {/* LEGAL FOOTER LINKS */}
          <View style={styles.legalFooterRow}>
            <Text style={[styles.legalText, { color: colors.subtle }]}>Privacy Policy</Text>
            <Text style={[styles.legalDot, { color: colors.subtle }]}>•</Text>
            <Text style={[styles.legalText, { color: colors.subtle }]}>Terms of Service</Text>
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
  subtitle: { fontSize: 14, textAlign: "center", paddingHorizontal: 20 },
  card: { padding: 24 },
  stepProgressRow: { flexDirection: "row", marginBottom: 20 },
  stepBarActive: { flex: 1, height: 3, borderRadius: 2, marginRight: 6 },
  stepBarInactive: { flex: 1, height: 3, borderRadius: 2 },
  cardHeading: { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  stepSubText: { fontSize: 13, marginBottom: 20 },
  errorBox: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(239, 68, 68, 0.12)", padding: 12, borderRadius: 12, marginBottom: 16 },
  errorText: { fontSize: 13, marginLeft: 8, flex: 1 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
  input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, marginBottom: 16 },
  passwordInputBox: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 20 },
  passwordInput: { flex: 1, fontSize: 14, paddingVertical: 8 },
  textArea: { height: 60, textAlignVertical: "top" },
  rolePickerScroll: { flexDirection: "row", marginBottom: 12 },
  roleChipPill: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9999, marginRight: 8 },
  roleChipText: { fontSize: 12 },
  skillsWrapRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
  skillBadge: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 6, marginBottom: 6 },
  skillBadgeText: { fontSize: 12, fontWeight: "600" },
  submitBtn: { marginBottom: 4 },
  step2ActionsRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 13 },
  linkText: { fontSize: 13, fontWeight: "800" },
  legalFooterRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 24 },
  legalText: { fontSize: 12 },
  legalDot: { marginHorizontal: 8, fontSize: 12 },
});
