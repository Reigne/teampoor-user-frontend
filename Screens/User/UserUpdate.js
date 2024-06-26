import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { ChevronLeftIcon, PencilIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  regions,
  provinces,
  cities,
  barangays,
} from "select-philippines-address";

import { Stack, Radio } from "native-base";

const UserUpdate = (props) => {
  let navigation = useNavigation();
  const [user, setUser] = useState(props.route.params.user);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postalcode, setPostalcode] = useState("");

  const [regionData, setRegionData] = useState([]);
  const [provinceData, setProvinceData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [barangayData, setBarangayData] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");

  const [image, setImage] = useState("");
  const [mainImage, setMainImage] = useState();
  const [token, setToken] = useState();

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFirstname(user.firstname || "");
    setLastname(user.lastname || "");
    setMainImage(user.avatar?.url || "");
    setImage(user.avatar?.url || "");
    setGender(user.gender || "");
    setPhone((user.phone && user.phone.replace(/^\+63/, "")) || "");

    setPostalcode(user.postalcode || "");
    setAddress(user.address || "");

    setSelectedRegion(user.region || "");

    provinces(user.region || "").then((provinceResponse) =>
      setProvinceData(provinceResponse)
    );
    setSelectedProvince(user.province || "");

    cities(user.province || "").then((cityResponse) =>
      setCityData(cityResponse)
    );
    setSelectedCity(user.city || "");

    barangays(user.city || "").then((barangayResponse) =>
      setBarangayData(barangayResponse || [])
    );
    setSelectedBarangay(user.barangay || "");

    regions().then((regionResponse) => setRegionData(regionResponse));

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, [user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets);
      setMainImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!firstname) errors.firstname = "First name is required";
    if (!lastname) errors.lastname = "Last name is required";
    if (!phone) {
      errors.phone = "Phone number is required";
    } else {
      const phoneRegExp = /^9\d{9}$/;

      if (!phoneRegExp.test(phone)) {
        errors.phone = "Invalid phone number";
      }
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const updateProfile = (id) => {
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    let formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("gender", gender);
    formData.append("phone", "+63" + phone);
    formData.append("region", selectedRegion);
    formData.append("province", selectedProvince);
    formData.append("city", selectedCity);
    formData.append("barangay", selectedBarangay);
    formData.append("postalcode", postalcode);
    formData.append("address", address);

    if (mainImage == undefined) {
    } else if (mainImage !== image) {
      const newImageUri = "file:///" + mainImage.split("file:/").join("");

      formData.append("image", {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split("/").pop(),
      });
    }
    console.log(formData, "update user");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .put(`${baseURL}users/profile/${id}`, formData, config)
      .then((res) => {
        setIsLoading(false);

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Profile updated successfully!",
        });

        navigation.navigate("UserProfile");
      })
      .catch((error) => {
        setIsLoading(false);

        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.response.data.message,
        });
      });
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-red-500">
      <SafeAreaView>
        <View className="flex-1 justify-start bg-red-500 ">
          <View className="flex-row justify-between items-center w-full absolute">
            <TouchableOpacity
              className="rounded ml-4 mt-4"
              onPress={() => navigation.goBack()}
            >
              <View className="bg-red-500 rounded-full p-1 flex-row items-center">
                <ChevronLeftIcon size={28} color="white" />
                <Text className="text-white">Back</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex flex-row justify-center mt-5">
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={
                  mainImage
                    ? { uri: mainImage }
                    : require("../../assets/images/default-profile.jpg")
                }
                style={{ width: 200, height: 200 }}
                className="rounded-full "
              />

              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 20,
                  backgroundColor: "#18181b",
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 5,
                  borderColor: "#ef4444",
                  borderRadius: 20,
                }}
              >
                <PencilIcon size={15} color="white" />
              </View>
            </TouchableOpacity>
          </View>

          <View
            className="flex-1 bg-white mt-5"
            style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
          >
            <View className="form space-y-4 p-5 mt-5">
              <Text className="text-2xl font-bold text-red-500">
                Update Profile
              </Text>

              <View className="flex justify-center">
                <View className="">
                  <Text className="mb-3">First Name</Text>
                  <TextInput
                    className={
                      errors.firstname
                        ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                        : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                    }
                    placeholder="Enter First Name"
                    name={"firstname"}
                    id={"firstname"}
                    value={firstname}
                    onChangeText={(text) => setFirstname(text)}
                  ></TextInput>

                  {errors.firstname ? (
                    <Text className="text-sm text-red-500">
                      {errors.firstname}
                    </Text>
                  ) : null}
                </View>
                <View className="">
                  <Text className="mb-3">Last Name</Text>
                  <TextInput
                    className={
                      errors.lastname
                        ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                        : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                    }
                    placeholder="Enter Last Name"
                    name={"lastname"}
                    id={"lastname"}
                    value={lastname}
                    onChangeText={(text) => setLastname(text)}
                  ></TextInput>

                  {errors.lastname ? (
                    <Text className="text-sm text-red-500">
                      {errors.lastname}
                    </Text>
                  ) : null}
                </View>
              </View>

              <Text>Gender</Text>
              <Radio.Group
                accessibilityLabel="Gender"
                value={gender}
                onChange={(newValue) => setGender(newValue)}
                className="mb-3"
              >
                <Stack
                  direction={{
                    base: "row",
                    md: "row",
                  }}
                  alignItems={{
                    base: "flex-row",
                    md: "center",
                  }}
                  space={4}
                  w="75%"
                  maxW="300px"
                >
                  <Radio value="male" colorScheme="red" size="sm">
                    Male
                  </Radio>
                  <Radio value="female" colorScheme="red" size="sm">
                    Female
                  </Radio>
                  <Radio value="other" colorScheme="red" size="sm">
                    Other
                  </Radio>
                </Stack>
              </Radio.Group>

              <View>
                <Text className="mb-2">Mobile Number</Text>
                <View
                  className={
                    errors.phone
                      ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                      : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                  }
                >
                  <View className="flex-row items-center">
                    <Text>+63 </Text>

                    <TextInput
                      placeholder="Enter Phone Number"
                      value={phone}
                      name={"phone"}
                      id={"phone"}
                      onChangeText={(text) => setPhone(text)}
                      maxLength={10}
                    ></TextInput>
                  </View>
                </View>

                {errors.phone ? (
                  <Text className="text-sm text-red-500">{errors.phone}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                className={
                  isLoading
                    ? "bg-zinc-500 py-4 rounded-2xl"
                    : "bg-red-500 py-4 rounded-2xl"
                }
                onPress={() => updateProfile(user.id)}
                disabled={isLoading ? true : false}
              >
                <View className="flex flex-row space-x-2 items-center justify-center">
                  <Text className="font-xl font-bold text-center text-white">
                    {isLoading ? "Loading..." : "Update"}
                  </Text>

                  {isLoading && (
                    <ActivityIndicator size="small" color="white" />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default UserUpdate;
