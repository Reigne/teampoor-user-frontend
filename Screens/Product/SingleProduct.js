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
  StarIcon,
} from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import * as actions from "../../Redux/Actions/cartActions";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
// import { Rating, AirbnbRating } from 'react-native-ratings';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Rating, AirbnbRating } from "react-native-ratings";

const SingleProduct = (props) => {
  const [item, setItem] = useState(props.route.params.item);
  const dispatch = useDispatch();

  const formattedPrice = `₱${Number(item.price).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const toast = useToast();
  const navigation = useNavigation();

  console.log(item, "item");

  return (
    <>
      <KeyboardAwareScrollView className="bg-white flex-1">
        {/* <Image
          style={{ width: wp(100), height: hp(55) }}
          source={
            item.image
              ? { uri: item.image }
              : require("../../assets/images/teampoor-default.png")
          }
          alt="product image"
        /> */}

        <Swiper
          style={{ height: hp(55) }}
          showsButtons={false}
          paginationStyle={{ bottom: 10 }}
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
          className="px-4 flex flex-1 justify-between bg-white pt-5"
          // className="flex-1 bg-white h-full"
        >
          {/* <ScrollView showsVerticalScrollIndicator={false} className=""> */}
          <View className="flex-row justify-between items-end mb-2">
            <View className="">
              <View className="flex flex-row items-end space-x-2 mt-1">
                <Rating
                  type="star"
                  startingValue={item.ratings}
                  imageSize={24}
                  readonly
                />

                <Text className="text-yellow-500">{item.ratings}/5</Text>
                <Text className="text-slate-900">
                  ({item.reviews.length} Review)
                </Text>
              </View>
            </View>

            {/* <Text
              className="font-semibold text-red-500"
              style={{ fontSize: wp(6) }}
            >
              {formattedPrice}
            </Text> */}
            <Text>{item.stock} remaining</Text>
          </View>

          <View className="">
            <Text className="font-bold flex-1 " style={{ fontSize: wp(6) }}>
              {item.name}
            </Text>
            <Text className="text-xs">by {item.brand.name}</Text>
          </View>

          {/* <View className="flex-row justify-between items-start">
            <Text className="mb-5">
              {item.brand?.name || ""} ({item.type})
            </Text>
            <Text>{item.stock} remaining</Text>
          </View> */}

          <View className="mb-1 bg-slate-100 p-3 rounded min-h-44 mt-3">
            <Text className="text-base font-semibold text-zinc-800">
              Description
            </Text>
            <Text className="text-sm">{item.description}</Text>
          </View>

          {/* </ScrollView> */}
        </View>

        <View className="px-4 mt-3 flex-row space-x-2 items-center">
          <Text className="text-base font-semibold">Reviews</Text>
        </View>

        <View className="px-3 flex-row">
          <StarIcon color="#fbbf24" size={20} />
          <Text>{item.ratings} / out of 5</Text>
        </View>
        <View className="px-4 mt-2 mb-2">
          <View className="bg-slate-100 p-3 rounded">
            {item.reviews.map((review) => (
              <View className="mb-3">
                <View className="flex-row space-x-2 border-b border-zinc-200">
                  <Image
                    source={
                      item.image
                        ? { uri: item.image }
                        : require("../../assets/images/teampoor-default.png")
                    }
                    style={{ width: 30, height: 30 }}
                    className="rounded"
                  />

                  <View className="flex flex-row justify-between grow items-start">
                    <View className="space-y-1 mb-2">
                      <Text className="font-semibold">{review.name}</Text>
                      <Rating
                        type="star"
                        startingValue={review.rating}
                        imageSize={14}
                        readonly
                        className="flex-row"
                      />

                      <View className="mr-8">
                        <Text>{review.comment}</Text>
                      </View>
                    </View>

                    <View>
                      <Text className="text-xs">
                        {new Date(review?.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        {/* <View className="flex flex-row justify-center space-x-5 items-center p-4">
          <View className="bg-slate-100 p-5 rounded-lg items-center">
            <View className="bg-slate-200 p-4 rounded-full mb-2">
              <StarIcon color="#fbbf24" size={24} />
            </View>

            <Text className="font-semibold text-base">Ratings</Text>

            <View className="items-center flex-row">
              <Text className="text-base">{item.ratings}</Text>
              <Text className="text-xs"> out of 5</Text>
            </View>
          </View>
          <View className="bg-slate-100 p-5 rounded-lg items-center">
            <View className="bg-slate-200 p-4 rounded-full mb-2">
              <StarIcon color="#fbbf24" size={24} />
            </View>

            <Text className="font-semibold text-base">Ratings</Text>

            <View className="items-center flex-row">
              <Text className="text-base">{item.ratings}</Text>
              <Text className="text-xs"> out of 5</Text>
            </View>
          </View>
          <View className="bg-slate-100 p-5 rounded-lg items-center">
            <View className="bg-slate-200 p-4 rounded-full mb-2">
              <StarIcon color="#fbbf24" size={24} />
            </View>

            <Text className="font-semibold text-base">Ratings</Text>

            <View className="items-center flex-row">
              <Text className="text-base">{item.ratings}</Text>
              <Text className="text-xs"> out of 5</Text>
            </View>
          </View>
        </View> */}
        {/* <View className="flex-1 p-4">
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

      {item.stock > 0 ? (
        <View className="flex flex-row justify-between items-center space-x-5 p-2 px-5 bg-white shadow-lg">
          <View>
            <Text className="text-xs">Total Price</Text>
            <Text className="text-red-500 font-bold text-2xl">
              {formattedPrice}
            </Text>

            <View></View>
          </View>
          <TouchableOpacity
            className="flex flex-row items-center justify-center rounded-lg p-3 bg-red-500 space-x-3 grow"
            onPress={() => {
              dispatch(actions.addToCart({ ...item, quantity: 1 })),
                Toast.show({
                  topOffset: 60,
                  type: "success",
                  text1: `${item.name} added to Cart`,
                  text2: "Go to your cart to complete order",
                });
            }}
          >
            <Text className="font-bold text-white text-lg ">Add to Cart</Text>
            <ShoppingCartIcon color="white" size={24} />
          </TouchableOpacity>
        </View>
      ) : (
        // <TouchableOpacity
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
        <View
          className="bg-gray-500 mb-3 mx-auto flex justify-center items-center rounded-full"
          style={{ height: wp(15), width: wp(55) }}
        >
          <Text className="font-bold text-white text-lg">
            Currently Unavailable
          </Text>
        </View>
      )}
    </>
  );
};

export default SingleProduct;
