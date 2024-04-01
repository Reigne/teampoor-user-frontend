import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "../Screens/User/Login";
import Register from "../Screens/User/Register";
import Welcome from "../Screens/User/Welcome";
import UserProfile from "../Screens/User/UserProfile";
import UserUpdate from "../Screens/User/UserUpdate";
import ChangePassword from "../Screens/User/ChangePassword";
import AuthGlobal from "../Context/Store/AuthGlobal";
import UserOrder from "../Screens/User/UserOrder";
import UserOrderNavigator from "./UserOrderNavigator";
// import OrderDetails from "../Screens/User/Order/OrderDetails";

import OrderDetails from "../Screens/User/Order/OrderDetails";
import ReviewOrder from "../Screens/User/Order/ReviewOrder";
import Motorcycles from "../Screens/Motorcycle/Motorcycles";
import MotorcycleForm from "../Screens/Motorcycle/MotorcycleForm";
import UserDashboard from "../Screens/User/Dashboard/UserDashboard";
import AddFuel from "../Screens/User/Dashboard/AddFuel";
import Address from "../Screens/User/Address/Address";
import AddressForm from "../Screens/User/Address/AddressForm";
import Appointment from "../Screens/User/Appointment/Appointment";
import AppointmentDetails from "../Screens/User/Appointment/AppointmentDetails";
import MechanicFeedback from "../Screens/User/Appointment/MechanicFeedback";
import RequestBackJob from "../Screens/User/Appointment/RequestBackJob";

const Stack = createStackNavigator();

const UserNavigator = (props) => {
  const context = useContext(AuthGlobal);
  console.log(context, "constext");

  return (
    <Stack.Navigator>
      {context.stateUser.isAuthenticated ? (
        <>
          <Stack.Screen
            name="UserProfile"
            options={{ headerShown: false }}
            component={UserProfile}
          ></Stack.Screen>
          <Stack.Screen
            name="UserUpdate"
            component={UserUpdate}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="ChangePassword"
            component={ChangePassword}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="UserOrderNavigator"
            component={UserOrderNavigator}
            options={{ title: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="OrderDetails"
            component={OrderDetails}
            options={{ title: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="ReviewOrder"
            component={ReviewOrder}
            options={{ title: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="Motorcycles"
            component={Motorcycles}
            options={{ title: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="MotorcycleForm"
            component={MotorcycleForm}
            options={{ title: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="UserDashboard"
            component={UserDashboard}
            options={{ title: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="AddFuel"
            component={AddFuel}
            options={{ title: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="Address"
            component={Address}
            options={{ title: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="AddressForm"
            component={AddressForm}
            options={{ title: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="Appointment"
            component={Appointment}
            options={{ title: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="AppointmentDetails"
            component={AppointmentDetails}
            options={{ title: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="MechanicFeedback"
            component={MechanicFeedback}
            options={{
              title: false,
            }}
          />
          <Stack.Screen
            name="RequestBackJob"
            component={RequestBackJob}
            options={{
              title: false,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Welcome"
            options={{ headerShown: false }}
            component={Welcome}
          ></Stack.Screen>
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            component={Login}
          ></Stack.Screen>
          <Stack.Screen
            name="Register"
            options={{ headerShown: false }}
            component={Register}
          ></Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};

export default UserNavigator;
