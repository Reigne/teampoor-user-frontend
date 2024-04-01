import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProductContainer from "../Screens/Product/ProductContainer";
import SingleProduct from "../Screens/Product/SingleProduct";
import SuccessOrder from "../Screens/Cart/Checkout/SuccessOrder";
import ServiceContainer from "../Screens/Service/ServiceContainer";
import Success from "../Screens/ServiceCart/Checkout/Success";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        component={ProductContainer}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Product Detail"
        component={SingleProduct}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Services"
        component={ServiceContainer}
        options={{
          headerShown: false,
        }}
      />

      {/* product */}
      <Stack.Screen
        name="SuccessOrder"
        component={SuccessOrder}
        options={{ headerShown: false }}
      />

      {/* service success */}
      <Stack.Screen
        name="Success"
        component={Success}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function HomeNavigator() {
  return <MyStack />;
}
