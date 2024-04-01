import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import Checkout from "../Screens/ServiceCart/Checkout/Checkout";
import Appointment from "../Screens/ServiceCart/Checkout/Appointment";
import Confirm from "../Screens/ServiceCart/Checkout/Confirm";
import Services from "../Screens/ServiceCart/Checkout/Services";
import Success from "../Screens/ServiceCart/Checkout/Success"; // Import Success screen

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function MainFlow() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        scrollEnabled: true,
        style: { backgroundColor: "white" },
        indicatorStyle: { backgroundColor: "#ef4444" },
      }}
    >
      <Tab.Screen name="Schedule" component={Checkout} />
      <Tab.Screen name="Services" component={Services} />
      <Tab.Screen name="Appointment" component={Appointment} />
      <Stack.Screen name="Confirm" component={Confirm} />
    </Tab.Navigator>
  );
}

export default function CheckoutServiceNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainFlow"
        component={MainFlow}
        options={{ headerShown: false }}
      />
      {/* Define a stack for screens not in the tab navigation */}
      <Stack.Screen
        name="Success"
        component={Success}
        options={{ headerShown: false, tabBarStyle: "none" }}
      />
      {/* Define a stack for Confirm screen */}
    </Stack.Navigator>
  );
}
