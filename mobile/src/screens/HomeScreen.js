import React, { useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "../components/GlassCard";
import CustomButton from "../components/CustomButton";
import { theme } from "../theme";
import { SKILLS, MENTORS, TESTIMONIALS, PRICING, stats } from "../data";

const CRAFT_CATEGORIES = ["All Crafts", "Design Systems", "Motion & UI", "AI Native", "Product Architecture"];

export default function HomeScreen({ navigation }) {
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly | yearly
  const [activeCategory, setActiveCategory] = useState("All Crafts");

  const filteredSkills = SKILLS.filter((s) => {
    if (activeCategory === "Design Systems") return s.title.includes("Design Systems");
    if (activeCategory === "Motion & UI") return s.title.includes("Motion") || s.title.includes("Web");
    if (activeCategory === "AI Native") return s.title.includes("AI");
    if (activeCategory === "Product Architecture") return s.title.includes("Product") || s.title.includes("Brand");
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO BANNER SECTION */}
        <View style={styles.heroSection}>
          <View style={styles.badgeRow}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>NEXUS 2.0 • MONGODB NATIVE</Text>
          </View>

          <Text style={styles.heroTitle}>
            Design craft for people who <Text style={styles.highlightText}>ship.</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            Lessons, live workshops, mentors, and a 10,000-designer community.
            Learn production design craft powered by live MongoDB sync.
          </Text>

          <View style={styles.ctaRow}>
            <CustomButton
              title="Explore Dashboard"
              variant="primary"
              size="lg"
              icon={<Ionicons name="sparkles" size={18} color="#000" />}
              onPress={() => navigation.navigate("DashboardTab")}
            />
            <CustomButton
              title="Join Community"
              variant="outline"
              size="lg"
              style={{ marginLeft: theme.spacing(1.5) }}
              onPress={() => navigation.navigate("ChatTab")}
            />
          </View>
        </View>

        {/* PLATFORM STATS TICKER */}
        <View style={styles.statsTickerRow}>
          {stats.map(([num, label], idx) => (
            <GlassCard key={idx} style={styles.tickerCard}>
              <Text style={styles.tickerNum}>{num}</Text>
              <Text style={styles.tickerLabel}>{label}</Text>
            </GlassCard>
          ))}
        </View>

        {/* INTERACTIVE CRAFT CATEGORIES & SKILLS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you'll master</Text>
          <Text style={styles.sectionSubtitle}>
            End-to-end design craft built for production products.
          </Text>

          {/* CATEGORY FILTER TABS */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilterRow}>
            {CRAFT_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.8}
                onPress={() => setActiveCategory(cat)}
                style={[
                  styles.catTab,
                  activeCategory === cat && styles.catTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.catText,
                    activeCategory === cat && styles.catTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.skillsGrid}>
            {filteredSkills.map((skill, index) => (
              <GlassCard key={index} elevated style={styles.skillCard}>
                <View style={styles.skillHeader}>
                  <View style={styles.skillIconBadge}>
                    <Ionicons
                      name={index % 2 === 0 ? "code-slash" : "layers"}
                      size={18}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.skillTitle}>{skill.title}</Text>
                    <Text style={styles.lessonMeta}>Module {index + 1} • 24 mins</Text>
                  </View>
                  <Ionicons name="arrow-forward-circle" size={22} color={theme.colors.primary} />
                </View>
                <Text style={styles.skillDescription}>{skill.description}</Text>
              </GlassCard>
            ))}
          </View>
        </View>

        {/* PRACTITIONER MENTORS CAROUSEL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learn from practitioners</Text>
          <Text style={styles.sectionSubtitle}>
            Our mentors build and ship software at world-class companies.
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {MENTORS.map((mentor, index) => (
              <GlassCard key={index} style={styles.mentorCard}>
                <View style={styles.avatarWrapper}>
                  <Image source={{ uri: mentor.avatar }} style={styles.mentorAvatar} />
                  <View style={styles.onlineBadge} />
                </View>
                <Text style={styles.mentorName}>{mentor.name}</Text>
                <Text style={styles.mentorRole}>{mentor.role}</Text>
                <View style={styles.companyBadge}>
                  <Text style={styles.companyText}>{mentor.company}</Text>
                </View>
              </GlassCard>
            ))}
          </ScrollView>
        </View>

        {/* TESTIMONIALS SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What members say</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {TESTIMONIALS.map((t, idx) => (
              <GlassCard key={idx} style={styles.testimonialCard}>
                <Ionicons name="quote" size={24} color={theme.colors.indigo} style={{ marginBottom: 8 }} />
                <Text style={styles.quoteText}>"{t.text}"</Text>
                <Text style={styles.quoteAuthor}>— {t.author}</Text>
              </GlassCard>
            ))}
          </ScrollView>
        </View>

        {/* TRANSPARENT TIERED PRICING WITH DISCOUNT TOGGLE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Simple, transparent pricing</Text>
          
          <View style={styles.pricingToggleContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setBillingCycle("monthly")}
              style={[
                styles.toggleBtn,
                billingCycle === "monthly" && styles.toggleBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  billingCycle === "monthly" && styles.toggleTextActive,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setBillingCycle("yearly")}
              style={[
                styles.toggleBtn,
                billingCycle === "yearly" && styles.toggleBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  billingCycle === "yearly" && styles.toggleTextActive,
                ]}
              >
                Yearly (Save 20%)
              </Text>
            </TouchableOpacity>
          </View>

          <GlassCard elevated style={styles.pricingCard}>
            <Text style={styles.planName}>Pro Membership</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceAmount}>
                {billingCycle === "yearly" ? "$39" : "$49"}
              </Text>
              <Text style={styles.pricePeriod}>/month</Text>
            </View>
            <Text style={styles.pricingSub}>
              {billingCycle === "yearly" ? "Billed annually at $468/yr" : "Billed monthly. Cancel anytime."}
            </Text>

            <View style={styles.divider} />

            {PRICING.features.map((feature, idx) => (
              <View key={idx} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}

            <CustomButton
              title="Get Started Now"
              variant="primary"
              size="lg"
              style={styles.pricingButton}
              onPress={() => navigation.navigate("DashboardTab")}
            />
          </GlassCard>
        </View>
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
  heroSection: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: theme.spacing(1.5),
    paddingVertical: theme.spacing(0.6),
    borderRadius: theme.radius.pill,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.25)",
    marginBottom: theme.spacing(2),
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing(1),
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heroTitle: {
    ...theme.font.hero,
    marginBottom: theme.spacing(1.5),
  },
  highlightText: {
    color: theme.colors.primary,
  },
  heroSubtitle: {
    ...theme.font.subtitle,
    lineHeight: 22,
    marginBottom: theme.spacing(3),
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsTickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing(4),
  },
  tickerCard: {
    flex: 1,
    marginHorizontal: 3,
    alignItems: "center",
    padding: theme.spacing(1.2),
  },
  tickerNum: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  tickerLabel: {
    fontSize: 10,
    color: theme.colors.muted,
    marginTop: 2,
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  sectionTitle: {
    ...theme.font.h2,
    marginBottom: theme.spacing(0.5),
  },
  sectionSubtitle: {
    ...theme.font.subtitle,
    marginBottom: theme.spacing(2),
  },
  categoryFilterRow: {
    flexDirection: "row",
    marginBottom: theme.spacing(1.5),
  },
  catTab: {
    paddingHorizontal: theme.spacing(1.8),
    paddingVertical: theme.spacing(0.8),
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing(1),
  },
  catTabActive: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderColor: theme.colors.primary,
  },
  catText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  catTextActive: {
    color: theme.colors.primary,
  },
  skillsGrid: {
    marginTop: theme.spacing(1),
  },
  skillCard: {
    marginVertical: theme.spacing(0.8),
    padding: theme.spacing(2),
  },
  skillHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing(0.8),
  },
  skillIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing(1.2),
  },
  skillTitle: {
    ...theme.font.h3,
    fontSize: 16,
  },
  lessonMeta: {
    fontSize: 11,
    color: theme.colors.muted,
    marginTop: 2,
  },
  skillDescription: {
    ...theme.font.body,
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 18,
  },
  horizontalScroll: {
    marginLeft: -theme.spacing(2.5),
    paddingLeft: theme.spacing(2.5),
  },
  mentorCard: {
    width: 180,
    marginRight: theme.spacing(2),
    alignItems: "center",
    padding: theme.spacing(2),
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: theme.spacing(1.2),
  },
  mentorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: theme.colors.borderSubtle,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.card,
  },
  mentorName: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.foreground,
    textAlign: "center",
  },
  mentorRole: {
    fontSize: 12,
    color: theme.colors.muted,
    textAlign: "center",
    marginBottom: theme.spacing(1),
  },
  companyBadge: {
    backgroundColor: theme.colors.elevated,
    paddingHorizontal: theme.spacing(1),
    paddingVertical: theme.spacing(0.4),
    borderRadius: theme.radius.sm,
  },
  companyText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  testimonialCard: {
    width: 260,
    marginRight: theme.spacing(2),
    padding: theme.spacing(2.5),
  },
  quoteText: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.foreground,
    marginBottom: theme.spacing(1.5),
  },
  quoteAuthor: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  pricingToggleContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing(2),
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: theme.spacing(1),
    alignItems: "center",
    borderRadius: theme.radius.pill,
  },
  toggleBtnActive: {
    backgroundColor: theme.colors.elevated,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  toggleTextActive: {
    color: theme.colors.primary,
  },
  pricingCard: {
    padding: theme.spacing(3),
  },
  planName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing(0.5),
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: theme.spacing(0.5),
  },
  priceAmount: {
    fontSize: 40,
    fontWeight: "800",
    color: theme.colors.foreground,
  },
  pricePeriod: {
    fontSize: 14,
    color: theme.colors.muted,
    marginLeft: theme.spacing(0.5),
  },
  pricingSub: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing(2),
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing(1.2),
  },
  featureText: {
    fontSize: 14,
    color: theme.colors.foreground,
    marginLeft: theme.spacing(1.5),
  },
  pricingButton: {
    marginTop: theme.spacing(2.5),
  },
  guaranteeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing(2),
  },
  guaranteeText: {
    fontSize: 11,
    color: theme.colors.muted,
    marginLeft: theme.spacing(0.8),
  },
});
