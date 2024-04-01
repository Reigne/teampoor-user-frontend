import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Image } from "native-base";
import { CheckCircleIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

const SuccessOrder = (props) => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View>
        {/* <Image
            size={250}
            source={require("../../../assets/images/success.png")}
          /> */}

        <CheckCircleIcon size={250} color="#ef4444" />
        <Text className="text-center font-extrabold text-2xl text-red-500">
          Successfully Ordered
        </Text>
      </View>

      <Text className="w-80 text-center mt-5">
        Thank you for your order. You will receive email confirmation shortly.
      </Text>

      {/* <Text className="w-52 text-center mt-3">
          Check the status of your order on the Order tracking page
        </Text> */}

      <TouchableOpacity
        onPress={() =>
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "Cart",
                  state: {
                    routes: [{ name: "Carts" }],
                  },
                },
              ],
            })
          )
        }
      >
        <View className="bg-red-500 rounded-full px-12 py-4 mt-10 ">
          <Text className="font-semibold text-white">Continute Shopping</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessOrder;
