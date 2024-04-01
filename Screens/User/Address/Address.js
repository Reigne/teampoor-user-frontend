import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import baseURL from "../../../assets/common/baseUrl";
import AuthGlobal from "../../../Context/Store/AuthGlobal";
import mime from "mime";

import { ChevronLeftIcon, PencilIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import {
  regions,
  provinces,
  cities,
  barangays,
  regionByCode,
  provincesByCode,
  provinceByName,
} from "select-philippines-address";
import {
  Modal,
  Button,
  Select,
  CheckIcon,
  Badge,
  ScrollView,
  FlatList,
} from "native-base";
import AddressList from "./AddressList";
const Address = () => {
  // console.log(props.route.params, "wow");
  let navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const [loading, setLoading] = useState(true);
  const [userId, getUserId] = useState(context.stateUser.user.userId);
  const [addressList, setAddressList] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [provinceData, setProvinceData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [barangayData, setBarangayData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [token, setToken] = useState();

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Start loading
      getAddresses();

      regions().then((regionResponse) => setRegionData(regionResponse));

      setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => {
        setAddressList();
      };
    }, [userId, setRegionData, setAddressList])
  );

  const getAddresses = async () => {
    axios
      .get(`${baseURL}addresses/${userId}`)
      .then((res) => {
        setAddressList(res.data);
      })
      .catch((error) => console.log(error));
  };

  const deleteHandler = (id) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .delete(`${baseURL}addresses/delete/${id}`, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Address deleted",
            text2: "Successfuly",
          });

          getAddresses();
        }
      })
      .catch((error) => {
        console.log(error);
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Delete address",
        });
      });
  };

  const defaultHandler = (id) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const formData = new FormData();
    formData.append("userId", userId); // Add userId to the formData

    axios
      .put(`${baseURL}addresses/default/${id}`, formData, config) // Send formData
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Set default address",
            text2: "Successfully",
          });

          getAddresses();
        }
      })
      .catch((error) => {
        console.log(error);
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Set default address",
        });
      });
  };

  return (
    <>
      {loading ? (
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <View className="flex-1 bg-white p-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-lg font-bold">My Addresses</Text>

            <TouchableOpacity
              className="bg-red-500 px-3 py-2 rounded-lg"
              onPress={() => navigation.navigate("AddressForm")}
            >
              <Text className="text-white">+ Add address</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-zinc-700">Press hold to delete</Text>

          <View className="flex-1">
            <FlatList
              contentContainerStyle={{ flexGrow: 1 }}
              data={addressList}
              keyExtractor={(item) => item.id?.toString()}
              // renderItem={renderAddress}
              renderItem={({ item, index }) => (
                <AddressList
                  item={item}
                  index={index}
                  deleteHandler={deleteHandler}
                  defaultHandler={defaultHandler}
                  regionData={regionData}
                />
              )}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center">
                  <View>
                    <Image
                      style={{ width: 120, height: 120 }} // Adjust the width and height as needed
                      source={require("../../../assets/images/no-found.png")}
                      alt="empty-cart"
                    />
                  </View>
                  <Text className="text-xl font-bold text-red-500">NO ADDRESS FOUND</Text>
                  <Text className="text-xs">
                    Looks like you haven't added any addresses yet.
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      )}
    </>
  );
};

export default Address;
