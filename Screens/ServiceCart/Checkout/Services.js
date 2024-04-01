import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  View,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
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
  Image,
  Button,
  AddIcon,
  Select,
  CheckIcon,
  Checkbox,
} from "native-base";

import {
  clearServiceCart,
  removeServiceFromCart,
  updateCartItemQuantity,
} from "../../../Redux/Actions/serviceCartActions";

import {
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
import AuthGlobal from "../../../Context/Store/AuthGlobal";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import cartItems from "../../../Redux/Reducers/cartItems";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import baseURL from "../../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as actions from "../../../Redux/Actions/serviceCartActions";

const Services = (props) => {
  console.log(props.route.params);
  const service = props.route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [type, setType] = useState("");
  const [serviceFilter, setServiceFilter] = useState([]);
  const serviceCartItems = useSelector((state) => state.serviceCartItems);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [checkedServices, setCheckedServices] = useState([]);

  var total = 0;

  serviceCartItems.forEach((cart) => {
    return (total += cart.price * cart.quantity);
  });

  const filterServicesByType = useCallback(() => {
    setCheckedServices([]);
    const filteredServices = services.filter(
      (service) => service.type === type || service.type === 3
    );
    setServiceFilter(filteredServices);
  }, [services, type]);

  useFocusEffect(
    useCallback(() => {
      //get token
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));

      setTimeout(() => {
        axios.get(`${baseURL}services`).then((res) => {
          console.log(res.data);
          setServices(res.data);
          setLoading(false);
        });
      }, 2000);

      return () => {
        setServices([]);
        setLoading(false);
      };
    }, [])
  );

  useEffect(() => {
    filterServicesByType();
  }, [type, filterServicesByType]);

  const handleCheckboxChange = (serviceId) => {
    setCheckedServices((prevCheckedServices) => {
      const isChecked = prevCheckedServices.includes(serviceId);
      if (isChecked) {
        return prevCheckedServices.filter((id) => id !== serviceId);
      } else {
        return [...prevCheckedServices, serviceId];
      }
    });
  };

  const submitHandler = () => {
    console.log("Checked services:", checkedServices);

    // Get the selected service objects based on their IDs
    const selectedServices = services.filter((service) =>
      checkedServices.includes(service._id)
    );

    // Check if any services are selected
    if (selectedServices.length > 0) {
      // Create an object containing the selected services and the type
      const serviceData = {
        services: selectedServices,
        type: type,
      };

      //   // Dispatch the object containing the selected services and type
      //   dispatch(actions.addServiceToCart(serviceData));

      service.selectedServices = serviceData;

      console.log(service);
      navigation.navigate("Appointment", service);
    } else {

      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please select any services.",
        text2: "Incomplete form.",
      });

      console.log("No services selected.");

      return
    }
  };

  console.log("Checked services:", checkedServices);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1">
          {/* <View className="p-3 flex flex-row justify-between items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeftIcon color="black" size={20} />
            </TouchableOpacity>

            <View>
              <Text className="font-bold text-lg">Service Cart</Text>
            </View>

            <View>
              {serviceCartItems.length > 0 && (
                <TouchableOpacity onPress={() => dispatch(clearServiceCart())}>
                  <TrashIcon color="#ef4444" size={20} />
                </TouchableOpacity>
              )}
            </View>
          </View> */}

          <View className="p-3 space-y-4">
            <View>
              <Text className="font-semibold">Service Location *</Text>

              <Select
                selectedValue={type}
                minWidth="200"
                accessibilityLabel="Choose Service"
                placeholder="Choose Service"
                _selectedItem={{
                  bg: "red.500",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(itemValue) => setType(itemValue)}
              >
                <Select.Item label="Onsite Service" value={1} />
                <Select.Item label="Home Service" value={2} />
              </Select>
            </View>

            <View>
              <Text className="font-semibold">Type of Service Needed *</Text>
              {type ? (
                <ScrollView>
                  {serviceFilter.map((service) => (
                    <>
                      {service.isAvailable === true && (
                        <View key={service._id} className="p-2">
                          <Checkbox
                            value={service._id}
                            colorScheme="success"
                            isChecked={checkedServices.includes(service._id)}
                            onChange={() => handleCheckboxChange(service._id)}
                          >
                            {service.name}
                          </Checkbox>
                        </View>
                      )}
                    </>
                  ))}
                </ScrollView>
              ) : (
                <View className="pt-2 justify-center">
                  <Text className="text-zinc-500">
                    Please select type of service.
                  </Text>
                </View>
              )}
            </View>

            <View></View>
          </View>
        </View>
      </SafeAreaView>

      <View className="absolute bottom-3 w-full px-2">
        {/* <View className="p-3  flex flex-row justify-between items-center bg-zinc-100 rounded-lg mb-1">
          <Text className="">Total Price:</Text>

          <Text className="text-base text-red-500 font-bold">
            ₱{total?.toFixed(2)}
          </Text>
        </View> */}
        <View className="flex justify-center items-center">
          {/* {serviceCartItems.length > 0 && ( */}
          <TouchableOpacity
            className="bg-red-500 rounded-xl w-full py-4 px-4"
            onPress={() => submitHandler()}
          >
            <Text className="font-bold text-white text-center">
              Book Appointment
            </Text>
          </TouchableOpacity>
          {/* )} */}
        </View>
      </View>
    </View>
  );
};

export default Services;
