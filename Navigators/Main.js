import { View, Text } from "react-native";
import React, { useContext, useEffect } from "react";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";

//navigators
import UserNavigator from "../Navigators/UserNavigator";
import HomeNavigator from "./HomeNavigator";
import CartNavigator from "./CartNavigator";
import HomeServiceNavigator from "./HomeServiceNavigator";
import Notifications from "../Screens/Notification/Notifications";
import NotificationIcon from "../Shared/NotificationIcon";


import AuthGlobal from "../Context/Store/AuthGlobal";
import CartIcon from "../Shared/CartIcon";
import {
  BellIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  PresentationChartBarIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
} from "react-native-heroicons/solid";
import baseURL from "../assets/common/baseUrl";
import * as actions from "../Redux/Actions/notificationActions";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Tab = createBottomTabNavigator();

const Main = () => {
  const context = useContext(AuthGlobal);
  // const dispatch = useDispatch();

  // if (context.stateUser.user.role === "user") {
  //   useEffect(() => {
  //     axios
  //       .get(`${baseURL}notifications/unread/${context.stateUser.user.userId}`)
  //       .then((res) => {
  //         dispatch(actions.fetchUnreadCountSuccess(res.data.unreadCount)); // Dispatch action to update Redux store
  //       })
  //       .catch((error) => console.log(error));
  //   }, []);
  // }

  const getRouteName = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    console.log(routeName);

    if (
      routeName?.includes("Product Detail") ||
      routeName?.includes("SuccessOrder")
    ) {
      return "none";
    }

    return "flex";
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#ef4444",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon
              name="home"
              style={{ position: "relative" }}
              color={color}
              size={30}
            />
          ),
          tabBarStyle: { display: getRouteName(route) },
        })}
      />

      <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <CartIcon color={color} />,
        }}
      />

      <Tab.Screen
        name="HomeService"
        component={HomeServiceNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <WrenchScrewdriverIcon
              name="HomeService"
              color={color}
              size={26}
              style={{ position: "relative" }}
            />
          ),
        }}
      />


      <Tab.Screen
        name="User"
        component={UserNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <UserCircleIcon
              name="gear"
              style={{ position: "relative" }}
              color={color}
              size={30}
            />
          ),
        }}
      />

      {context.stateUser.user.role === "user" && (
        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <NotificationIcon
                color={color}
                userId={context.stateUser?.user?.userId}
              />
            ),
          }}
        />
      )}

    </Tab.Navigator>
  );
};

export default Main;
