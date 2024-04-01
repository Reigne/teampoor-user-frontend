import React, { useContext, useState, useCallback } from "react";
import {
  Text,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { logoutUser } from "../../Context/Actions/Auth.actions";
import Icon from "react-native-vector-icons/FontAwesome";
import { View, FlatList } from "native-base";
import UserOrderList from "./UserOrderList";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  ArchiveBoxIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  LockClosedIcon,
  ShoppingCartIcon,
  UserIcon,
} from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";

const UserOrder = () => {
  return (
    <KeyboardAwareScrollView className="flex-1 bg-white">
      <SafeAreaView className="flex justify-center items-center mt-2">
        <Text className="font-extrabold text-lg">My Orders</Text>
      </SafeAreaView>
      <View className="flex">
        <View>
      
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default UserOrder;
