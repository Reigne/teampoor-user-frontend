import React, { useState } from "react";
import { Text, Image, TouchableOpacity, Linking } from "react-native";
import { View } from "native-base";
// import UserOrderList from "./UserOrderList";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  BanknotesIcon,
  CheckBadgeIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardDocumentCheckIcon,
  HandThumbUpIcon,
  TruckIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBox } from "@fortawesome/free-solid-svg-icons/faBox";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

const OrderDetails = (props) => {
  // console.log(props.route.params, "view order");
  const { order } = props.route.params;
  const [showMore, setShowMore] = useState(false);
  const [token, setToken] = useState();

  const html = `
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <style>
      body {
        font-family: Arial, sans-serif;
        text-align: center;
      }
      .receipt-container {
        margin: 20px;
      }
      .receipt-header {
        margin-bottom: 20px;
      }
      .receipt-header h1 {
        font-size: 24px;
        margin: 0;
      }
      .receipt-info {
        margin-bottom: 20px;
      }
      .receipt-info p {
        margin: 5px 0;
      }
      .receipt-items {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .receipt-items th, .receipt-items td {
        border: 1px solid #ddd;
        padding: 8px;
      }
      .receipt-items th {
        background-color: #f2f2f2;
      }
      .receipt-total {
        margin-top: 20px;
      }
      .receipt-total p {
        margin: 5px 0;
      }
    </style>
  </head>
  <body>
    <div class="receipt-container">
      <div class="receipt-header">
        <h1>Receipt</h1>
      </div>
      <div class="receipt-info">
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Receipt #: ${order._id}</p>
      </div>
      <table class="receipt-items">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderItems
            .map(
              (item) => `
            <tr>
              <td>${item.product.name}</td>
              <td>${item.quantity}</td>
              <td>${parseFloat(item.product.price).toLocaleString("en-US", {
                style: "currency",
                currency: "PHP",
              })}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div class="receipt-total">
        <p>Total: ${parseFloat(order.totalPrice).toLocaleString("en-US", {
          style: "currency",
          currency: "PHP",
        })}</p>
      </div>
    </div>
  </body>
  </html>
  `;

  let generatePdf = async () => {
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });

    await shareAsync(file.uri);
  };

  const paymentHandler = () => {
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
      .get(`${baseURL}orders/payment/${order._id}`, order, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Payment Successful",
            text2: "Your payment has been completed successfully.",
          });

          console.log(res, "response");

          handlePayMongo(res.data.items, res.data.temporaryLink);

          // const { checkoutUrl } = res.data;

          // Open the checkout URL in the user's default browser
          // Linking.openURL(checkoutUrl);

          // Redirect user to payment page

          // setTimeout(() => {
          //   dispatch(actions.clearCart());
          //   navigation.navigate("SuccessOrder");
          // }, 500);
        }
      })
      .catch((error) =>
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Error",
          text2:
            error.response.data ||
            "Something went wrong. Please try again later.",
        })
      );
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
    <KeyboardAwareScrollView className="flex-1 px-3 bg-white">
      <View className="flex-1 mb-4">
        <View className="flex">
          <Text className="font-extrabold text-2xl">Track Order</Text>
          <Text className="text-base"># {order._id}</Text>
        </View>

        {/* <TouchableOpacity
          className="bg-red-500 p-2 rounded-lg"
          onPress={() => generatePdf()}
        >
          <Text className="text-white">Print e-Receipt</Text>
        </TouchableOpacity> */}

        <View className="flex bg-zinc-100 rounded-lg mt-1 py-3">
          <View
            className={showMore === false ? "overflow-hidden max-h-72" : ""}
          >
            {order.orderStatus
              .slice()
              .reverse()
              .map((status, index) => (
                <View key={index} className="flex flex-row space-x-3 px-2">
                  {/* <View className="border-r-2 border-red-500"></View> */}

                  <View className="w-[60] items-center">
                    <Text>
                      {status.timestamp
                        ? new Date(status.timestamp).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          ) +
                          "\n" +
                          new Date(status.timestamp).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: false,
                            }
                          )
                        : ""}
                    </Text>
                  </View>

                  {/* <Text>{status.status}</Text> */}

                  <View className="items-center w-[25]">
                    {status.status === "Pending" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <ClipboardDocumentCheckIcon color="white" size={18} />
                      </View>
                    ) : status.status === "TOPAY" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <BanknotesIcon color="white" size={18} />
                        {/* <ArchiveBoxArrowDownIcon color="white" size={18} /> */}
                      </View>
                    ) : status.status === "TOSHIP" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <FontAwesomeIcon icon={faBox} color="white" size={18} />
                        {/* <ArchiveBoxArrowDownIcon color="white" size={18} /> */}
                      </View>
                    ) : status.status === "PAID" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <CheckBadgeIcon color="white" size={18} />
                      </View>
                    ) : status.status === "TORECEIVED" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <TruckIcon color="white" size={18} />
                      </View>
                    ) : status.status === "DELIVERED" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <CheckIcon color="white" size={18} />
                      </View>
                    ) : status.status === "FAILEDATTEMPT" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <XMarkIcon color="white" size={18} />
                      </View>
                    ) : status.status === "CANCELLED" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <XMarkIcon color="white" size={18} />
                      </View>
                    ) : status.status === "RETURNED" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <XMarkIcon color="white" size={18} />
                      </View>
                    ) : status.status === "COMPLETED" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <CheckIcon color="white" size={18} />
                      </View>
                    ) : (
                      <View className="bg-red-500 p-1 rounded-full"></View>
                    )}

                    <View
                      className="bg-red-500"
                      style={{ width: 3, height: 75 }}
                    ></View>
                  </View>

                  <View className="px-2 w-3/4">
                    {status.status === "Pending" ? (
                      <Text className="font-bold">Order placed</Text>
                    ) : status.status === "TOSHIP" ? (
                      <Text className="font-bold">
                        Packed and Ready To Ship
                      </Text>
                    ) : status.status === "TORECEIVED" ? (
                      <Text className="font-bold">In Transit</Text>
                    ) : status.status === "DELIVERED" ? (
                      <Text className="font-bold">Delivered</Text>
                    ) : status.status === "COMPLETED" ? (
                      <Text className="font-bold">Order Completed </Text>
                    ) : (
                      ""
                    )}
                    <Text className="text-left text-wrap">
                      {status.message}
                    </Text>
                  </View>

                  {/* Add additional details as needed */}
                </View>
              ))}
          </View>

          <View className="flex justify-center items-center mt-3">
            {showMore === false ? (
              <View className="space-x-1 items-center ">
                <Text
                  className="text-zinc-700"
                  onPress={() => setShowMore(true)}
                >
                  Show More
                </Text>

                <ChevronDownIcon
                  color="black"
                  size={14}
                  onPress={() => setShowMore(true)}
                />
              </View>
            ) : (
              <View className="space-x-1 items-center ">
                <ChevronUpIcon
                  color="black"
                  size={14}
                  onPress={() => setShowMore(false)}
                />
                <Text
                  className="text-zinc-700"
                  onPress={() => setShowMore(false)}
                >
                  Show Less
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="mt-3">
          <Text className="text-lg font-bold">Delivery Address</Text>

          <View className="bg-zinc-100 rounded-lg p-3 space-y-2">
            <Text className="text-base">{order.fullname}</Text>
            <Text>(+63) {order.phone}</Text>

            <View className="">
              <Text className="mb-1">
                {order.address}, {order.region}, {order.province}, {order.city},{" "}
                {order.barangay}, {order.postalcode}
              </Text>
            </View>
          </View>
        </View>

        {/* <Text className="mt-3 font-bold text-lg">Payment</Text>
        <View className="bg-zinc-100 rounded-lg p-3 space-y-4">
          <Text></Text>
        </View> */}

        <Text className="mt-3 font-bold text-lg">Orders</Text>
        <View className="bg-zinc-100 rounded-lg p-3 space-y-4">
          <View className="flex flex-row space-x-4">
            <View className="w-14">
              <Text className="font-semibold">Image</Text>
            </View>
            <View className="w-32">
              <Text className="font-semibold">Name</Text>
            </View>
            <View className="w-20">
              <Text className="font-semibold">Quantity</Text>
            </View>
            <View>
              <Text className="font-semibold">Price</Text>
            </View>
          </View>

          <View className="border-t border-zinc-300"></View>

          {order.orderItems.map((item, index) => (
            <View className="flex flex-row space-x-4">
              <View>
                <Image
                  className="rounded mb-1"
                  style={{
                    width: 54,
                    height: 54,
                  }}
                  source={
                    item.product.images[0]?.url
                      ? { uri: item.product.images[0]?.url }
                      : require("../../../assets/images/teampoor-default.png")
                  }
                  alt="images"
                />
              </View>

              <View className="w-40">
                <Text className="font-bold" numberOfLines={1}>{item.product.name}</Text>
                <Text className="text-zinc-600 text-xs" numberOfLines={2} ellipsizeMode="tail">
                  {item.product.description}
                </Text>
              </View>

              <View className="w-6 items-end">
                <Text>{item.quantity}x</Text>
              </View>

              <View className="grow items-end">
                <Text>
                  {parseFloat(item.product?.price).toLocaleString("en-US", {
                    style: "currency",
                    currency: "PHP",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
            </View>
          ))}

          <View className="space-y-2">
            <View className="border-t border-zinc-300" />

            <View>
              <View className="flex flex-row justify-end">
                <Text>Total Price: </Text>
                <Text className="font-bold">
                  {parseFloat(order?.totalPrice).toLocaleString("en-US", {
                    style: "currency",
                    currency: "PHP",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
              <View className="flex flex-row justify-end">
                <Text>Payment Method: </Text>
                <Text className="font-bold">{order.paymentMethod}</Text>
              </View>
            </View>
            {order.orderStatus?.[order.orderStatus?.length - 1]?.status ===
              "TOPAY" && (
              <TouchableOpacity
                className="bg-red-500 p-2 rounded-lg"
                onPress={() => paymentHandler()}
              >
                <Text className="text-white font-semibold text-center">
                  Pay Now
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {order.orderStatus?.[order.orderStatus?.length - 1]?.status ===
          "COMPLETED" && (
          <TouchableOpacity
            className="bg-red-500 rounded-xl p-3 mt-3"
            onPress={() => generatePdf()}
          >
            <Text className="text-white">Generate E-Receipt</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default OrderDetails;
