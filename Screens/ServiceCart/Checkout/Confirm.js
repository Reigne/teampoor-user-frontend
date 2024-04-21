import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { faMotorcycle } from "@fortawesome/free-solid-svg-icons/faMotorcycle";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import axios from "axios";
import { useSelector } from "react-redux";
import baseURL from "../../../assets/common/baseUrl";
import AuthGlobal from "../../../Context/Store/AuthGlobal";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { CheckIcon } from "react-native-heroicons/solid";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as actions from "../../../Redux/Actions/serviceCartActions";
import Toast from "react-native-toast-message";
import { Checkbox, Modal } from "native-base";

const Confirm = (props) => {
  // console.log(props.route.params, "confirm props");
  const [token, setToken] = useState();
  const [serviceItem, setServiceItem] = useState([]);
  const [isCheck, setIsCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  let navigation = useNavigation();
  const finalService = props.route.params;

  console.log(finalService?.serviceCart?.selectedServices?.type, "final");

  // console.log(finalService?.serviceCart?.serviceItems[0], "finalService");

  const submitHandler = () => {
    setIsLoading(true);
    
    const service = finalService;
    const serviceSelected =
      finalService?.serviceCart?.selectedServices?.services;
    let serviceType = "";

    if (finalService?.serviceCart?.selectedServices?.type === 1) {
      serviceType = "Onsite Service";
    } else if (finalService?.serviceCart?.selectedServices?.type === 2) {
      serviceType = "Home Service";
    }

    service.serviceSelected = serviceSelected;
    service.serviceType = serviceType;

    console.log(service, "service");
    console.log(serviceSelected, "serviceSelected");

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(`${baseURL}appointments`, service, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Appointment Successfully Placed!",
            text2: "Thank you for choosing us!",
          });

          setTimeout(() => {
            navigation.navigate("Success");

            // props.navigation.reset({
            //   index: 0,
            //   routes: [{ name: "HomeService" }],
            // });
          }, 500);

          setIsLoading(false);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Order Placement Error",
          text2:
            error.response.data ||
            "Something went wrong. Please try again later.",
        });
        setIsLoading(false);
      });
  };

  return (
    <KeyboardAwareScrollView className="px-3 space-y-3">
      <SafeAreaView>
        <Text className="text-lg font-bold text-center">Order Summary</Text>
      </SafeAreaView>

      <View className="bg-white p-3 rounded-xl space-y-3">
        <Text className="text-base font-semibold">Contact Details</Text>
        <View className="space-y-2">
          <View className="flex flex-row justify-between">
            <Text className="text-zinc-500">Full Name:</Text>
            <Text className="font-semibold">{finalService?.fullname}</Text>
          </View>

          <View className="flex flex-row justify-between">
            <Text className="text-zinc-500">Phone #:</Text>
            <Text className="font-semibold">{finalService?.phone}</Text>
          </View>

          <View className="flex flex-row justify-between">
            <Text className="text-zinc-500">Service Location:</Text>
            <Text className="font-semibold">
              {finalService?.serviceCart?.selectedServices?.type === 1
                ? "Onsite Service"
                : finalService?.serviceCart?.selectedServices?.type === 2
                ? "Home Service"
                : ""}
            </Text>
          </View>
        </View>
      </View>

      {finalService?.serviceCart?.selectedServices?.type === 2 && (
        <View className="bg-white p-3 rounded-xl space-y-3">
          <View>
            <Text className="text-base font-semibold">Home Address</Text>
            <Text className="text-zinc-500">
              Your home address information.
            </Text>
          </View>
          <View className="space-y-2">
            <View className="flex flex-row justify-between">
              <Text>
                {finalService?.address}, {finalService?.barangay},{" "}
                {finalService?.city},{finalService?.province},{" "}
                {finalService?.region}, {finalService?.postalcode}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View className="bg-white p-3 rounded-xl space-y-3">
        <View>
          <Text className="text-base font-semibold">Motorcycle</Text>
          <Text className="text-zinc-500">Your motorcycle information.</Text>
        </View>

        <View className="space-y-2">
          <View className="flex flex-row justify-between">
            <Text className="text-zinc-500">Brand:</Text>
            <Text className="font-semibold">{finalService?.brand}</Text>
          </View>
          {/* 
          <View className="flex flex-row justify-between">
            <Text className="text-zinc-500">Model:</Text>
            <Text className="font-semibold">{finalService?.model}</Text>
          </View> */}

          <View className="flex flex-row justify-between">
            <Text className="text-zinc-500">Year Model:</Text>
            <Text className="font-semibold">{finalService?.year}</Text>
          </View>

          <View className="flex flex-row justify-between">
            <Text className="text-zinc-500">Plate Number:</Text>
            <Text className="font-semibold">{finalService?.plateNumber}</Text>
          </View>

          <View className="flex flex-row justify-between">
            <Text className="text-zinc-500">Engine Number:</Text>
            <Text className="font-semibold">{finalService?.engineNumber}</Text>
          </View>

          <View className="flex flex-row justify-between">
            <Text className="text-zinc-500">Type of Fuel:</Text>
            <Text className="font-semibold">{finalService?.fuel}</Text>
          </View>

          <View className="flex flex-row justify-between">
            <Text className="text-zinc-500">Vehicle Category:</Text>
            <Text className="font-semibold">{finalService?.type}</Text>
          </View>
        </View>
      </View>

      <View className="bg-white p-3 rounded-xl space-y-3">
        <View>
          <Text className="text-base font-semibold">Type of Services</Text>
          <Text className="text-zinc-500">Your selected services:</Text>
        </View>

        <View className="space-y-2">
          {finalService?.serviceCart?.selectedServices?.services?.map(
            (service, index) => (
              <View key={index} className="">
                <View className="flex flex-row justify-between items-center bg-zinc-100 p-1 rounded-lg">
                  <View className="flex-row items-center space-x-4">
                    <Image
                      className="rounded mb-1"
                      style={{
                        width: 35,
                        height: 35,
                      }}
                      source={{
                        uri: service?.images[0]?.url
                          ? service?.images[0]?.url
                          : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
                      }}
                      alt="product images"
                    />
                    <Text>{service?.name}</Text>
                  </View>
                  <Text>{service?.price?.toFixed(2)}</Text>
                </View>
              </View>
            )
          )}
        </View>
      </View>

      <View className="flex flex-row space-x-2 items-center">
        <Checkbox
          colorScheme="info"
          isChecked={isCheck}
          onPress={() => setIsCheck(!isCheck)}
        />

        <View className="flex-1 flex-wrap flex-row space-x-1 items-center">
          <Text>By scheduling this appointment, you agree to the</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Text className="text-blue-500">terms and conditions *</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="">
        <View className="flex justify-center items-center my-2">
          <TouchableOpacity
            onPress={() => submitHandler()}
            className={
              isLoading
                ? "bg-zinc-500 w-full py-3 rounded-xl items-center"
                : isCheck === true
                ? "bg-red-500 w-full py-3 rounded-xl items-center"
                : "bg-zinc-500 w-full py-3 rounded-xl items-center"
            }
            disabled={isLoading === true || isCheck === false}
          >
            <View className="flex flex-row space-x-2 items-center justify-center">
              <Text className="font-xl font-bold text-center text-white">
                {isLoading ? "Loading..." : "Place Appointment"}
              </Text>

              {isLoading && <ActivityIndicator size="small" color="white" />}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="500px">
          <Modal.CloseButton />
          <Modal.Body>
            <View className="space-y-4">
              <View className="flex-1">
                <View className="flex-1 space-y-2">
                  {/* Your modal content goes here */}

                  <View>
                    <Text className="text-xl font-bold">
                      Terms and Conditions
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text>
                      When scheduling a service appointment through the [Your
                      Motorcycle Shop] mobile application ("the App"), users
                      agree to the following terms and conditions:
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text>1. Appointment Booking:</Text>
                  </View>
                  <View className="flex-1">
                    <Text>
                      By booking a service appointment through the App, users
                      confirm their agreement to these terms and conditions.
                      Users must provide accurate information regarding the type
                      of service required and any specific requests or
                      instructions.:
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex-1 flex-row">
                <View className="flex-1 flex-row justify-center items-center space-x-2">
                  <TouchableOpacity
                    className="bg-green-500 p-2 rounded grow items-center"
                    onPress={() => {
                      [setShowModal(false), setIsCheck(true)];
                    }}
                  >
                    <Text className="text-white">Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="border border-zinc-500 p-2 rounded grow items-center"
                    onPress={() => {
                      [setShowModal(false), setIsCheck(true)];
                    }}
                  >
                    <Text className="">Cancel</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                      className="bg-red-500 p-3 rounded grow items-center"
                      onPress={() => {
                        // Handle modal action
                        [setShowModal(false), cancelOrder(itemID)];
                      }}
                    >
                      <Text className="text-white">Yes</Text>
                    </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </KeyboardAwareScrollView>
  );
};

export default Confirm;
