import React, { useContext, useState, useCallback } from "react";
import {
  Text,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// import baseURL from "../../assets/common/baseUrl";
// import AuthGlobal from "../../Context/Store/AuthGlobal";
// import { logoutUser } from "../../Context/Actions/Auth.actions";
import Icon from "react-native-vector-icons/FontAwesome";
import { View, FlatList, Badge, Pressable } from "native-base";
// import UserOrderList from "./UserOrderList";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MagnifyingGlassIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthGlobal from "../../../Context/Store/AuthGlobal";
import baseURL from "../../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

const Pending = (props) => {
  const context = useContext(AuthGlobal);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();

  const navigation = useNavigation();

  console.log(context);

  const userid = context.stateUser.user.userId;

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));

      fetchOrders();

      return () => {
        setAllOrders([]);
      };
    }, [])
  );

  const fetchOrders = () => {
    axios
      .get(`${baseURL}orders/user/${userid}`, userid)
      .then((res) => {
        setAllOrders(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  // Function to format the date as "1/5/2024"
  const formatDate = (dateString) => {
    const options = { month: "numeric", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const viewOrderDetail = (item) => {
    console.log(item);

    navigation.navigate("OrderDetails", { order: item });
  };

  const reviewOrder = (item) => {
    console.log(item);

    navigation.navigate("ReviewOrder", { order: item });
  };

  const updateStatus = (id) => {
    try {
      console.log(id, "id status");
      axios
        .put(
          `${baseURL}orders/${id}`,
          { status: "COMPLETED" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          fetchOrders();

          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order has been completed",
            text2: `#${id} Order has been completed`,
          });
        });
    } catch (error) {
      console.error(error);
      // Handle errors, show an error toast, etc.
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    }
  };

  const renderOrders = ({ item }) => {
    console.log(item);

    return (
      <View className="px-3 py-1">
        <Pressable
          onPress={() => viewOrderDetail(item)} // Fix the function call
          _pressed={{
            bg: "white",
          }}
        >
          {({ isPressed }) => (
            <View
              style={{
                transform: [{ scale: isPressed ? 0.96 : 1 }],
              }}
              className="bg-white rounded-lg"
            >
              <View className="flex bg-zinc-100 p-5 rounded-lg">
                {/* <View className="flex justify-end flex-row">
                  <Text>{formatDate(item.dateOrdered)}</Text>
                </View> */}
                <View className="flex flex-row justify-between mt-3">
                  <Text>#{item._id}</Text>

                  <View>
                    <Badge
                      colorScheme={
                        item.orderStatus?.[item.orderStatus?.length - 1]
                          ?.status === "Pending"
                          ? "info"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "TOPAY"
                          ? "info"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "TOSHIP"
                          ? "info"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "TORECEIVED"
                          ? "info"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "FAILEDATTEMPT"
                          ? "info"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "DELIVERED"
                          ? "success"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "COMPLETED"
                          ? "success"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "RETURNED"
                          ? "danger"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "CANCELLED"
                          ? "danger"
                          : "gray" // Set a default color for other cases if needed
                      }
                      className="rounded"
                    >
                      {/* {item.orderStatus?.[item.orderStatus?.length - 1]?.status || "No Status"} */}

                      {
                        item.orderStatus?.[item.orderStatus?.length - 1]
                          ?.status === "Pending"
                          ? "Pending"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "TOPAY"
                          ? "To Pay"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "TOSHIP"
                          ? "To Ship"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "TORECEIVED"
                          ? "To Receive"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "FAILEDATTEMPT"
                          ? "To Receive"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "DELIVERED"
                          ? "Received"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "COMPLETED"
                          ? "Completed"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "RETURNED"
                          ? "Returned"
                          : item.orderStatus?.[item.orderStatus?.length - 1]
                              ?.status === "CANCELLED"
                          ? "Cancelled"
                          : "gray" // Set a default color for other cases if needed
                      }
                    </Badge>
                  </View>
                </View>

                <View className="flex flex-row mt-3 space-x-4">
                  <View className="flex justify-center items-center">
                    <Image
                      source={
                        item.orderItems[0].product.images[0]?.url
                          ? { uri: item.orderItems[0].product.images[0]?.url }
                          : require("../../../assets/images/teampoor-default.png")
                      }
                      style={{ width: 75, height: 75 }}
                      className="rounded "
                    />

                    <Text className="mt-2">+{item.orderItems.length} more</Text>
                  </View>

                  <View className="space-y-1">
                    <Text className="font-bold text-base">
                      {item.orderItems[0].product?.name}
                    </Text>

                    <Text>Quantity: {item.orderItems[0].quantity}</Text>
                    <Text>
                      {parseFloat(
                        item.orderItems[0].product?.price
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "PHP",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-end border-t border-zinc-300 mt-3">
                  <View className="flex-row mt-3">
                    <Text>Total Price: </Text>
                    {/* <Text>{item.totalPrice}</Text> */}
                    <Text
                      className="font-bold"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {parseFloat(item?.totalPrice).toLocaleString("en-US", {
                        style: "currency",
                        currency: "PHP",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  </View>
                </View>
                <View className="flex flex-row justify-end mt-3 space-x-3">
                  {item.orderStatus?.[item.orderStatus?.length - 1]?.status ===
                  "DELIVERED" ? (
                    <TouchableOpacity
                      onPress={() => updateStatus(item._id)}
                      className=" bg-green-500 px-8 py-2 rounded-lg justify-center items-center"
                    >
                      <Text className="text-white font-semibold">
                        Order Received
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  {item.orderStatus?.[item.orderStatus?.length - 1]?.status ===
                    "COMPLETED" && (
                    <TouchableOpacity
                      onPress={() => reviewOrder(item)}
                      className="bg-green-500 px-8 py-2 rounded-lg justify-center items-center"
                    >
                      <Text className="text-white font-semibold">Rate</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-white pb-5">
      <View className="flex px-3 mb-3 mt-5">
        {/* <Text className="font-extrabold text-lg">All</Text> */}

        <View className="flex flex-row justify-between bg-zinc-100 p-3 rounded-lg items-center">
          {/* <View className="flex-row items-center space-x-2"> */}
          <TextInput placeholder="Search Order" />
          <MagnifyingGlassIcon color="black" size={20} />
          {/* </View> */}
        </View>
      </View>
      <View className="flex">
        <View>
          <FlatList
            data={allOrders.slice().reverse()}
            renderItem={renderOrders}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Pending;
