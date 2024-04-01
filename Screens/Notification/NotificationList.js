import React, { useEffect, useState, memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Pressable,
  Image,
  Badge,
  Select,
  VStack,
  CheckIcon,
} from "native-base";
import {
  BanknotesIcon,
  DocumentTextIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TruckIcon,
} from "react-native-heroicons/solid";
import moment from "moment";
import "moment/locale/en-gb";

const NotificationList = ({ item }) => {
  const formatTime = (date) => {
    return moment(date).fromNow();
  };

  return (
    <TouchableOpacity className="">
      <View className="flex flex-row space-x-2 items-center">
        <Image
          className="rounded-full w-1/5"
          style={{
            width: 44,
            height: 44,
          }}
          source={{
            uri: item.user?.avatar?.url
              ? item.user?.avatar?.url
              : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
          }}
          alt="images"
        />

        <View className="w-4/5">
          {/* <Text>
            <Text className="font-semibold">{item.fullname} </Text>
            has placed an order.
          </Text> */}
          <Text>{item.message}</Text>
          <Text className="text-zinc-500 text-xs">{formatTime(item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationList;
