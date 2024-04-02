import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Login from "./Login";

const Welcome = (props) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <View className="flex-row justify-center mb-10">
          <Image
            source={require("../../assets/images/teampoor-icon.png")}
            style={{ width: 250, height: 250 }}
            className="rounded-full"
          />
        </View>
        <Text className="text-2xl font-extrabold">Welcome To</Text>
        <Text className="text-5xl mt-1 font-extrabold text-red-500">TEAMPOOR</Text>
        <Text className="text-center mt-2 px-4">
          Explore a world of high-performance motorcycles and top-notch gear.
          Your adventure begins here.
        </Text>

        <View className="space-y-4 mt-10">
          <TouchableOpacity
            className="py-3 bg-red-500 mx-7 rounded-xl p-4 pr-8 pl-8"
            onPress={() => navigation.navigate(Login)}
          >
            <Text className="text-xl font-bold text-center text-white">
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
