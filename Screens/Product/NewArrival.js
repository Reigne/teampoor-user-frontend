import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  FlatList,
  Text,
} from "react-native";
import Swiper from "react-native-swiper";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const NewArrival = () => {
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <View className="p-2">
      <View className="bg-red-500 rounded-lg" style={{ height: hp("25%") }}>
        <View className="flex justify-center items-center">
          <Text className="font-bold text-3xl text-white mt-4 tracking-widest">New Arrival</Text>
        </View>
      </View>
      {/* <FlatList
        data={bannerData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ width: 200, height: 200, overflow: 'hidden' }}>
            <Image
              source={{ uri: item }}
              style={{ width: 200, height: 200, margin: 5 }}
              resizeMode="cover"
            />
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      /> */}
    </View>
  );
};

export default NewArrival;
