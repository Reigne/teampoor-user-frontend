import React, { useState } from "react";
import { Text, Image, TouchableOpacity } from "react-native";
import { View, TextArea } from "native-base";
// import UserOrderList from "./UserOrderList";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardDocumentCheckIcon,
  TruckIcon,
} from "react-native-heroicons/solid";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBox } from "@fortawesome/free-solid-svg-icons/faBox";
import { Modal, Button } from "native-base";
import { Rating, AirbnbRating } from "react-native-ratings";
import baseURL from "../../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const ReviewOrder = (props) => {
  //   console.log(props.route.params, "view order");
  const { order } = props.route.params;
  const [isOrderListVisible, setIsOrderListVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5); // Set an initial value if needed
  const [productId, setProductId] = useState("");
  const navigation = useNavigation();

  const addReview = () => {
    console.log(productId);
    const user = order.user;
    // console.log(user)

    axios
      .put(`${baseURL}products/create-review/${productId}`, {
        comment,
        rating,
        user,
      })
      .then((res) => {
        setShowModal(false);
        setComment("");
        Toast.show({
          type: "success",
          text1: "Thank you for your feedback!",
          text2: "Review has been created",
        }).catch((error) => {
          // Handle error if needed
          console.error("Error adding review:", error);
        });
      });
  };

  return (
    <KeyboardAwareScrollView className="flex-1 px-3 bg-white">
      <View className="flex-1 mb-4">
        <View className="flex mb-3">
          <Text className="font-extrabold text-2xl">Review Order</Text>
          {/* <Text className="text-base"># {order._id}</Text> */}
        </View>

        {/* <Text className="mt-3 font-bold text-lg">Orders</Text> */}
        {/* <View className="flex flex-row space-x-4">
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
          </View> */}

        {/* <View className="border-t border-zinc-300"></View> */}
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
            <Modal.Footer className="space-x-2">
              <Button
                flex="1"
                colorScheme="gray"
                variant="outline"
                onPress={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                flex="1"
                colorScheme="green"
                onPress={() => {
                  addReview();
                }}
              >
                Post
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        {order.orderItems.map((item, index) => (
          <>
            <View className="bg-zinc-100 rounded-lg p-3 mb-3">
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
                        ? {
                            uri: item.product.images[0]?.url,
                          }
                        : require("../../../assets/images/teampoor-default.png")
                    }
                    alt="images"
                  />
                </View>

                <View className="w-40">
                  <Text className="font-bold">{item.product.name}</Text>
                  <Text className="text-zinc-600">
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

              <View className="flex flex-row justify-end space-x-3">
                <TouchableOpacity
                  className="bg-green-500 p-3 rounded-lg"
                  onPress={() => (
                    setShowModal(true), setProductId(item.product?._id)
                  )}
                >
                  <Text className="text-white font-semibold">Review</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="border p-3 rounded-lg"
                  onPress={() =>
                    navigation.navigate("Product Detail", {
                      item: item.product,
                    })
                  }
                >
                  <Text className="">View Product</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ))}

        {/* <View className="border-t border-zinc-300">
            <View className="flex flex-row justify-end mt-2">
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
            <View className="flex flex-row justify-end mt-2">
              <Text>Payment Method: </Text>
              <Text className="font-bold">
                {order.eWallet || order.paymentMethod}
              </Text>
            </View>
          </View> */}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ReviewOrder;
