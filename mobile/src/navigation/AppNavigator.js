import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ProjectsScreen from "../screens/ProjectsScreen";
import ChatScreen from "../screens/ChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { theme } from "../theme";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="HomeTab"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.subtle,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
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
              iconName = "key-outline";
            }

            return <Ionicons name={iconName} size={22} color={color} />;
          },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: "Home" }} />
        <Tab.Screen name="DashboardTab" component={DashboardScreen} options={{ tabBarLabel: "Dashboard" }} />
        <Tab.Screen name="ProjectsTab" component={ProjectsScreen} options={{ tabBarLabel: "Projects" }} />
        <Tab.Screen name="ChatTab" component={ChatScreen} options={{ tabBarLabel: "Chat" }} />
        <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: "Profile" }} />
        
        {/* Auth Screens accessible via navigation.navigate('LoginScreen') */}
        <Tab.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ tabBarButton: () => null, tabBarVisible: false }}
        />
        <Tab.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ tabBarButton: () => null, tabBarVisible: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
