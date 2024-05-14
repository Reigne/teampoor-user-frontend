import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as actions from "../../Redux/Actions/cartActions";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import Swiper from "react-native-swiper";
import { Rating, AirbnbRating } from "react-native-ratings";

const ProductCard = (props) => {
  const { name, description, price, images, stock, ratings } = props;
  const dispatch = useDispatch();

  const formattedPrice = `₱${Number(price).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <View
      style={{
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.1,
        // elevation: 2,
        borderRadius: 10,
        padding: 0,
        marginBottom: 2,
        // borderTopLeftRadius: 10,
        // borderTopRightRadius: 10,
      }}
      className="rounded-xl bg-white overflow-hidden"
    >
      <View>
        <View className="">
          <Image
            style={{
              width: "100%",
              height: 185,
              marginBottom: 8,
              opacity: stock <= 0 ? 0.4 : 1,
            }}
            contentFit="cover"
            transition={1000}
            source={
              images[0]?.url
                ? { uri: images[0].url }
                : require("../../assets/images/teampoor-default.png")
            }
          />
        </View>

        {/* <Swiper
          style={{ height: 186 }}
          showsButtons={false}
          paginationStyle={{ bottom: 10 }}
          autoplay={true}
          autoplayTimeout={10}
        >
          {images.map((image, index) => (
            <Image
              key={index}
              style={{
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                width: "100%",
                height: 186,
                marginBottom: 8,
                resizeMode: "cover",
              }}
              source={
                image.url
                  ? { uri: image.url }
                  : require("../../assets/images/teampoor-default.png")
              }
              resizeMode="cover"
            />
          ))}
        </Swiper> */}
      </View>
      <View className="p-2">
        <View className="flex-row justify-start items-center gap-2 py-1">
          <Rating type="star" startingValue={ratings} imageSize={15} readonly />

          <Text className="text-xs text-zinc-600">{ratings}/5</Text>
        </View>

        <Text style={{ fontSize: 16 }} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>

        <View className="my-2">
          <Text style={{ fontSize: 10 }} numberOfLines={2} ellipsizeMode="tail">
            {description}
          </Text>
        </View>

        <View className="flex flex-row justify-between items-center ">
          <Text className="text-base font-bold text-red-500">
            {formattedPrice}
          </Text>
          <Text style={{ fontSize: 10 }}>{stock} stock</Text>
        </View>
      </View>
      {/* <View className="mb-2">
        <TouchableOpacity>
          <View
            className="bg-red-500 mx-auto flex justify-center items-center rounded-full"
            style={{ height: wp(8), width: wp(25) }}
          >
            <Text
              className="text-white "
              onPress={() => {
                dispatch(actions.addToCart({ ...props, quantity: 1 })),
                  Toast.show({
                    topOffset: 60,
                    type: "success",
                    text1: `${name} added to Cart`,
                    text2: "Go to your cart to complete order",
                  });
              }}
            >
              Add to cart
            </Text>
          </View>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default ProductCard;
