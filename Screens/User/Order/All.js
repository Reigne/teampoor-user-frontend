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
import { View, FlatList, Badge, Pressable, Modal } from "native-base";
// import UserOrderList from "./UserOrderList";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthGlobal from "../../../Context/Store/AuthGlobal";
import baseURL from "../../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

const All = (props) => {
  const context = useContext(AuthGlobal);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [itemsToLoad, setItemsToLoad] = useState(5); // Number of items to initially load
  const [itemsPerPage, setItemsPerPage] = useState(5); // Number of items to load more
  const [loadingMore, setLoadingMore] = useState(false); // Flag to indicate loading more items
  const [showModal, setShowModal] = useState(false);
  const [itemID, setItemID] = useState("");

  const navigation = useNavigation();

  // console.log(context);

  const userid = context.stateUser.user.userId;

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
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

  const loadMoreItems = () => {
    setLoadingMore(true); // Set loading more flag to true
    setItemsToLoad((prevItemsToLoad) => prevItemsToLoad + itemsPerPage);
    setLoadingMore(false); // Set loading more flag to false when done
  };

  // Function to format the date as "1/5/2024"
  const formatDate = (dateString) => {
    const options = { month: "numeric", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const viewOrderDetail = (item) => {
    // console.log(item);
    navigation.navigate("OrderDetails", { order: item });
  };

  const reviewOrder = (item) => {
    // console.log(item);

    navigation.navigate("ReviewOrder", { order: item });
  };

  const updateStatus = (id) => {
    try {
      // console.log(id, "id status");
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

  const cancelOrder = (id) => {
    try {
      console.log(itemID, "id status");
      axios
        .put(
          `${baseURL}orders/${id}`,
          { status: "CANCELLED" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          fetchOrders();

          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order has been cancelled",
            text2: `#${id} Order has been cancelled`,
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

  // const actionModal = (id) => {
  //   setItemID(id);
  //   showModal(true);
  // };

  const renderOrders = ({ item }) => {
    // console.log(item);

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
                  {/* <Text>#{item._id}</Text> */}
                  {/* <Text>Date Ordered: {item.dateOrdered}</Text> */}
                  <Text>
                    {item.dateOrdered
                      ? new Date(item.dateOrdered).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </Text>

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
                              ?.status === "PAID"
                          ? "success"
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
                              ?.status === "PAID"
                          ? "Paid"
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
                        item.orderItems[0]?.product?.images[0]?.url
                          ? { uri: item.orderItems[0]?.product?.images[0]?.url }
                          : require("../../../assets/images/teampoor-default.png")
                      }
                      style={{ width: 75, height: 75 }}
                      className="rounded "
                    />

                    {item.orderItems?.length > 1 ? (
                      <Text className="mt-2">
                        +{item.orderItems?.length - 1} more
                      </Text>
                    ) : null}
                  </View>

                  <View className="space-y-1 flex-1">
                    <Text
                      className="font-bold text-base"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.orderItems[0]?.product?.name}
                    </Text>

                    <Text>Quantity: {item.orderItems[0]?.quantity}</Text>
                    <Text>
                      {parseFloat(
                        item.orderItems[0]?.product?.price
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
                    "Pending" && (
                    <TouchableOpacity
                      onPress={() => [setShowModal(true), setItemID(item._id)]}
                      className="border border-red-500 px-3 py-2 rounded-lg justify-center items-center"
                    >
                      <Text className="text-red-500">Cancel Order</Text>
                    </TouchableOpacity>
                  )}

                  {item.orderStatus?.[item.orderStatus?.length - 1]?.status ===
                    "TOPAY" && (
                    <TouchableOpacity
                      onPress={() => [setShowModal(true), setItemID(item._id)]}
                      className="border border-red-500 px-3 py-2 rounded-lg justify-center items-center"
                    >
                      <Text className="text-red-500">Cancel Order</Text>
                    </TouchableOpacity>
                  )}

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

  const renderFooter = () => {
    console.log("Loading more:", loadingMore);
    if (loadingMore) {
      return (
        <View
          style={{
            paddingVertical: 20,
            backgroundColor: "rgba(255, 0, 0, 0.1)",
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View className="flex-1 bg-white py-3">
      {/* <View style={{ paddingHorizontal: 10, marginBottom: 10, marginTop: 5 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "#F0F0F0",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <TextInput placeholder="Search Order" />
          <MagnifyingGlassIcon color="black" size={20} />
        </View>
      </View> */}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={allOrders.slice().reverse().slice(0, itemsToLoad)}
          renderItem={renderOrders}
          keyExtractor={(item) => item.id?.toString()}
          onEndReached={loadMoreItems}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter} // Render the loading indicator at the bottom
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center">
              <View>
                <Image
                  style={{ width: 120, height: 120 }} // Adjust the width and height as needed
                  source={require("../../../assets/images/no-found.png")}
                  alt="empty-cart"
                />
              </View>

              <View className="flex justify-center items-center">
                <Text className="text-xl font-bold text-red-500">
                  NO ORDER FOUND
                </Text>
                <Text className="text-xs">
                  Looks like you haven't made your order yet.
                </Text>
              </View>
            </View>
          }
        />
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="500px">
          <Modal.CloseButton />
          <Modal.Body>
            <View className="space-y-4">
              <View className="flex-1">
                <View className="justify-center items-center flex-1 space-y-2">
                  {/* Your modal content goes here */}

                  <ExclamationCircleIcon color="#ef4444" size={58} />

                  <View>
                    <Text className="text-xl font-bold">Cancel Order</Text>
                  </View>

                  <View className="flex-1 items-center">
                    <Text>Are you sure you want to</Text>
                    <Text>cancel the order?</Text>
                  </View>

                  <View className="flex-1 items-center">
                    <Text className="text-xs">
                      This action cannot be undone.
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex-1 flex-row">
                <View className="flex-1 flex-row justify-center items-center space-x-2">
                  <TouchableOpacity
                    className="bg-zinc-200 p-3 rounded grow items-center"
                    onPress={() => {
                      setShowModal(false);
                    }}
                  >
                    <Text>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-red-500 p-3 rounded grow items-center"
                    onPress={() => {
                      // Handle modal action
                      [setShowModal(false), cancelOrder(itemID)];
                    }}
                  >
                    <Text className="text-white">Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </View>
  );
};

export default All;
