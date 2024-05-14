import React, { useState, useContext, useCallback, useEffect } from "react";
import { ScrollView, FlatList } from "native-base";
import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGasPump } from "@fortawesome/free-solid-svg-icons/faGasPump";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AuthGlobal from "../../../Context/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../../assets/common/baseUrl";
import axios from "axios";
import Toast from "react-native-toast-message";
import {
  BanknotesIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";

const UserDashboard = () => {
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);

  const [userId, getUserId] = useState(context.stateUser.user.userId);
  const [totalCostLast30Days, setTotalCostLast30Days] = useState(0);
  const [totalProductCostLast30Days, setTotalProductCostLast30Days] =
    useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const [allFuel, setAllFuel] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [fuel, setFuel] = useState();
  const [token, setToken] = useState();

  useFocusEffect(
    useCallback(() => {
      fetchData();

      return () => {
        setAllFuel();
      };
    }, [userId])
  );

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${baseURL}fuels/totalCostLast30Days`,
        config
      );

      setTotalCostLast30Days(response.data.totalCost);

      const fuelresponse = await axios.get(
        `${baseURL}fuels/all/${userId}`,
        config
      );

      setAllFuel(fuelresponse.data);

      const totalexpensesresponse = await axios.get(
        `${baseURL}orders/total-expenses/${userId}`,
        config
      );

      setTotalExpenses(totalexpensesresponse.data.totalExpenses);

      const productCostResponse = await axios.get(
        `${baseURL}orders/total-cost/last-30-days/${userId}`,
        config
      );

      const totalProductCost = productCostResponse.data.totalCost;

      setTotalProductCostLast30Days(totalProductCost);
    } catch (error) {
      console.error("Error fetching total cost:", error);
      // Handle error
    }
  };

  // console.log(allFuel);
  //   console.log(props.route.params);

  const toggleModal = (id) => {
    setModalVisible(!isModalVisible);
    setFuel(id);
  };

  const deleteHandler = (id) => {
    console.log(id, "id");

    setModalVisible(!isModalVisible);

    axios
      .delete(`${baseURL}fuels/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        fetchData();
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Fuel successfuly deleted",
          text2: "",
        });
      })
      .catch((error) => console.log(error));
  };

  const renderFuel = ({ item }) => {
    // console.log(item, "Render Fuel");

    return (
      <>
        <TouchableOpacity
          className="bg-slate-100 p-3 rounded-lg mb-1"
          onLongPress={() => toggleModal(item)}
        >
          <View className="flex flex-row items-center space-x-3">
            <View>
              <Text className="w-16">
                {new Date(item.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>

            <View className="w-14">
              <Text>₱{item.price}</Text>
            </View>

            <View className="w-16">
              <Text>{item.quantity}</Text>
            </View>

            <View className="w-16">
              <Text>₱{item.totalCost?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}</Text>
            </View>

            <View className="w-14">
              <Text>{item.fillingStation}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-white">
      <View className="p-4">
        <View className="flex flex-row">
          <TouchableOpacity
            className="bg-slate-700 rounded-lg p-4 flex-row space-x-2 items-center"
            onPress={() => navigation.navigate("AddFuel")}
          >
            <Text className="text-white font-bold">+ Add Fuel</Text>
            <FontAwesomeIcon icon={faGasPump} color="white" size={20} />
          </TouchableOpacity>
        </View>

        <View className="mt-4">
          <Text className="font-extrabold text-xl">Dashboard</Text>
        </View>

        <View className="rounded-xl space-y-3 gap-x-2 mt-2 flex-wrap flex flex-row justify-between items-center">
          {/* <Text>Total Cost of Gas in Last 30 Days: ₱{totalCostLast30Days}</Text> */}

          <View className="flex-row bg-red-600 p-4 items-center space-x-2 rounded-xl grow">
            <View className="bg-red-500 rounded-xl p-3">
              <BanknotesIcon color="white" />
            </View>

            <View className="w-22">
              <Text className="text-white ">Fuel Cost</Text>
              <Text className="text-white text-xs">(Last 30 days)</Text>
              <Text className="text-white text-base font-bold">
                ₱{totalCostLast30Days}
              </Text>
            </View>
          </View>

          <View className="flex flex-row bg-cyan-600 p-4 items-center space-x-2 rounded-xl grow">
            <View className="bg-cyan-500 rounded-xl p-3">
              <FontAwesomeIcon icon={faGasPump} color="white" size={23} />
            </View>

            <View className="w-22">
              <Text className="text-white">Added Fuel</Text>
              <Text className="text-white text-xs">(Last 30 days)</Text>
              <Text className="text-white text-base font-bold">
                {allFuel?.length} Times
              </Text>
            </View>
          </View>

          <View className="flex flex-row bg-indigo-600 p-4 items-center space-x-2 rounded-xl grow">
            <View className="bg-indigo-500 rounded-xl p-3">
              <ShoppingBagIcon color="white" />
            </View>

            <View className="w-22">
              <Text className="text-white">Product Cost</Text>
              <Text className="text-white text-xs">(Last 30 days)</Text>
              <Text className="text-white text-base font-bold">
                ₱{totalProductCostLast30Days}
              </Text>
            </View>
          </View>

          <View className="flex flex-row bg-violet-700 p-4 items-center space-x-2 rounded-xl grow">
            <View className="bg-violet-500 rounded-xl p-3">
              <BanknotesIcon color="white" />
            </View>

            <View className="w-22">
              <Text className="text-white">Total Expenses</Text>
              <Text className="text-white text-xs">(All Expenses)</Text>
              <Text className="text-white text-base font-bold">
                ₱{totalExpenses}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-base font-bold">Recent Log (Fuel)</Text>

          <View className="flex mt-2">
            <View className="bg-slate-100 rounded-lg p-3 mb-1 flex flex-row space-x-3">
              <Text className="font-bold w-16">Date</Text>
              <Text className="font-bold w-14">Price</Text>
              <Text className="font-bold w-16">Quantity</Text>
              <Text className="font-bold w-16">Total</Text>
              <Text className="font-bold w-14">Station</Text>
            </View>

            <FlatList
              data={allFuel}
              renderItem={renderFuel}
              keyExtractor={(item) => item.id?.toString()}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center">
                  {/* <Text className="text-xl font-bold text-red-500">
                    NO APPOINTMENT FOUND
                  </Text> */}
                  <Text className="text-xs">No fuel logs found.</Text>
                </View>
              }
            />

            {/* <TouchableOpacity className="bg-slate-100 rounded-lg p-2 justify-center items-center mt-1">
              <Text>Show More</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View className="flex jutify-center items-center">
          <View className="bg-white p-5 rounded-xl w-10/12">
            {/* Close button (x icon) */}
            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10 }}
              onPress={toggleModal}
            >
              <XMarkIcon size={20} color="#333" />
            </TouchableOpacity>

            {/* Modal content */}
            <Text>Please select</Text>

            {/* Close button */}
            <TouchableOpacity
              className="bg-green-500 p-3 rounded mt-2"
              onPress={() => navigation.navigate("AddFuel", fuel, userId)}
            >
              <Text className="text-white text-center">Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-500 p-3 rounded mt-2"
              // onPress={toggleModal}
              onPress={() => deleteHandler(fuel._id)}
            >
              <Text className="text-white text-center">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
};

export default UserDashboard;
