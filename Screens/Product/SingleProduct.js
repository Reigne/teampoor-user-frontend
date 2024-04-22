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
    <View className="flex-1 bg-white">
      <KeyboardAwareScrollView className="flex-1">
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
              <Text className="text-black font-bold">Back</Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>

        <View className="flex-1 bg-white p-4">
          <Text className="text-red-500 font-extrabold text-2xl tracking-wider">
            {formattedPrice}
          </Text>

          <View className="flex flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-lg font-semibold">
                {item.name}
              </Text>
            </View>

            <View className="flex flex-row items-start space-x-1">
              <StarIcon color="#fbbf24" size={20} />
              <Text className="font-semibold">({item.ratings.toFixed(1)})</Text>
            </View>
          </View>

          <View>
            <Text className="text-xs text-zinc-600">
              {item.stock} Stock Available
            </Text>
          </View>

          <View className="mt-4">
            <Text className="text-zinc-600 tracking-wider">
              {item.description}
            </Text>
          </View>

          <View className="mt-4 flex-1 space-y-1">
            <Text className="text-zinc-600">Overall Rating</Text>
            <View className="flex flex-row items-center space-x-4">
              <Text className="text-4xl font-extrabold">
                {item.ratings.toFixed(1)}
              </Text>

              <View className="">
                <Rating
                  type="star"
                  startingValue={item.ratings}
                  imageSize={14}
                  readonly
                />

                <Text className="text-xs text-zinc-600">
                  ({item.reviews.length} Reviews)
                </Text>
              </View>
            </View>
          </View>

          <View className="border-b border-zinc-200 mt-3" />

          <View className="mt-4">
            {item.reviews.length > 0 ? (
              <View>
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
                        className="rounded-full"
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
                            {new Date(review?.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View>
                <Text className="text-xs text-zinc-600 text-center">
                  Currently no review.
                </Text>

                <View className="border-b border-zinc-200 mt-3" />
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>

      {item.stock > 0 ? (
        <View className="flex flex-row justify-between items-center space-x-2 p-3 px-5 bg-white shadow-lg rounded-t-3xl">
          <TouchableOpacity
            className="p-3 rounded-lg bg-red-200"
            onPress={() => navigation.navigate("Cart")}
          >
            <ShoppingCartIcon color="#ef4444" size={24} />
          </TouchableOpacity>
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
            <Text className="font-semibold text-white text-base">
              Add to cart
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          className="bg-gray-500 mb-3 mx-auto flex justify-center items-center rounded-full"
          style={{ height: wp(15), width: wp(55) }}
        >
          <Text className="font-bold text-white text-lg">
            Currently Unavailable
          </Text>
        </View>
      )}
    </View>
  );
};

export default SingleProduct;
