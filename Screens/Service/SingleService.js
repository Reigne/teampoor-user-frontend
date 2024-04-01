import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  HStack,
  Center,
  Heading,
  useToast,
  Button,
  Divider,
} from "native-base";
import Swiper from "react-native-swiper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeftIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import * as actions from "../../Redux/Actions/serviceCartActions";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
// import { Rating, AirbnbRating } from 'react-native-ratings';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Rating, AirbnbRating } from "react-native-ratings";
import { useSelector } from "react-redux";

const SingleService = (props) => {
  const [item, setItem] = useState(props.route.params.item);
  const dispatch = useDispatch();

  const toast = useToast();
  const navigation = useNavigation();
  const serviceCartItems = useSelector((state) => state.serviceCartItems);

  return (
    <>
      <KeyboardAwareScrollView className="bg-white flex-1">
        <Swiper
          style={{ height: hp(55) }}
          showsButtons={false}
          paginationStyle={{ bottom: 10 }}
          className="bg-zinc-100"
        >
          {item.images.map((image, index) => (
            <Image
              key={index}
              style={{ width: wp(100), height: hp(55) }}
              source={
                image.url
                  ? { uri: image.url }
                  : require("../../assets/images/teampoor-default.png")
              }
              alt={`product image ${index}`}
              resizeMode="contain"
            />
          ))}
        </Swiper>

        <SafeAreaView className="flex-row justify-between items-center w-full absolute">
          <TouchableOpacity
            className="rounded ml-4 mt-4 "
            onPress={() => navigation.goBack()}
          >
            <View className="flex-row items-center rounded-full p-1">
              <ChevronLeftIcon size={wp(6)} color="black" />
              <Text className="text-black">Back</Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>

        <View
          // style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
          // className="px-5 flex flex-1 justify-between bg-white pt-8 -mt-14"
          className="px-5 flex flex-1 justify-between bg-white pt-5"
        >
          <View className="flex-row">
            {item.type === 1 ? (
              <View className="px-2 bg-blue-100 rounded">
                <Text className="text-xs text-blue-900">Onsite</Text>
              </View>
            ) : item.type === 2 ? (
              <View className="px-2 bg-green-100 rounded">
                <Text className="text-xs text-green-900">Home</Text>
              </View>
            ) : item.type === 3 ? (
              <View className="px-2 bg-yellow-100 rounded">
                <Text className="text-xs text-yellow-900">Home & Onsite</Text>
              </View>
            ) : null}
          </View>
          {/* <ScrollView showsVerticalScrollIndicator={false} className=""> */}
          <View className="flex-row justify-between items-center">
            <Text className="font-bold flex-1" style={{ fontSize: wp(6) }}>
              {item.name}
            </Text>

            {item.isAvailable === true ? (
              <View className="py-1 px-4 bg-green-100 rounded-full">
                <Text className="text-green-800 text-sm">Available</Text>
              </View>
            ) : (
              <View className="py-1 px-4 bg-zinc-100 rounded-full">
                <Text className="text-zinc-800 text-sm">Not Available</Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center mt-1 mb-4">
            <Text
              className="font-semibold text-red-500"
              style={{ fontSize: wp(5) }}
            >
              ₱
              {item.price?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            {/* <Rating
              type="star"
              startingValue={item.ratings}
              imageSize={24}
              readonly
            />

            <Text className="text-yellow-400 font-bold">{item.ratings}/5</Text>
            <Text className="text-yellow-400 font-bold">
              ({item.reviews.length} Review)
            </Text> */}
          </View>

          {/* <View className="flex-row justify-between items-start">
            <Text className="mb-5">
              {item.brand?.name || ""} ({item.type})
            </Text>
            <Text>{item.stock} remaining</Text>
          </View> */}

          <View className="mb-1">
            <Text className="font-semibold">Description</Text>
            <Text className="text-xs">{item.description}</Text>
          </View>

          {/* </ScrollView> */}

          <View></View>
        </View>

        {/* <View className="flex flex-1 bg-white p-5">
          <Text className="font-bold text-base">Product Ratings</Text>

          <View className="flex flex-row">
            <View>
              <Rating
                type="star"
                startingValue={item.ratings}
                imageSize={20}
                readonly
              />
            </View>
            <Text> {item.ratings}/5</Text>
          </View>

          {item.reviews.length === 0 ? (
            <View className="flex flex-row justify-center mt-3 bg-zinc-100 p-3 rounded-lg space-y-2">
              <Text>No reviews yet.</Text>
            </View>
          ) : (
            <View className="mt-3 bg-zinc-100 p-3 rounded-lg space-y-2">
              {item.reviews.map((review) => (
                <>
                  <View className="flex-row space-x-2 ">
                    <Image
                      source={
                        item.image
                          ? { uri: item.image }
                          : require("../../assets/images/teampoor-default.png")
                      }
                      style={{ width: 30, height: 30 }}
                      className="rounded"
                    />
                    <View className="space-y-1">
                      <Text className="font-semibold">{review.name}</Text>
                      <Rating
                        type="star"
                        startingValue={review.rating}
                        imageSize={20}
                        readonly
                        className="flex-row"
                      />

                      <View className="mr-8">
                        <Text>{review.comment}</Text>
                      </View>
                    </View>
                  </View>
                  <Divider className="my-2" />
                </>
              ))}
            </View>
          )}
        </View> */}
      </KeyboardAwareScrollView>

      {item.isAvailable === true ? (
        <View className="flex flex-row justify-between items-center space-x-5 p-2 px-5 bg-white shadow-lg">
          {/* <View>
            <Text className="text-xs">Total Price</Text>
            <Text className="text-red-500 font-bold text-2xl">
              {formattedPrice}
            </Text>

            <View></View>
          </View> */}
          <TouchableOpacity
            className="flex flex-row items-center justify-center rounded-lg p-3 bg-red-500 space-x-3 grow"
            // onPress={() => {
            //   dispatch(actions.addServiceToCart({ ...item, quantity: 1 })),
            //     Toast.show({
            //       topOffset: 60,
            //       type: "success",
            //       text1: `${item.name} added to Cart`,
            //       text2: "Go to your cart to complete order",
            //     });
            // }}
            onPress={() => navigation.navigate("Checkout Service")}
          >
            <Text className="font-bold text-white text-base ">
              Book an Appointment
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            className="bg-red-500 p-3 rounded-lg"
            onPress={() => navigation.navigate("Home Service Cart")}
          >
            <ShoppingCartIcon color="white" size={24} />
          </TouchableOpacity> */}
        </View>
      ) : // <TouchableOpacity
      //   className="bg-red-500 mb-3 mx-auto flex justify-center items-center rounded-full"
      //   // style={{ height: wp(15), width: wp("50%") }}

      //   onPress={() => {
      //     dispatch(actions.addToCart({ ...item, quantity: 1 })),
      //       Toast.show({
      //         topOffset: 60,
      //         type: "success",
      //         text1: `${item.name} added to Cart`,
      //         text2: "Go to your cart to complete order",
      //       });
      //   }}
      // >
      //   <Text className="font-bold text-white text-lg ">Add to Cart</Text>
      // </TouchableOpacity>
      // <View
      //   className="bg-zinc-500 mb-3 mx-auto flex justify-center items-center rounded-full"
      //   style={{ height: wp(15), width: wp(55) }}
      // >
      //   <Text className="font-bold text-white text-base">
      //     Currently Unavailable
      //   </Text>
      // </View>
      null}
    </>
  );
};

export default SingleService;
