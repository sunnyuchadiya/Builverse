import React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ProjectsScreen from "../screens/ProjectsScreen";
import ProjectDetailsScreen from "../screens/ProjectDetailsScreen";
import ChatScreen from "../screens/ChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LearningScreen from "../screens/LearningScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { darkColors, lightColors, theme, useThemeMode } from "../theme";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { isDarkMode, themeColors } = useThemeMode();
  const colors = themeColors || (isDarkMode ? darkColors : lightColors);

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="LoginScreen"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle:
            route.name === "LoginScreen" || route.name === "RegisterScreen" || route.name === "ProjectDetailsScreen" || route.name === "LearningScreen"
              ? { display: "none" }
              : {
                  backgroundColor: colors.card,
                  borderTopColor: colors.border,
                  borderTopWidth: 1,
                  height: 64,
                  paddingBottom: 10,
                  paddingTop: 8,
                  ...theme.shadows.card,
                },
          tabBarActiveTintColor: colors.foreground,
          tabBarInactiveTintColor: colors.muted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "700",
            marginTop: 2,
          },
          tabBarIcon: ({ focused, color }) => {
            let iconName;

            if (route.name === "HomeTab") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "DashboardTab") {
              iconName = focused ? "grid" : "grid-outline";
            } else if (route.name === "ProjectsTab") {
              iconName = focused ? "folder" : "folder-outline";
            } else if (route.name === "ChatTab") {
              iconName = focused ? "chatbubbles" : "chatbubbles-outline";
            } else if (route.name === "ProfileTab") {
              iconName = focused ? "person" : "person-outline";
            } else {
              return null;
            }

            return (
              <View style={styles.tabIconWrapper}>
                {focused && <View style={[styles.activeGlowDot, { backgroundColor: colors.amber }]} />}
                <Ionicons name={iconName} size={focused ? 24 : 22} color={color} />
              </View>
            );
          },
        })}
      >
        {/* UNAUTHENTICATED LOGIN & REGISTER (HIDDEN TAB BAR) */}
        <Tab.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ tabBarButton: () => null }}
        />
        <Tab.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ tabBarButton: () => null }}
        />

        {/* PROTECTED AUTHENTICATED TABS */}
        <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: "Home" }} />
        <Tab.Screen name="DashboardTab" component={DashboardScreen} options={{ tabBarLabel: "Dashboard" }} />
        <Tab.Screen name="ProjectsTab" component={ProjectsScreen} options={{ tabBarLabel: "Projects" }} />
        <Tab.Screen name="ChatTab" component={ChatScreen} options={{ tabBarLabel: "Chat" }} />
        <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: "Profile" }} />

        {/* SUB-PAGES (HIDDEN TAB BAR) */}
        <Tab.Screen
          name="ProjectDetailsScreen"
          component={ProjectDetailsScreen}
          options={{ tabBarButton: () => null }}
        />
        <Tab.Screen
          name="LearningScreen"
          component={LearningScreen}
          options={{ tabBarButton: () => null }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeGlowDot: {
    position: "absolute",
    top: -6,
    width: 14,
    height: 3,
    borderRadius: 2,
    ...theme.shadows.glow,
  },
});
