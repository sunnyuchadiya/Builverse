import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  ChatScreen,
  CommunityScreen,
  LoginScreen,
  ProjectDetailsScreen,
  ProjectDashboardScreen,
  ProjectsScreen,
  ProfileScreen,
  RegisterScreen,
} from './src/screens';
import { COLORS } from './src/theme';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.primaryText,
    border: COLORS.border,
    primary: COLORS.primary,
  },
};

function MainTabs() {
  return (
    <Tabs.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondaryText,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 78,
          paddingTop: 8,
          paddingBottom: 16,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconMap = {
            Home: 'home',
            Projects: 'account-tree',
            Groups: 'groups',
            Chat: 'forum',
            Profile: 'person',
          };

          return (
            <MaterialIcons
              name={iconMap[route.name] || 'apps'}
              size={size}
              color={color}
              solid={focused ? 1 : 0}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="Home" component={ProjectDashboardScreen} />
      <Tabs.Screen name="Projects" component={ProjectsScreen} />
      <Tabs.Screen name="Groups" component={CommunityScreen} />
      <Tabs.Screen name="Chat" component={ChatScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
