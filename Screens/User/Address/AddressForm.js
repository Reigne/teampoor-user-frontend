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

import { Select, ZStack, VStack, Box, Switch, Stack, Radio } from "native-base";
import {
  regions,
  provinces,
  cities,
  barangays,
  regionByCode,
  provincesByCode,
  provinceByName,
} from "select-philippines-address";

const AddressForm = (props) => {
  console.log(props.route.params, "wow");
  let navigation = useNavigation();
  const context = useContext(AuthGlobal);

  const [userId, getUserId] = useState(context.stateUser.user.userId);
  const [addressDetails, setAddressDetails] = useState(props.route.params);
  const [item, setItem] = useState(null);

  const [regionData, setRegionData] = useState([]);
  const [provinceData, setProvinceData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [barangayData, setBarangayData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [address, setAddress] = useState("");
  const [postalcode, setPostalcode] = useState("");

  const [token, setToken] = useState();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!props.route.params) {
      setItem(null);

      regions().then((regionResponse) => setRegionData(regionResponse));

      console.log(
        regions().then((regionResponse) => setRegionData(regionResponse))
      );
    } else {
      setItem(props.route.params);
      setPostalcode(addressDetails.postalcode || "");
      setAddress(addressDetails.address || "");

      setSelectedRegion(addressDetails.region || "");

      provinces(addressDetails.region || "").then((provinceResponse) =>
        setProvinceData(provinceResponse)
      );
      setSelectedProvince(addressDetails.province || "");

      cities(addressDetails.province || "").then((cityResponse) =>
        setCityData(cityResponse)
      );
      setSelectedCity(addressDetails.city || "");

      barangays(addressDetails.city || "").then((barangayResponse) =>
        setBarangayData(barangayResponse || [])
      );
      setSelectedBarangay(addressDetails.barangay || "");

      // Fetch the list of regions when the component mounts
      regions().then((regionResponse) => setRegionData(regionResponse));
    }

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
  }, []);

  const validateForm = () => {
    let errors = {};

    if (!address) errors.address = "Address is required";
    if (!postalcode) errors.postalcode = "Postal code is required";
    if (!selectedRegion) errors.selectedRegion = "Region is required";
    if (!selectedProvince) errors.selectedProvince = "Province is required";
    if (!selectedCity) errors.selectedCity = "City is required";
    if (!selectedBarangay) errors.selectedBarangay = "City is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
    console.log(selectedRegion, "region");
    provinces(value).then((provinceResponse) =>
      setProvinceData(provinceResponse)
    );
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    cities(value).then((cityResponse) => setCityData(cityResponse));
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    barangays(value).then((barangayResponse) =>
      setBarangayData(barangayResponse || [])
    );
  };

  const handleBarangayChange = (value) => {
    setSelectedBarangay(value);
  };
  const handleSubmit = () => {
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);

      return;
    }

    // const regionName = regionData.find(
    //   (region) => region.region_code === selectedRegion
    // );

    // const provinceName = provinceData.find(
    //   (province) => province.province_code === selectedProvince
    // );

    // const cityName = cityData.find((city) => city.city_code === selectedCity);
    // const barangayName = barangayData.find(
    //   (barangay) => barangay.brgy_code === selectedBarangay
    // );

    let formData = new FormData();

    formData.append("userId", userId);
    formData.append("region", selectedRegion);
    formData.append("province", selectedProvince);
    formData.append("city", selectedCity);
    formData.append("barangay", selectedBarangay);
    formData.append("postalcode", postalcode);
    formData.append("address", address);

    console.log(formData, "Form Data");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    // console.log(addressDetails._id, "asdasdasdads")

    if (item !== null) {
      axios
        .put(
          `${baseURL}addresses/update/${addressDetails._id}`,
          formData,
          config
        )
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Address updated",
              text2: "Successfuly",
            });

            setTimeout(() => {
              navigation.navigate("Address");
            }, 500);

            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);

          setIsLoading(false);

          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Update Address Form",
          });
        });
    } else {
      axios
        .post(`${baseURL}addresses/create`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "New Address Added",
              text2: "Successfuly",
            });

            setTimeout(() => {
              navigation.navigate("Address");
            }, 500);

            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);

          setIsLoading(false);

          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Create Address Form",
          });
        });
    }
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-white">
      <View className="px-4">
        <View className="space-y-4">
          <View>
            <Text className="text-xl font-bold">
              {item ? "Edit address" : "New address"}
            </Text>
            <Text className="text-zinc-500">
              Fill up the information below.
            </Text>
          </View>

          <View className="space-y-2">
            <Text className="">Region *</Text>
            <View
              className={
                errors.selectedRegion
                  ? "border border-red-500 bg-gray-100 text-gray-700 rounded"
                  : "bg-gray-100 text-gray-700 rounded"
              }
            >
              <Select
                placeholder="Select a region"
                onValueChange={handleRegionChange}
                selectedValue={selectedRegion}
              >
                {regionData.map((region) => (
                  <Select.Item
                    key={region.region_code}
                    label={region.region_name}
                    value={region.region_code}
                  />
                ))}
              </Select>
            </View>

            <View>
              {errors.selectedRegion ? (
                <Text className="text-sm text-red-500">
                  {errors.selectedRegion}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="space-y-2">
            <Text className="">Province *</Text>
            <View
              className={
                errors.selectedProvince
                  ? "border border-red-500 bg-gray-100 text-gray-700 rounded"
                  : "bg-gray-100 text-gray-700 rounded"
              }
            >
              <Select
                placeholder="Select a province"
                onValueChange={handleProvinceChange}
                selectedValue={selectedProvince}
              >
                {provinceData.map((province) => (
                  <Select.Item
                    key={province.province_code}
                    label={province.province_name}
                    value={province.province_code}
                  />
                ))}
              </Select>
            </View>

            <View>
              {errors.selectedProvince ? (
                <Text className="text-sm text-red-500">
                  {errors.selectedProvince}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="space-y-2">
            <Text className="">City *</Text>
            <View
              className={
                errors.selectedCity
                  ? "border border-red-500 bg-gray-100 text-gray-700 rounded"
                  : "bg-gray-100 text-gray-700 rounded"
              }
            >
              <Select
                placeholder="Select a city"
                onValueChange={handleCityChange}
                selectedValue={selectedCity}
              >
                {cityData.map((city) => (
                  <Select.Item
                    key={city.city_code}
                    label={city.city_name}
                    value={city.city_code}
                  />
                ))}
              </Select>
            </View>

            <View>
              {errors.selectedCity ? (
                <Text className="text-sm text-red-500">
                  {errors.selectedCity}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="space-y-2">
            <Text className="">Barangay *</Text>

            <View
              className={
                errors.selectedBarangay
                  ? "border border-red-500 bg-gray-100 text-gray-700 rounded"
                  : "bg-gray-100 text-gray-700 rounded"
              }
            >
              <Select
                placeholder="Select a barangay"
                onValueChange={handleBarangayChange}
                selectedValue={selectedBarangay}
              >
                {barangayData.map((barangay) => (
                  <Select.Item
                    key={barangay.brgy_code}
                    label={barangay.brgy_name}
                    value={barangay.brgy_code}
                  />
                ))}
              </Select>
            </View>

            <View>
              {errors.selectedBarangay ? (
                <Text className="text-sm text-red-500">
                  {errors.selectedBarangay}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="space-y-2">
            <Text>Postal Code *</Text>
            <View>
              <TextInput
                placeholder="Enter postal code"
                className={
                  errors.postalcode
                    ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 flex-row items-center"
                    : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 flex-row items-center"
                }
                value={postalcode}
                onChangeText={(text) => setPostalcode(text)}
              />

              <View>
                {errors.postalcode ? (
                  <Text className="text-sm text-red-500">
                    {errors.postalcode}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          <View className="space-y-2">
            <Text>Address *</Text>
            <View>
              <TextInput
                placeholder="Enter address"
                className={
                  errors.address
                    ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 flex-row items-center"
                    : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 flex-row items-center"
                }
                value={address}
                onChangeText={(text) => setAddress(text)}
              />

              <View>
                {errors.address ? (
                  <Text className="text-sm text-red-500">{errors.address}</Text>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="my-3 justify-center items-center px-4">
        <TouchableOpacity
          className={
            isLoading
              ? "py-4 w-full bg-zinc-500 rounded-xl items-center"
              : "py-4 w-full bg-red-500 rounded-xl items-center"
          }
          onPress={() => handleSubmit()}
          disabled={isLoading ? true : false}
        >
          <View className="flex flex-row space-x-2 items-center justify-center">
            <Text className="font-xl font-bold text-center text-white">
              {isLoading ? "Loading..." : "Create Address"}
            </Text>

            {isLoading && <ActivityIndicator size="small" color="white" />}
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AddressForm;
