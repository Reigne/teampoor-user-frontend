import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Linking,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as actions from "../../../Redux/Actions/cartActions";
import baseURL from "../../../assets/common/baseUrl";
import axios from "axios";
import { Checkbox, Modal } from "native-base";

const Confirm = (props) => {
  const [token, setToken] = useState();
  const [isCheck, setIsCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const finalOrder = props.route.params;
  // console.log(finalOrder, "Final Order");

  const dispatch = useDispatch();
  let navigation = useNavigation();

  // Calculate the order total

  // useEffect(() => {
  // const orderTotal = finalOrder.order.order.orderItems.reduce(
  //   (total, orderItem) => total + orderItem.price * orderItem.quantity,
  //   0
  // );
  // }, []);

  const confirmOrder = () => {
    setIsLoading(true);

    const order = finalOrder.order.order;
    const payment = finalOrder.payment;

    // const requestBody = {
    //     order: order,
    //     payment: payment,
    //   };

    order.paymentMethod = payment.paymentMethod;
    order.eWallet = payment.eWallet;

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(`${baseURL}orders`, order, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order Placed Successfully!",
            text2: "Thank you for choosing us. Your order is on its way!",
          });

          if (finalOrder.payment.paymentMethod === "GCash") {
            console.log(res.data, "response");

            handlePayMongo(res.data.items, res.data.temporaryLink);

            // const { checkoutUrl } = res.data;

            // Linking.openURL(checkoutUrl);
          }

          setTimeout(() => {
            dispatch(actions.clearCart());

            navigation.navigate("SuccessOrder"); // Navigate to SuccessOrder screen
          }, 500);

          setIsLoading(false);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Order Placement Error",
          text2:
            error.response.data ||
            "Something went wrong. Please try again later.",
        });

        setIsLoading(false);
      });
  };

  const handlePayMongo = (items, link) => {
    const options = {
      method: "POST",
      url: "https://api.paymongo.com/v1/checkout_sessions",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization:
          "Basic c2tfdGVzdF9KMlBMVlp3ZHV3OExwV3hGeWhZZnRlQWQ6cGtfdGVzdF9kYmpQaUZDVGJqaHlUUnVCbmVRdW1OSkY=",
      },
      data: {
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            line_items: items,
            payment_method_types: ["gcash"],
            description: "TeamPoor - Motorcycle Shop",
            success_url: `${link}`,
          },
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        const checkoutUrl = response.data.data.attributes.checkout_url;
        Linking.openURL(checkoutUrl); // Redirect the user to the checkout URL
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-zinc-100">
      {props.route.params ? (
        <View>
          <View className="p-2 space-y-3">
            <Text className="font-bold text-lg">Order Summary</Text>
            <View className="bg-white p-3 rounded-lg">
              <View>
                <View className="flex flex-row justify-center">
                  <Text className="font-bold text-base">Delivery Address</Text>
                </View>

                <View className="flex flex-row justify-between mb-3 mt-5">
                  <Text className="font-semibold">Full Name:</Text>
                  <Text>{finalOrder.order.order.fullname}</Text>
                </View>

                <View className="flex flex-row justify-between mb-3">
                  <Text className="font-semibold">Phone Number:</Text>
                  <Text>{finalOrder.order.order.phone}</Text>
                </View>

                <View className="flex flex-row justify-between mb-3">
                  <Text className="font-semibold">Region:</Text>
                  <Text>{finalOrder.order.order.region}</Text>
                </View>

                <View className="flex flex-row justify-between mb-3">
                  <Text className="font-semibold">Province:</Text>
                  <Text>{finalOrder.order.order.province}</Text>
                </View>

                <View className="flex flex-row justify-between mb-3">
                  <Text className="font-semibold">City:</Text>
                  <Text>{finalOrder.order.order.city}</Text>
                </View>

                <View className="flex flex-row justify-between mb-3">
                  <Text className="font-semibold">Barangay:</Text>
                  <Text>{finalOrder.order.order.barangay}</Text>
                </View>

                <View className="flex flex-row justify-between mb-3">
                  <Text className="font-semibold">Postal Code:</Text>
                  <Text>{finalOrder.order.order.postalcode}</Text>
                </View>

                <View className="flex flex-row justify-between mb-3">
                  <Text className="font-semibold">Address:</Text>
                  <Text>{finalOrder.order.order.address}</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="p-2">
            <View className="bg-white p-3 rounded-lg">
              <View className="flex flex-row justify-center  mb-5">
                <Text className="font-bold text-base">Payment</Text>
              </View>
              <View className="flex flex-row justify-between mb-3">
                <Text className="font-semibold">Payment Method:</Text>
                <Text>{finalOrder.payment.paymentMethod}</Text>
              </View>
            </View>
          </View>

          <View className="p-2 mt-0">
            <View className="bg-white p-3 rounded">
              <View className="flex flex-row justify-center">
                <Text className="font-bold text-base">Order Information</Text>
              </View>

              {/* Log the finalOrder object */}
              {/* {console.log(finalOrder.order.order.orderItems, "sa baba")} */}
              {/* Check if orderItems exists before mapping */}
              {finalOrder.order.order.orderItems ? (
                finalOrder.order.order.orderItems.map((orderItem) => (
                  <View key={orderItem._id} className="mt-4">
                    <View className="flex flex-row ">
                      <View className="flex-none w-14 h-14 ">
                        <Image
                          className="rounded mb-1"
                          style={{
                            width: 35,
                            height: 35,
                          }}
                          // source={{
                          //   uri: orderItem?.images[0]?.url
                          //     ? orderItem.images[0].url
                          //     : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
                          // }}
                          source={
                            orderItem?.images[0]?.url
                              ? { uri: orderItem?.images[0]?.url }
                              : require("../../../assets/images/teampoor-default.png")
                          }
                          alt="product images"
                        />
                      </View>
                      <View className="flex-auto flex-row justify-between w-64">
                        <View className="">
                          <Text className="">
                            {orderItem.name} x{orderItem.quantity}
                          </Text>

                          <Text className="">
                            {orderItem.price?.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Text>
                        </View>

                        <Text className="text-red-500">
                          ₱{(orderItem.price * orderItem.quantity).toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    {/* <Text>Quantity: {orderItem.quantity}</Text>
                    <Text>Price: ${orderItem.price.toFixed(2)}</Text> */}
                  </View>
                ))
              ) : (
                <Text>No order items found.</Text>
              )}

              <View className="border-b border-zinc-200" />

              {finalOrder.order.order.orderItems ? (
                <View className="flex flex-row justify-end space-x-1 items-center my-3">
                  <Text className="">Grand Total</Text>
                  <Text className="text-red-500">
                    ₱
                    {finalOrder.order.order.totalPrice?.toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      ) : null}
      {/* <View className="px-4 my-2 flex flex-row space-x-2 items-center">
        <Checkbox
          colorScheme="info"
          isChecked={isCheck}
          onPress={() => setIsCheck(!isCheck)}
        />

        <View className="flex-wrap flex-row space-x-1 items-center">
          <Text>By placing this order, you agree to the</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Text className="text-blue-500">terms and conditions *</Text>
          </TouchableOpacity>
        </View>
      </View> */}

      <View className="px-4 my-4 ">
        <TouchableOpacity
          // className={
          //   isLoading
          //     ? "bg-zinc-500 py-4 rounded-2xl mt-5"
          //     : isCheck === false
          //     ? "bg-zinc-500 py-4 rounded-2xl mt-5"
          //     : "bg-red-500 py-4 rounded-2xl mt-5"
          // }
          className="bg-red-500 py-4 rounded-2xl"
          onPress={() => confirmOrder()}
          // disabled={isCheck === false}
        >
          <View className="flex flex-row space-x-2 items-center justify-center">
            <Text className="font-xl font-bold text-center text-white">
              {isLoading ? "Loading..." : "Place Order"}
            </Text>

            {isLoading && <ActivityIndicator size="small" color="white" />}
          </View>
        </TouchableOpacity>
      </View>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="500px">
          <Modal.CloseButton />
          <Modal.Body>
            <View className="space-y-4">
              <View className="flex-1">
                <View className="flex-1 space-y-2">
                  {/* Your modal content goes here */}

                  <View>
                    <Text className="text-xl font-bold">
                      Terms and Conditions
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text>
                      When scheduling a service appointment through the [Your
                      Motorcycle Shop] mobile application ("the App"), users
                      agree to the following terms and conditions:
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text>1. Appointment Booking:</Text>
                  </View>
                  <View className="flex-1">
                    <Text>
                      By booking a service appointment through the App, users
                      confirm their agreement to these terms and conditions.
                      Users must provide accurate information regarding the type
                      of service required and any specific requests or
                      instructions.:
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex-1 flex-row">
                <View className="flex-1 flex-row justify-center items-center space-x-2">
                  <TouchableOpacity
                    className="bg-green-500 p-2 rounded grow items-center"
                    onPress={() => {
                      [setShowModal(false), setIsCheck(true)];
                    }}
                  >
                    <Text className="text-white">Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="border border-zinc-500 p-2 rounded grow items-center"
                    onPress={() => {
                      [setShowModal(false), setIsCheck(true)];
                    }}
                  >
                    <Text className="">Cancel</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                      className="bg-red-500 p-3 rounded grow items-center"
                      onPress={() => {
                        // Handle modal action
                        [setShowModal(false), cancelOrder(itemID)];
                      }}
                    >
                      <Text className="text-white">Yes</Text>
                    </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </KeyboardAwareScrollView>
  );
};

export default Confirm;
