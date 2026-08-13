import React from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW, SPACING } from './theme';

export function Screen({ children, scroll = true, style }) {
  const Container = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.safe, style]}>
      <Container
        contentContainerStyle={scroll ? styles.scroll : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
}

export function AppHeader({ title, subtitle, right, onBack, compact = false }) {
  return (
    <View style={[styles.header, compact && styles.headerCompact]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          {onBack ? (
            <Pressable onPress={onBack} style={styles.iconCircle}>
              <MaterialIcons name="arrow-back" size={20} color={COLORS.primaryText} />
            </Pressable>
          ) : null}
          <View>
            <Text style={styles.brand}>BuildVerse</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        </View>
        {right || <MaterialIcons name="search" size={22} color={COLORS.primaryText} />}
      </View>
      {title ? <Text style={styles.pageTitle}>{title}</Text> : null}
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ title, action, onAction, subtitle }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {action ? (
        <Pressable onPress={onAction} style={styles.actionPill}>
          <Text style={styles.actionText}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Pill({ label, active = false, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.pill, active && styles.pillActive, pressed && styles.pressed, style]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function PrimaryButton({ label, onPress, icon, style }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, style]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
      {icon ? <MaterialIcons name={icon} size={18} color={COLORS.surface} /> : null}
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, icon, style }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed, style]}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
      {icon ? <MaterialIcons name={icon} size={18} color={COLORS.primaryText} /> : null}
    </Pressable>
  );
}

export function Avatar({ uri, size = 48, style }) {
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2 }, styles.avatar, style]}>
      <Image source={{ uri }} style={{ width: '100%', height: '100%', borderRadius: size / 2 }} />
    </View>
  );
}

export function StatCard({ label, value, note, accent = false, style }) {
  return (
    <Card style={[styles.statCard, accent && styles.statCardAccent, style]}>
      <Text style={[styles.statLabel, accent && styles.statLabelAccent]}>{label}</Text>
      <Text style={[styles.statValue, accent && styles.statValueAccent]}>{value}</Text>
      {note ? <Text style={[styles.statNote, accent && styles.statNoteAccent]}>{note}</Text> : null}
    </Card>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

export function RowLink({ icon, title, subtitle, onPress, accent = false }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.rowLink, pressed && styles.rowPressed]}>
      <View style={styles.rowIconWrap}>
        <MaterialIcons name={icon} size={20} color={accent ? COLORS.amber : COLORS.primaryText} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      <MaterialIcons name="chevron-right" size={20} color={COLORS.tertiaryText} />
    </Pressable>
  );
}

export function BottomTabs({ items, active, onChange }) {
  return (
    <View style={styles.bottomTabs}>
      {items.map((item) => {
        const isActive = active === item.name;

        return (
          <Pressable key={item.name} onPress={() => onChange(item.name)} style={({ pressed }) => [styles.tabItem, pressed && styles.pressed]}>
            <MaterialIcons name={item.icon} size={22} color={isActive ? COLORS.primary : COLORS.secondaryText} />
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{item.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function CardRow({ title, meta, badge, icon, onPress, leading, trailing, subtitle, active = false }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.messageCard, active && styles.messageCardActive, pressed && styles.rowPressed]}>
      <View style={styles.messageLeft}>
        {leading || (
          <View style={styles.messageIconWrap}>
            <MaterialIcons name={icon || 'forum'} size={20} color={COLORS.primary} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.messageTitle}>{title}</Text>
          {subtitle ? <Text style={styles.messageSubtitle}>{subtitle}</Text> : null}
          <View style={styles.messageMetaRow}>
            <Text style={styles.messageGroup}>{meta}</Text>
            {badge ? <Text style={styles.messageBadge}>{badge}</Text> : null}
          </View>
        </View>
      </View>
      {trailing}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: SPACING.page,
    paddingBottom: 36,
  },
  header: {
    gap: 12,
    paddingHorizontal: SPACING.page,
    paddingTop: 6,
    paddingBottom: 8,
  },
  headerCompact: {
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  brand: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primaryText,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 2,
    color: COLORS.secondaryText,
    fontSize: 12,
    fontWeight: '500',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.8,
    color: COLORS.primaryText,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.card,
    ...SHADOW,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: COLORS.primaryText,
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.secondaryText,
    lineHeight: 20,
  },
  actionPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
  },
  actionText: {
    color: COLORS.primaryText,
    fontSize: 12,
    fontWeight: '600',
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondaryText,
  },
  pillTextActive: {
    color: COLORS.surface,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  primaryButtonText: {
    color: COLORS.surface,
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  secondaryButtonText: {
    color: COLORS.primaryText,
    fontSize: 13,
    fontWeight: '700',
  },
  avatar: {
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCard: {
    gap: 8,
  },
  statCardAccent: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.secondaryText,
    fontWeight: '700',
  },
  statLabelAccent: {
    color: 'rgba(255,255,255,0.7)',
  },
  statValue: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1,
    color: COLORS.primaryText,
  },
  statValueAccent: {
    color: COLORS.surface,
  },
  statNote: {
    color: COLORS.secondaryText,
    fontSize: 12,
  },
  statNoteAccent: {
    color: 'rgba(255,255,255,0.75)',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  rowLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  rowPressed: {
    opacity: 0.7,
  },
  rowIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  rowTitle: {
    color: COLORS.primaryText,
    fontSize: 14,
    fontWeight: '700',
  },
  rowSubtitle: {
    color: COLORS.secondaryText,
    fontSize: 12,
    marginTop: 2,
  },
  bottomTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: 22,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 54,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.secondaryText,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  messageCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    ...SHADOW,
  },
  messageCardActive: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    backgroundColor: '#F3F3F1',
  },
  messageLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  messageIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.chip,
  },
  messageTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primaryText,
    lineHeight: 20,
  },
  messageSubtitle: {
    marginTop: 2,
    color: COLORS.secondaryText,
    fontSize: 12,
  },
  messageMetaRow: {
    marginTop: 6,
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  messageGroup: {
    color: COLORS.secondaryText,
    fontSize: 11,
    fontWeight: '700',
  },
  messageBadge: {
    color: COLORS.tertiaryText,
    fontSize: 11,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
