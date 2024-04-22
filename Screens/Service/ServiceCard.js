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
import { Badge } from "native-base";

const SingleCard = (props) => {
  const { name, description, price, images, type } = props;
  const dispatch = useDispatch();

  const formattedPrice = `₱${Number(price).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  console.log(type, "image");

  return (
    <View className="bg-white p-2 rounded-xl flex flex-row space-x-3">
      <Image
        className="rounded-xl"
        style={{
          width: 100,
          height: 100,
        }}
        source={
          images[0]?.url
            ? { uri: images[0]?.url }
            : require("../../assets/images/teampoor-default.png")
        }
        resizeMode="cover"
      />

      <View className="flex-1">
        <View className="flex flex-row ">
          {type === 1 ? (
            <View>
              {/* <Text className="text-xs text-blue-900">Onsite</Text> */}
              <Badge
                colorScheme="info"
                rounded="md"
                _text={{
                  fontSize: 10,
                }}
              >
                Onsite
              </Badge>
            </View>
          ) : type === 2 ? (
            <View>
              {/* <Text className="text-xs text-green-900">Home</Text> */}
              <Badge
                colorScheme="success"
                rounded="md"
                _text={{
                  fontSize: 10,
                }}
              >
                Home
              </Badge>
            </View>
          ) : type === 3 ? (
            <View>
              {/* <Text className="text-xs text-yellow-900">Home & Onsite</Text> */}
              <Badge
                colorScheme="warning"
                _text={{
                  fontSize: 10,
                }}
                rounded="md"
              >
                Home & Onsite
              </Badge>
            </View>
          ) : null}
        </View>

        <Text className="text-base font-semibold">{name}</Text>

        <Text
          className="text-xs text-zinc-600 mt-1"
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {description}
        </Text>
      </View>
    </View>
  );
};

export default SingleCard;
