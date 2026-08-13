import { createContext, useContext, useState } from "react";
import { Platform } from "react-native";

export const darkColors = {
  background: "#09090B",
  surface: "#121215",
  elevated: "#18181B",
  card: "#121215",
  cardBorder: "#27272A",
  cardBorderGlow: "rgba(245, 158, 11, 0.4)",
  foreground: "#FAFAFA",
  muted: "#A1A1AA",
  subtle: "#71717A",
  border: "#27272A",
  primary: "#FFFFFF",
  amber: "#F59E0B",
  amberGlow: "rgba(245, 158, 11, 0.15)",
  danger: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
};

export const lightColors = {
  background: "#F8F9FA",
  surface: "#FFFFFF",
  elevated: "#F1F3F5",
  card: "#FFFFFF",
  cardBorder: "#E9ECEF",
  cardBorderGlow: "rgba(217, 119, 6, 0.4)",
  foreground: "#111827",
  muted: "#4B5563",
  subtle: "#9CA3AF",
  border: "#E5E7EB",
  primary: "#000000",
  amber: "#D97706",
  amberGlow: "rgba(217, 119, 6, 0.12)",
  danger: "#DC2626",
  success: "#059669",
  warning: "#D97706",
};

const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },
  h2: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 18,
    fontWeight: "700",
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  bodySm: {
    fontSize: 12,
    lineHeight: 16,
  },
  caption: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  badge: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
};

export const theme = {
  colors: darkColors,
  spacing: (factor) => factor * 8,
  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography,
  font: typography, // ALIAS font TO typography TO PREVENT 'reading h3 of undefined'
  shadows: Platform.OS === "web" ? {
    card: { boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)" },
    glow: { boxShadow: "0px 2px 10px rgba(245, 158, 11, 0.35)" },
  } : {
    card: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    glow: {
      shadowColor: "#F59E0B",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 4,
    },
  },
};

const ThemeModeContext = createContext({
  isDarkMode: false,
  toggleThemeMode: () => {},
  themeColors: lightColors,
});

export function ThemeModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleThemeMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const themeColors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeModeContext.Provider value={{ isDarkMode, toggleThemeMode, themeColors }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}