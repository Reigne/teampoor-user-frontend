import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ServiceContainer from "../Screens/Service/ServiceContainer";
import SingleService from "../Screens/Service/SingleService";
import CartServiceNavigator from "./CartServiceNavigator";
import CheckoutServiceNavigator from "./CheckoutServiceNavigator";
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Services"
        component={ServiceContainer}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Service Details"
        component={SingleService}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Home Service Cart"
        component={CartServiceNavigator}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Checkout Service"
        options={{
          title: false,
        }}
        component={CheckoutServiceNavigator}
      />
    </Stack.Navigator>
  );
}

export default function HomeServiceNavigator() {
  return <MyStack />;
}
