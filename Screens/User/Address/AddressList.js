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

const AddressList = ({ item, index, deleteHandler, defaultHandler, regionData }) => {
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
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  //   const [token, setToken] = useState();

  useFocusEffect(
    useCallback(() => {

      provinces(item.region).then((provinceResponse) => setProvinceData(provinceResponse));

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

  const regionName = regionData.find(
    (region) => region.region_code === item.region
  );
  
  const provinceName = provinceData.find(
    (province) => province.province_code === item.province
  );

  const cityName = cityData.find((city) => city.city_code === item.city);
  
  const barangayName = barangayData.find(
    (barangay) => barangay.brgy_code === item.barangay
  );

  console.log(regionName, 'regionName')
  console.log(provinceName, 'provinceName')
  console.log(cityName, 'cityName')
  console.log(barangayName, 'barangayName')


  return (
    <>
      <Modal
        isOpen={showModal && selectedAddressId === item._id}
        onClose={() => setShowModal(false)}
      >
        <Modal.Content maxWidth="300px">
          <Modal.CloseButton />
          <Modal.Body>
            <View className="flex flex-row justify-center">
              <Button.Group space={2}>
                <Button
                  colorScheme="red"
                  onPress={() => {
                    [setShowModal(false), deleteHandler(item._id)];
                  }}
                >
                  <Text className="font-bold text-white">Delete</Text>
                </Button>
              </Button.Group>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <TouchableOpacity
        className="my-2"
        onLongPress={() => {
          setSelectedAddressId(item._id); // Set the selected address ID
          setShowModal(true); // Show modal separately
        }}
      >
        <View className="flex bg-zinc-100 p-5 rounded space-y-1">
          <View className="flex-row justify-between ">
            <Text className="text-base font-bold">Address</Text>

            <TouchableOpacity
              className=""
              onPress={() => navigation.navigate("AddressForm", item)}
            >
              <PencilIcon color="#44403c" size={14} />
            </TouchableOpacity>
          </View>
          <View className="flex">
            <Text>{item.address}</Text>
          </View>

          <View className="flex-row space-x-1">
            <Text>{barangayName?.brgy_name},</Text>
            <Text>{cityName?.city_name},</Text>
          </View>

          <View className="flex-row space-x-1">
            <Text>{provinceName?.province_name},</Text>
            <Text>{regionName?.region_name},</Text>
          </View>
          <Text>{item.postalcode},</Text>
          <View className="flex flex-row justify-end">
            <TouchableOpacity
              disabled={item.isDefault === true ? true : false}
              className={
                item.isDefault === true
                  ? "p-2 border border-red-500 bg-red-500 items-center rounded-lg"
                  : "p-2 border border-zinc-500 items-center rounded-lg"
              }
              onPress={() => defaultHandler(item._id)}
            >
              <Text className={item.isDefault === true ? "text-white" : ""}>
                Set Default
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default AddressList;
