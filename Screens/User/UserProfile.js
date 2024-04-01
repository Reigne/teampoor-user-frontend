import React, { useContext, useState, useCallback } from "react";
import {
  Text,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { logoutUser } from "../../Context/Actions/Auth.actions";
import Icon from "react-native-vector-icons/FontAwesome";
import { View, FlatList } from "native-base";
import UserOrderList from "./UserOrderList";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  ArchiveBoxIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  HomeIcon,
  HomeModernIcon,
  LockClosedIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  UserIcon,
} from "react-native-heroicons/solid";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMotorcycle } from "@fortawesome/free-solid-svg-icons/faMotorcycle";
import { faCalendar } from "@fortawesome/free-solid-svg-icons/faCalendar";

const UserProfile = (props) => {
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);

  const [userProfile, setUserProfile] = useState("");
  const [allOrders, setAllOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState(3); // Number of orders to initially display
  const [isLoading, setIsLoading] = useState(true);
  const [hasMoreOrders, setHasMoreOrders] = useState(true);
  const [image, setImage] = useState("");

  // console.log(context.stateUser.userProfile.email, 'what is this')

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        navigation.navigate("Login");
      }

      const fetchData = async () => {
        try {
          const jwtToken = await AsyncStorage.getItem("jwt");
          const response = await axios.get(
            `${baseURL}users/${context.stateUser.user.userId}`,
            {
              headers: { Authorization: `Bearer ${jwtToken}` },
            }
          );

          setUserProfile(response.data);
          setImage(response.data.avatar?.url || "");
          getOrders();
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();

      return () => {
        setUserProfile("");
        setImage("");
        setAllOrders([]);
      };
    }, [context.stateUser.isAuthenticated])
  );

  const getOrders = () => {
    const userid = context.stateUser.user.userId;

    console.log(userid, "id");
    axios
      .get(`${baseURL}orders/user/${userid}`, userid)
      .then((res) => {
        setAllOrders(res.data);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const loadMoreOrders = () => {
    // Check if there are more orders to load
    if (visibleOrders < allOrders.length) {
      // Increase the number of visible orders (e.g., by 5)
      setVisibleOrders((prevVisibleOrders) => prevVisibleOrders + 5);
    } else {
      // No more orders to load
      setHasMoreOrders(false);
    }
  };

  const hideMoreOrders = () => {
    setHasMoreOrders(true);
    setVisibleOrders(3);
  };

  console.log(context, "context");
  return (
    <KeyboardAwareScrollView className="flex-1 bg-white">
      <View
        className="bg-red-500"
        style={{ borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}
      >
        <View className="flex flex-row gap-8 justify-around mt-8 px-5">
          <View className="w-24">
            <Icon name="angle-left" style={{ color: "white" }} size={24} />
          </View>
          <View className="ml-4 grow">
            <Text className="font-extrabold text-xl text-center text-white tracking-wider">
              Profile
            </Text>
          </View>
          <View className="w-24">
            {/* <TouchableOpacity
              onPress={() => [
                navigation.navigate("Login"),
                AsyncStorage.removeItem("jwt"),
                logoutUser(context.dispatch),
              ]}
              className="bg-white px-3 py-1 rounded-lg"
            >
              <Text className="font-bold text-red-500">Logout</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        <View className="flex flex-row gap-8 justify-center mt-1">
          <View className="justify-center">
            {/* <Icon
              name="camera"
              style={{ color: "rgba(0, 0, 0, 0.5)" }}
              size={24}
            /> */}
          </View>
          <View className="border-2 border-red-300 rounded-full ">
            <Image
              // source={require("../../assets/images/default-profile.jpg")}
              source={
                image
                  ? { uri: image }
                  : require("../../assets/images/default-profile.jpg")
              }
              style={{ width: 200, height: 200 }}
              className="rounded-full"
            />
          </View>
          <View className="justify-center">
            {/* <Icon
              name="edit"
              style={{ color: "rgba(0, 0, 0, 0.7)" }}
              size={24}
            /> */}
          </View>
        </View>

        <View className="mt-5 mb-5 space-y-1">
          <Text className="text-center text-2xl font-bold text-white">
            {userProfile ? userProfile.firstname : "Unknown"}{" "}
            {userProfile ? userProfile.lastname : "Unknown"}
          </Text>
          <Text className="text-center text-md mb-7 text-white">
            {userProfile ? userProfile.email : "Unknown"}
          </Text>
        </View>

        {/* <View className="px-5 flex-row items-center space-x-4">
          <View className="rounded-full ">
            <Image
              // source={require("../../assets/images/default-profile.jpg")}
              source={
                image
                  ? { uri: image }
                  : require("../../assets/images/default-profile.jpg")
              }
              style={{ width: 150, height: 150 }}
              className="rounded-full"
            />
          </View>

          <View className="flex">
            <Text className="text-white">Frans Manlangit</Text>
            <Text className="text-white">Student</Text>
          </View>
        </View> */}
      </View>

      <View className="p-5 space-y-3 mt-2">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UserUpdate", { user: userProfile })
          }
        >
          <View className="flex-row bg-zinc-200 p-3 items-center rounded-xl">
            <View className="p-2 bg-zinc-100 rounded-lg ">
              <UserIcon color="#71717a" />
            </View>
            <View className="flex flex-row justify-between items-center grow pl-5">
              <View className>
                <Text>Edit Profile</Text>
              </View>
              <View>
                <ChevronRightIcon color="#71717a" size={18} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Address", { user: userProfile })}
        >
          <View className="flex-row bg-zinc-200 p-3 items-center rounded-xl">
            <View className="p-2 bg-zinc-100 rounded-lg ">
              <HomeIcon color="#71717a" />
            </View>
            <View className="flex flex-row justify-between items-center grow pl-5">
              <View className>
                <Text>Addresses</Text>
              </View>
              <View>
                <ChevronRightIcon color="#71717a" size={18} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ChangePassword", { user: userProfile })
          }
        >
          <View className="flex-row bg-zinc-200 p-3 items-center rounded-xl">
            <View className="p-2 bg-zinc-100 rounded-lg ">
              <LockClosedIcon color="#71717a" />
            </View>
            <View className="flex flex-row justify-between items-center grow pl-5">
              <View className>
                <Text>Change Password</Text>
              </View>
              <View>
                <ChevronRightIcon color="#71717a" size={18} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UserOrderNavigator", { user: userProfile })
          }
        >
          <View className="flex-row bg-zinc-200 p-3 items-center rounded-xl">
            <View className="p-2 bg-zinc-100 rounded-lg ">
              <ArchiveBoxIcon color="#71717a" />
            </View>
            <View className="flex flex-row justify-between items-center grow pl-5">
              <View className>
                <Text>My Orders</Text>
              </View>
              <View>
                <ChevronRightIcon color="#71717a" size={18} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Appointment", { user: userProfile })
          }
        >
          <View className="flex-row bg-zinc-200 p-3 items-center rounded-xl">
            <View className="p-2 bg-zinc-100 rounded-lg ">
              <FontAwesomeIcon icon={faCalendar} color="#71717a" size={22} />
            </View>
            <View className="flex flex-row justify-between items-center grow pl-5">
              <View className>
                <Text>My Service Appointment</Text>
              </View>
              <View>
                <ChevronRightIcon color="#71717a" size={18} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Motorcycles", { user: userProfile })
          }
        >
          <View className="flex-row bg-zinc-200 p-3 items-center rounded-xl">
            <View className="p-2 bg-zinc-100 rounded-lg ">
              {/* <ArchiveBoxIcon color="#71717a" /> */}
              <FontAwesomeIcon icon={faMotorcycle} color="#71717a" size={24} />
            </View>
            <View className="flex flex-row justify-between items-center grow pl-5">
              <View className>
                <Text>My Motorcycle</Text>
              </View>
              <View>
                <ChevronRightIcon color="#71717a" size={18} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UserDashboard", { user: userProfile })
          }
        >
          <View className="flex-row bg-zinc-200 p-3 items-center rounded-xl">
            <View className="p-2 bg-zinc-100 rounded-lg ">
              {/* <ArchiveBoxIcon color="#71717a" /> */}
              <Squares2X2Icon color="#71717a" size={24} />
            </View>
            <View className="flex flex-row justify-between items-center grow pl-5">
              <View className>
                <Text>My Dashboard</Text>
              </View>
              <View>
                <ChevronRightIcon color="#71717a" size={18} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => [
            navigation.navigate("Login"),
            AsyncStorage.removeItem("jwt"),
            logoutUser(context.dispatch),
          ]}
        >
          <View className="flex-row bg-zinc-200 p-3 items-center rounded-xl">
            <View className="p-2 bg-zinc-100 rounded-lg ">
              <ArrowRightOnRectangleIcon color="#ef4444" />
            </View>
            <View className="flex flex-row justify-between items-center grow pl-5">
              <View className>
                <Text className="text-red-500">Logout</Text>
              </View>
              <View>
                <ChevronRightIcon color="#ef4444" size={18} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default UserProfile;
