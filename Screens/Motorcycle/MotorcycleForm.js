import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  Box,
  HStack,
  Avatar,
  VStack,
  Spacer,
  Button,
  AddIcon,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import mime from "mime";
import * as ImagePicker from "expo-image-picker";

const MotorcycleForm = (props) => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [engineNumber, setEngineNumber] = useState("");
  const [type, setType] = useState("");
  const [fuel, setFuel] = useState("");
  const [imageMotorcycle, setImageMotorcycle] = useState([]);
  const [imagePlateNumber, setImagePlateNumber] = useState([]);

  const [item, setItem] = useState();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [userId, setUserId] = useState("");
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();

  console.log(context.stateUser.user.userId);

  useEffect(() => {
    if (!props.route.params) {
      setItem(null);
    } else {
      setBrand(props.route.params.item.brand);
      setModel(props.route.params.model);
      setYear(props.route.params.item.year);
      setPlateNumber(props.route.params.item.plateNumber);
      setEngineNumber(props.route.params.item.engineNumber);
      setType(props.route.params.item.type);
      setFuel(props.route.params.item.fuel);
      setImageMotorcycle(props.route.params.item.imageMotorcycle);
      setImagePlateNumber(props.route.params.item.imagePlateNumber);
    }

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

    // return () => {
    // };
  }, []);

  const pickMotorcycleImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
      selectionLimit: 2,
    });

    if (result.canceled) {
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const images = result.assets.map((asset) => ({
        uri: asset.uri,
        name: extractFileName(asset.uri), // include the original file name
      }));

      setImageMotorcycle(images);
    }

    // console.log(imgMotorcycle);
  };

  const removeImageMotor = (index) => {
    const newImgMotorcycle = [...imageMotorcycle];
    newImgMotorcycle.splice(index, 1);
    setImageMotorcycle(newImgMotorcycle);
  };

  const pickPlateNumberImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
      selectionLimit: 2,
    });

    console.log(result, "result");

    if (result.canceled) {
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const images = result.assets.map((asset) => ({
        uri: asset.uri,
        name: extractFileName(asset.uri), // include the original file name
      }));

      setImagePlateNumber(images);

      console.log(images, "images");
    }
  };

  const extractFileName = (uri) => {
    const uriParts = uri.split("/");
    return uriParts[uriParts.length - 1];
  };

  const removeImage = (index) => {
    const newImagePlateNumber = [...imagePlateNumber];
    newImagePlateNumber.splice(index, 1);
    setImagePlateNumber(newImagePlateNumber);
  };

  const validateForm = () => {
    let errors = {};

    if (!model) errors.model = "Model is required";
    if (!year) errors.year = "Year is required";
    if (!brand) errors.brand = "Brand is required";
    if (!plateNumber) errors.plateNumber = "Plate number is required";
    if (!engineNumber) errors.engineNumber = "Engine number is required";
    if (!type) errors.type = "Type is required";
    if (!fuel) errors.fuel = "Type is required";

    if (imagePlateNumber.length === 0)
      errors.imagePlateNumber = "Image of Plate Number is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const createMotorcycle = () => {
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    let formData = new FormData();

    formData.append("brand", brand);
    formData.append("model", model);
    formData.append("year", year);
    formData.append("plateNumber", plateNumber);
    formData.append("engineNumber", engineNumber);
    formData.append("type", type);
    formData.append("fuel", fuel);


    console.log(imageMotorcycle.length, "imageMotorcycle.length")
    {
      imageMotorcycle.length > 0 &&
        imageMotorcycle.forEach((image, index) => {
          const newMotorImageUri =
            "file:///" + image.uri.split("file:/").join("");

          formData.append("imageMotorcycle", {
            uri: newMotorImageUri,
            type: mime.getType(newMotorImageUri),
            name: newMotorImageUri.split("/").pop(),
            img: "motor",
          });
        });
    }

    imagePlateNumber.forEach((image, index) => {
      const newImageUri = "file:///" + image.uri.split("file:/").join("");

      formData.append("imagePlateNumber", {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split("/").pop(),
        img: "req",
      });
    });

    console.log(formData, "form data");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const userId = context.stateUser.user.userId;

    if (item !== null) {
      console.log(item);

      axios
        .put(`${baseURL}motorcycle/${item.id}`, formData, config, userId)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Service successfuly updated",
              text2: "",
            });

            setTimeout(() => {
              navigation.navigate("Services");
            }, 500);

            setLoading(false);
          }
        })
        .catch((error) => {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Update Product Form",
          });
          console.log(error);

          setLoading(false);
        });
    } else {
      axios
        .post(
          `${baseURL}motorcycles/create-motorcycle/${userId}`,
          formData,
          config
        )
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "New Motorcycle Added",
              text2: "Successfuly",
            });

            setTimeout(() => {
              navigation.navigate("Motorcycles");
            }, 500);

            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Create Service Form",
          });

          setLoading(false);
        });
    }
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-white">
      <View className="flex-1 mb-5">
        <View className="px-5">
          <View className="">
            <Text className="font-bold text-xl">Create Motorcycle</Text>
          </View>

          <View className="mt-3 space-y-1">
            <Text>Brand *</Text>
            <TextInput
              className={
                errors.brand
                  ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                  : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
              }
              placeholder="Enter brand"
              name="brand"
              id="brand"
              value={brand}
              onChangeText={(text) => setBrand(text)}
            ></TextInput>
            <View>
              {errors.brand ? (
                <Text className="text-sm text-red-500">{errors.brand}</Text>
              ) : null}
            </View>
          </View>

          <View className="mt-4 space-y-1">
            <Text>Model *</Text>
            <TextInput
              className={
                errors.model
                  ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                  : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
              }
              placeholder="Enter motorycycle model"
              name="model"
              id="model"
              value={model}
              onChangeText={(text) => setModel(text)}
            ></TextInput>
            <View>
              {errors.model ? (
                <Text className="text-sm text-red-500">{errors.model}</Text>
              ) : null}
            </View>
          </View>

          <View className="mt-3 space-y-1">
            <Text>Year *</Text>
            <TextInput
              className={
                errors.year
                  ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                  : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
              }
              placeholder="Enter year"
              name="year"
              id="year"
              value={year}
              onChangeText={(text) => setYear(text)}
            ></TextInput>
            <View>
              {errors.year ? (
                <Text className="text-sm text-red-500">{errors.year}</Text>
              ) : null}
            </View>
          </View>

          <View className="mt-3 space-y-1">
            <Text>Plate Number *</Text>
            <TextInput
              className={
                errors.plateNumber
                  ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                  : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
              }
              //   className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
              // className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 w-44"
              placeholder="Enter plate number"
              name="plateNumber"
              id="plateNumber"
              value={plateNumber}
              onChangeText={(text) => setPlateNumber(text)}
            ></TextInput>
            <View>
              {errors.plateNumber ? (
                <Text className="text-sm text-red-500">
                  {errors.plateNumber}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="mt-3 space-y-1">
            <Text>Engine Number *</Text>
            <TextInput
              className={
                errors.engineNumber
                  ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                  : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
              }
              //   className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
              // className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 w-44"
              placeholder="Enter engine number"
              name="plateNumber"
              id="plateNumber"
              value={engineNumber}
              onChangeText={(text) => setEngineNumber(text)}
            ></TextInput>
            <View>
              {errors.engineNumber ? (
                <Text className="text-sm text-red-500">
                  {errors.engineNumber}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="mt-3 space-y-1">
            <Text>Type *</Text>
            <TextInput
              className={
                errors.type
                  ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                  : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
              }
              //   className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
              // className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 w-44"
              placeholder="Enter type"
              name="plateNumber"
              id="plateNumber"
              value={type}
              onChangeText={(text) => setType(text)}
            ></TextInput>
            <View>
              {errors.type ? (
                <Text className="text-sm text-red-500">{errors.type}</Text>
              ) : null}
            </View>
          </View>

          <View className="mt-3 space-y-1">
            <Text>Fuel *</Text>
            <TextInput
              className={
                errors.fuel
                  ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                  : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
              }
              //   className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
              // className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 w-44"
              placeholder="Enter fuel"
              name="plateNumber"
              id="plateNumber"
              value={fuel}
              onChangeText={(text) => setFuel(text)}
            ></TextInput>
            <View>
              {errors.fuel ? (
                <Text className="text-sm text-red-500">{errors.fuel}</Text>
              ) : null}
            </View>
          </View>

          <View className="mt-3 space-y-2">
            <Text>Plate Number Image *</Text>

            {imagePlateNumber.length > 0 ? (
              <View>
                <FlatList
                  data={imagePlateNumber}
                  keyExtractor={(item, index) => index.toString()} // use index as the key
                  renderItem={({ item, index }) => (
                    <View className="flex flex-row space-x-2 items-center">
                      <TouchableOpacity
                        className=""
                        onPress={() => removeImage(index)}
                      >
                        <XMarkIcon color="red" size={18} />
                      </TouchableOpacity>

                      <Image
                        source={
                          item.uri
                            ? { uri: item.uri }
                            : require("../../assets/images/teampoor-default.png")
                        }
                        style={{ width: 50, height: 50, margin: 1 }}
                        resizeMode="contain"
                      />
                      <Text>{item.name}</Text>
                    </View>
                  )}
                />
              </View>
            ) : null}

            <TouchableOpacity
              className={
                errors.imagePlateNumber
                  ? "p-8 border border-red-500 rounded-2xl justify-center items-center space-y-3"
                  : "p-8 border-2 border-gray-100 rounded-2xl justify-center items-center space-y-3"
              }
              onPress={pickPlateNumberImages}
            >
              <ArrowUpTrayIcon color="#374151" size={24} />
              <Text className="text-gray-700">Browse image to upload</Text>
            </TouchableOpacity>
            <View>
              {errors.imagePlateNumber ? (
                <Text className="text-sm text-red-500">
                  {errors.imagePlateNumber}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="mt-3 space-y-2">
            <View className="flex-row items-center">
              <Text>Motorcycle Image </Text>
              <Text className="text-xs text-zinc-600">(Optional)</Text>
            </View>

            {imageMotorcycle.length > 0 ? (
              <View>
                <FlatList
                  data={imageMotorcycle}
                  keyExtractor={(item, index) => index.toString()} // use index as the key
                  renderItem={({ item, index }) => (
                    <View className="flex flex-row space-x-2 items-center">
                      <TouchableOpacity
                        className=""
                        onPress={() => removeImageMotor(index)}
                      >
                        <XMarkIcon color="red" size={18} />
                      </TouchableOpacity>

                      <Image
                        source={
                          item.uri
                            ? { uri: item.uri }
                            : require("../../assets/images/teampoor-default.png")
                        }
                        style={{ width: 50, height: 50, margin: 1 }}
                        resizeMode="contain"
                      />
                      <Text>{item.name}</Text>
                    </View>
                  )}
                />
              </View>
            ) : null}

            <TouchableOpacity
              className={
                errors.imageMotorcycle
                  ? "p-8 border border-red-500 rounded-2xl justify-center items-center space-y-3"
                  : "p-8 border-2 border-gray-100 rounded-2xl justify-center items-center space-y-3"
              }
              onPress={pickMotorcycleImages}
            >
              <ArrowUpTrayIcon color="#374151" size={24} />
              <Text className="text-gray-700">Browse image to upload</Text>
            </TouchableOpacity>
            <View>
              {errors.imageMotorcycle ? (
                <Text className="text-sm text-red-500">
                  {errors.imageMotorcycle}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="mt-5 space-y-2">
            <TouchableOpacity
              className={
                loading
                  ? "p-4 bg-zinc-500 rounded-full flex items-center"
                  : "p-4 bg-red-500 rounded-full flex items-center"
              }
              onPress={() => {
                setLoading(true);
                createMotorcycle();
              }}
              disabled={loading ? true : false}
            >
              {loading ? (
                <View className="flex-row space-x-2 items-center">
                  <Text className="text-white font-bold">Please wait...</Text>
                  <ActivityIndicator animating={true} color="white" />
                </View>
              ) : (
                <View className="flex-row space-x-2 items-center">
                  <Text className="text-white font-bold">
                    Create Motorcycle
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default MotorcycleForm;
