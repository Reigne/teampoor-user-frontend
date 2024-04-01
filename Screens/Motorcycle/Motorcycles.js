import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Text,
  Box,
  HStack,
  Avatar,
  VStack,
  Spacer,
  Image,
  Button,
  AddIcon,
  Badge,
  Pressable,
} from "native-base";

import {
  clearServiceCart,
  removeServiceFromCart,
  updateCartItemQuantity,
} from "../../Redux/Actions/serviceCartActions";

import {
  ArrowUpTrayIcon,
  ChevronLeftIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import Login from "../User/Login";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import cartItems from "../../Redux/Reducers/cartItems";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

const Motorcycles = (props) => {
  const context = useContext(AuthGlobal);

  const [motorcycles, setMotorcycles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const userid = context.stateUser.user.userId;

  useFocusEffect(
    useCallback(() => {
      axios
        .get(`${baseURL}motorcycles/my-motorcycles/${userid}`, userid)
        .then((res) => {
          setMotorcycles(res.data);
          setLoading(false);
        })
        .catch((error) => console.log(error));

      return () => {
        setMotorcycles([]);
      };
    }, [])
  );

  console.log(motorcycles, "motorcycles");

  const renderMotorcycles = ({ item }) => {
    return (
      <View className="py-2">
        <View className="bg-zinc-100 rounded-xl p-3">
          <View className="flex-row space-x-3">
            <Image
              source={
                item.imageMotorcycle[0]?.url
                  ? { uri: item.imageMotorcycle[0]?.url }
                  : require("../../assets/images/teampoor-default.png")
              }
              style={{ width: 120, height: 150 }}
              className="rounded-xl"
              alt="motorcycle image"
              resizeMode="cover"
            />

            <View className="flex grow">
              {/* <View className="flex-row justify-between">
                <Text className="font-bold text-lg">{item.model}</Text>
                <View>
                  <Badge colorScheme="info">
                    <Text className="text-xs">Not Verified</Text>
                  </Badge>
                </View>
              </View> */}

              <View className="flex-row">
                <Text className="font-bold">Year: </Text>
                <Text>{item.year}</Text>
              </View>

              <View className="flex-row">
                <Text className="font-bold">Brand: </Text>
                <Text>{item.brand}</Text>
              </View>

              <View className="flex-row">
                <Text className="font-bold">Model: </Text>
                <Text>{item.model}</Text>
              </View>

              <View className="flex-row">
                <Text className="font-bold">Plate #: </Text>
                <Text>{item.plateNumber}</Text>
              </View>
             
              <View className="flex-row">
                <Text className="font-bold">Engine #: </Text>
                <Text>{item.engineNumber}</Text>
              </View>

              <View className="flex-row">
                <Text className="font-bold">Type: </Text>
                <Text>{item.type}</Text>
              </View>

              <View className="flex-row">
                <Text className="font-bold">Fuel: </Text>
                <Text>{item.fuel}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white px-4">
      {loading ? (
        <View className="flex-1 bg-white items-center justify-center space-y-2">
          <ActivityIndicator animating={true} color="red" size={34} />
          <Text>Loading</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 mb-5">
          <View className="flex flex-row justify-between items-center">
            <Text className="font-bold text-xl">My Motorcycle</Text>

            <TouchableOpacity
              className="py-2 px-4 bg-red-500 rounded-xl"
              onPress={() => navigation.navigate("MotorcycleForm")}
            >
              <Text className="text-white">+ Motorcycle</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-3">
            <FlatList
              data={motorcycles.slice().reverse()}
              renderItem={renderMotorcycles}
              keyExtractor={(item) => item.id}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Motorcycles;
