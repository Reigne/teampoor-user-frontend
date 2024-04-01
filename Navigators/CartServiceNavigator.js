import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ServiceCart from "../Screens/ServiceCart/ServiceCart";
// import CheckoutNavigator from "./CheckoutNavigator";
import CheckoutServiceNavigator from "./CheckoutServiceNavigator";

const Tab = createStackNavigator();
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Service Cart"
        component={ServiceCart}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen name="Checkout Service" component={CheckoutServiceNavigator} /> */}
    </Tab.Navigator>
  );
}

export default function CartServiceNavigator() {
  return <MyStack />;
}
