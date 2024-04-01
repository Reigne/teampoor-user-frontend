import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
} from "react-native";
import { Badge, Text, VStack, Divider, HStac } from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Square2StackIcon, Squares2X2Icon } from "react-native-heroicons/solid";

const CategoryFilter = (props) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-3"
        contentContainerStyle={{ paddingHorizontal: 5 }}
      >
        <TouchableOpacity
          key={1}
          onPress={() => {
            props.categoryFilter("all"), props.setActive(-1);
          }}
          className="flex flex-row items-center bg-white p-3 space-x-2 rounded-lg"
        >
          <Squares2X2Icon size={24} color="#ef4444" />
          <Text
            className={props.active === -1 ? "text-red-500" : "text-zinc-900"}
          >
            All
          </Text>
        </TouchableOpacity>
        {props.categories.map((item) => (
          <TouchableOpacity
            key={item._id}
            className={
              props.active == props.categories.indexOf(item)
                ? "flex flex-row items-center bg-white p-3 space-x-2 rounded-lg border border-red-500"
                : "flex flex-row items-center bg-white p-3 space-x-2 rounded-lg"
            }
            onPress={() => {
              props.categoryFilter(item._id),
                props.setActive(props.categories.indexOf(item));
            }}
          >
            {/* <View
              className={
                props.active == props.categories.indexOf(item)
                  ? "rounded-full p-[2px] bg-red-500"
                  : ""
              }
            > */}
            <Image
              source={
                item.image.url
                  ? { uri: item.image.url }
                  : require("../../assets/images/teampoor-default.png")
              }
              style={{ width: hp(4), height: hp(4) }}
              className="rounded-lg"
            />
            {/* </View> */}

            <Text
              className={
                props.active == props.categories.indexOf(item)
                  ? "text-red-500"
                  : "text-zinc-900"
              }
              style={{ fontSize: hp(1.6) }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryFilter;
