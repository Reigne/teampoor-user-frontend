import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import {
  Pressable,
  Image,
  Badge,
  Select,
  VStack,
  CheckIcon,
  Input,
  TextArea,
} from "native-base";
import {
  BanknotesIcon,
  DocumentTextIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TruckIcon,
} from "react-native-heroicons/solid";
import { Modal, Button } from "native-base";
import { Rating, AirbnbRating } from "react-native-ratings";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import axios from "axios";

const UserOrderList = ({ item }) => {
  const [isOrderListVisible, setIsOrderListVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5); // Set an initial value if needed
  const [errors, setErrors] = useState({});
  const [productId, setProductId] = useState("");

  const handlePress = () => {
    setIsOrderListVisible(!isOrderListVisible);
  };

  // const validateForm = () => {
  //   let errors = {};

  //   if (!comment)
  //   errors.comment = "Current password is required";

  //   setErrors(errors);

  //   return Object.keys(errors).length === 0;
  // };

  const addReview = () => {
    // const id = item._id;
    // console.log(item.user._id);
    // if (!validateForm()) {
    //   return;
    // }

    const user = item.user

    axios
      .put(`${baseURL}products/create-review/${productId}`, {
        comment,
        rating,
        user,
      })
      .then((res) => {
        Toast.show({
          type: "success",
          text1: "Thank you for your feedback!",
          text2: "Review has been created",
        }).catch((error) => {
          // Handle error if needed
          console.error("Error adding review:", error);
        });

        setShowModal(false);
      });
  };

  return (
    <View className="mt-3 bg-white rounded-lg">
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="300px">
          <Modal.CloseButton />
          <Modal.Header>Review Product</Modal.Header>
          <Modal.Body>
            <View className="flex-1 justify-center space-y-4 ">
              <AirbnbRating
                count={5}
                reviews={["Bad", "Not Bad", "Good", "Very Good", "Amazing"]}
                defaultRating={5}
                size={34}
                onFinishRating={(value) => setRating(value)}
              />

              <View className="space-y-1">
                <Text>Comment</Text>
                <View>
                  <TextArea
                    variant="filled"
                    className=""
                    placeholder="Insert comment here"
                    // isInvalid={errors.comment ? true : false}
                    value={comment}
                    onChangeText={(text) => setComment(text)}
                  />
                </View>
              </View>
              {/* <Button.Group space={2}>
                <Button
                  colorScheme="green"
                  onPress={() => {
                    // [deleteUser(item.id), setShowModal(false)];
                  }}
                >
                  <Text className="font-bold text-white">Save</Text>
                </Button>
              </Button.Group> */}
            </View>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              colorScheme="green"
              onPress={() => {
                addReview(item._id);
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Pressable
        onPress={handlePress}
        _pressed={{
          bg: "#ef4444",
        }}
      >
        {({ isPressed }) => (
          <View
            style={{
              transform: [{ scale: isPressed ? 0.96 : 1 }],
            }}
            className="bg-white rounded-lg"
          >
            {console.log(item)}

            <View className="flex flex-row justify-between items-center p-4">
              {/* <View className="p-4 items-center w-28 ">
                <TruckIcon size="38" color="gray" />
                <View>
                  <Badge
                    colorScheme={
                      item.status === "Pending"
                        ? "info"
                        : item.status === "Delivered"
                        ? "success"
                        : item.status === "Cancelled"
                        ? "danger"
                        : "gray" // Set a default color for other cases if needed
                    }
                    className="rounded mt-2"
                  >
                    {item.status}
                  </Badge>
                </View>
              </View> */}

              <View className="flex-row">
                <Text>Order: #</Text>
                <Text className="text-red-600">{item._id}</Text>
              </View>

              <View>
                <Badge
                  colorScheme={
                    item.status === "Pending"
                      ? "info"
                      : item.status === "Delivered"
                      ? "success"
                      : item.status === "Cancelled"
                      ? "danger"
                      : "gray" // Set a default color for other cases if needed
                  }
                  className="rounded"
                >
                  {item.status}
                </Badge>
              </View>
            </View>

            <View className="p-2">
              {item.orderItems.map((orderItem, index) => (
                <View
                  key={index}
                  className="bg-zinc-200 mb-2 rounded-lg p-2 flex-row justify-between items-center"
                >
                  <View className="flex-row items-center gap-3">
                    {/* {console.log(orderItem)} */}
                    <Image
                      className="rounded mb-1"
                      style={{
                        width: 34,
                        height: 34,
                      }}
                      // source={{
                      //   uri: orderItem.product.image
                      //     ? orderItem.product.image
                      //     : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
                      // }}
                      source={
                        orderItem.product?.image
                          ? { uri: orderItem.product?.image }
                          : require("../../assets/images/teampoor-default.png")
                      }
                      alt="images"
                    />

                    <View className="flex-row">
                      <Text>{orderItem.product?.name}</Text>
                      <Text> x{orderItem.quantity}</Text>
                    </View>
                  </View>

                  <View className="flex-row">
                    <Text>Total </Text>
                    <Text>₱{orderItem.quantity * orderItem.product?.price}</Text>
                  </View>

                  {item.status === "Delivered" ? (
                    <View className="flex flex-row-reverse">
                      <TouchableOpacity
                        className="items-center"
                        onPress={() => (setShowModal(true), setProductId(orderItem.product?._id))}
                      >
                        <Text className="bg-green-500 text-white p-2 rounded-lg">
                          Review
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              ))}

              {/* <View className="flex-row-reverse">
                <View className="flex-row">
                  <Text className="font-semibold">Grand Total: </Text>
                  <Text className="text-red-500">₱{item.totalPrice}</Text>
                </View>
              </View> */}
            </View>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default UserOrderList;
