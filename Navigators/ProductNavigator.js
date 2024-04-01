import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProductForm from "../Screens/Admin/ProductForm";
import Products from "../Screens/Admin/Products";


const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        component={Products}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductForm"
        component={ProductForm}
        options={{
          title: false,
        }}
      />
     
    </Stack.Navigator>
  );
}

export default function AdminFormNavigator() {
  return <MyStack />;
}
