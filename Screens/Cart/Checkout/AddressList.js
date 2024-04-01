import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import baseURL from "../../../assets/common/baseUrl";
import AuthGlobal from "../../../Context/Store/AuthGlobal";
import mime from "mime";

import {
  CheckCircleIcon,
  ChevronLeftIcon,
  PencilIcon,
} from "react-native-heroicons/solid";
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

const AddressList = ({
  item,
  index,
  selectedAddress,
  regionData,
  selectedAddressId,
}) => {
  // console.log(props.route.params, "wow");
  let navigation = useNavigation();
  //   const context = useContext(AuthGlobal);

  //   const [userId, getUserId] = useState(context.stateUser.user.userId);
  const [addressList, setAddressList] = useState(item);
  // const [regionData, setRegionData] = useState([]);
  const [provinceData, setProvinceData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [barangayData, setBarangayData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  //   const [selectedAddressId, setSelectedAddressId] = useState(null);

  //   const [token, setToken] = useState();

  useFocusEffect(
    useCallback(() => {
      provinces(item.region).then((provinceResponse) =>
        setProvinceData(provinceResponse)
      );

      cities(item.province).then((cityResponse) => setCityData(cityResponse));

      barangays(item.city).then((barangayResponse) =>
        setBarangayData(barangayResponse || [])
      );

      

      return () => {
        setProvinceData();
        setCityData();
        setBarangayData();
      };
    }, [setProvinceData, setBarangayData, setCityData])
  );

  // regions().then((regionResponse) => setRegionData(regionResponse));

  const regionName = regionData
    ? regionData.find((region) => region.region_code === item.region)
    : null;

  const provinceName = provinceData
    ? provinceData.find((province) => province.province_code === item.province)
    : null;

  const cityName = cityData
    ? cityData.find((city) => city.city_code === item.city)
    : null;

  const barangayName = barangayData
    ? barangayData.find((barangay) => barangay.brgy_code === item.barangay)
    : null;

  //   console.log(regionName, "regionName");
  //   console.log(provinceName, "provinceName");
  //   console.log(cityName, "cityName");
  //   console.log(barangayName, "barangayName");

  const data = {
    _id: item._id,
    region: regionName?.region_name,
    province: provinceName?.province_name,
    city: cityName?.city_name,
    barangay: barangayName?.brgy_name,
    postalcode: item.postalcode,
    address: item.address,
  }

  return (
    <>
      <TouchableOpacity
        className="my-2"
        onPress={() => {
          selectedAddress(item);
        }}
      >
        <View className="flex flex-row items-center space-x-2 ">
          <View
            // className={
            //   item._id === selectedAddressId
            //     ? "flex border border-red-500 bg-zinc-100 p-5 rounded space-y-1"
            //     : "flex bg-zinc-100 p-5 rounded space-y-1"
            // }

            className="flex bg-zinc-100 p-5 rounded space-y-1 w-11/12"
          >
            {/* <View className="flex-row justify-between">
              <Text className="text-base font-bold">Address</Text>
            </View> */}

            <View className="flex-row space-x-1">
              <Text>
                {item.address}, {barangayName?.brgy_name}, {cityName?.city_name}
                , {provinceName?.province_name}, {regionName?.region_name},{" "}
                {item.postalcode}
              </Text>
            </View>
            {/* <View className="flex flex-row justify-end">
            <TouchableOpacity
              disabled={item._id === selectedAddressId ? true : false}
              className={
                item._id === selectedAddressId
                  ? "p-2 border border-red-500 bg-red-500 items-center rounded-lg"
                  : "p-2 border border-zinc-500 items-center rounded-lg"
              }
              onPress={() => selectedAddress(item)}
            >
              <Text
                className={item._id === selectedAddressId ? "text-white" : ""}
              >
                Set Default
              </Text>
            </TouchableOpacity>
          </View> */}
          </View>

          <View >
            {item._id === selectedAddressId ? (
                <CheckCircleIcon color="#ef4444" size={24} />
            //   <View className="rounded-full bg-green-500 w-4 h-4 items-center"></View>
            ) : <View className="rounded-full bg-zinc-300 w-4 h-4 items-center"></View>}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default AddressList;
