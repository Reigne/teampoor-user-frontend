import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// import * as actions from "../../Redux/Actions/serviceCartActions";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import Swiper from "react-native-swiper";
import { Rating, AirbnbRating } from "react-native-ratings";

const SingleCard = (props) => {
  const { name, description, price, images, type } = props;
  const dispatch = useDispatch();

  const formattedPrice = `₱${Number(price).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  console.log(type, "image");

  return (
    <View className="bg-white p-2 rounded-lg flex flex-row space-x-3">
      <Image
        className="rounded-lg"
        style={{
          width: 150,
          height: 110,
        }}
        source={
          images[0]?.url
            ? { uri: images[0]?.url }
            : require("../../assets/images/teampoor-default.png")
        }
        resizeMode="cover"
      />

      <View className="">
        <View className="flex-row">
          {type === 1 ? (
            <View className="px-2 bg-blue-100 rounded">
              <Text className="text-xs text-blue-900">Onsite</Text>
            </View>
          ) : type === 2 ? (
            <View className="px-2 bg-green-100 rounded">
              <Text className="text-xs text-green-900">Home</Text>
            </View>
          ) : type === 3 ? (
            <View className="px-2 bg-yellow-100 rounded">
              <Text className="text-xs text-yellow-900">Home & Onsite</Text>
            </View>
          ) : null}
        </View>

        <Text className="font-semibold text-lg">{name}</Text>

        <Text className="font-semibold text-red-500">
          ₱
          {price?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>

        <Text numberOfLines={2} ellipsizeMode="tail" className="font-normal text-zinc-600 w-40 text-xs">
          {description}
        </Text>
      </View>
    </View>
  );
};

export default SingleCard;
