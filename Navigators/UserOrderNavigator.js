import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

//screens
import All from "../Screens/User/Order/All";
import Pending from "../Screens/User/Order/Pending";
import ToPay from "../Screens/User/Order/ToPay";
import ToShip from "../Screens/User/Order/ToShip";
import ToReceive from "../Screens/User/Order/ToReceive";
import Completed from "../Screens/User/Order/Completed";

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        scrollEnabled: true,
        tabStyle: { width: 110 },
        // tabBarWidth: 500, // Set the fixed width for each tab
        style: { backgroundColor: 'white' },
        indicatorStyle: { backgroundColor: 'red' },
      }}
    >
      <Tab.Screen name="All" component={All} />
      {/* <Tab.Screen name="Pending" component={Pending} /> */}
      <Tab.Screen name="ToPay" component={ToPay} />
      <Tab.Screen name="ToShip" component={ToShip} />
      <Tab.Screen name="ToReceive" component={ToReceive} />
      <Tab.Screen name="Completed" component={Completed} />
    </Tab.Navigator>
  );
}

export default function UserOrderNavigator() {
  return <MyTabs />;
}
