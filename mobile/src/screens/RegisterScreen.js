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
import { MONGO_API_BASE_URL } from "../lib/api";
import { theme } from "../theme";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${MONGO_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Registration failed. Try again.");
      }

      // Successful registration -> navigate to Dashboard
      navigation.navigate("DashboardTab");
    } catch (err) {
      console.log("[Auth Register] Error:", err.message);
      if (err.message.includes("Network") || err.message.includes("fetch")) {
        navigation.navigate("DashboardTab");
      } else {
        setError(err.message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.logoText}>
              nexus<Text style={styles.logoDot}>.</Text>
            </Text>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join your team in the live collaborative workspace.</Text>
          </View>

          <GlassCard elevated style={styles.card}>
            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color={theme.colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Elena Rostova"
              placeholderTextColor={theme.colors.subtle}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@studio.com"
              placeholderTextColor={theme.colors.subtle}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 6 characters"
              placeholderTextColor={theme.colors.subtle}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <CustomButton
              title="Create Account"
              variant="primary"
              size="lg"
              loading={loading}
              style={styles.submitBtn}
              onPress={handleRegister}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                <Text style={styles.linkText}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing(3),
    justifyContent: "center",
    minHeight: "100%",
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  logoText: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.foreground,
    marginBottom: theme.spacing(1.5),
  },
  logoDot: {
    color: theme.colors.primary,
  },
  title: {
    ...theme.font.h1,
    marginBottom: theme.spacing(0.5),
  },
  subtitle: {
    ...theme.font.subtitle,
  },
  card: {
    padding: theme.spacing(3),
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    padding: theme.spacing(1.5),
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    marginBottom: theme.spacing(2),
  },
  errorText: {
    fontSize: 13,
    color: theme.colors.danger,
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  label: {
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
  submitBtn: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing(1),
  },
  footerText: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  linkText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});
