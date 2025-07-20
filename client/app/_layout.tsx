import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import TransactionListScreen from "./screens/TransactionListScreen";
import TransactionDetailsScreen from "./screens/TransactionDetailsScreen";
import AddPaymentScreen from "./screens/AddPaymentScreen";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ onLogout }: { onLogout: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#959599ff",
        tabBarStyle: {
          backgroundColor: "#fefefe",
          borderTopColor: "#ddd",
          height: 70,
        },
        tabBarIcon: ({ color, size }) => {
          let name: keyof typeof Ionicons.glyphMap;

          if (route.name === "Dashboard") {
            name = "grid-outline";
          } else if (route.name === "Transactions") {
            name = "repeat";
          } else if (route.name === "Add Payment") {
            name = "add-circle-outline";
          } else {
            name = "ellipse-outline";
          }

          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      {/* ✅ Pass onLogout to DashboardScreen only */}
      <Tab.Screen name="Dashboard">
        {(props) => <DashboardScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Transactions" component={TransactionListScreen} />
      <Tab.Screen name="Add Payment" component={AddPaymentScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Main">
            {(props) => (
              <MainTabs {...props} onLogout={() => setIsLoggedIn(false)} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="TransactionDetails"
            component={TransactionDetailsScreen}
          />
        </>
      ) : (
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}
