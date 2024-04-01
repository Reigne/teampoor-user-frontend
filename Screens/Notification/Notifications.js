import React, { useCallback, useState, useContext } from "react";
import { Text, Image, TextInput, TouchableOpacity } from "react-native";
import { View, FlatList, ScrollView } from "native-base";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { AirbnbRating } from "react-native-ratings";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import NotificationList from "./NotificationList";
import AuthGlobal from "../../Context/Store/AuthGlobal";

const Notifications = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Track the current page
  const context = useContext(AuthGlobal);
  const id = context.stateUser.user.userId;
  
  // Fetch orders function
  const getOrders = () => {
    setLoading(true);

    axios
      // .get(`${baseURL}notifications/${id}?page=${page}`)
      .get(`${baseURL}notifications/${id}`)
      .then((res) => {
        // setAllOrders((prevOrders) => [...prevOrders, ...res.data]); // Append new orders to the existing ones
        // setPage((prevPage) => prevPage + 1); // Increment the page for the next fetch
        setNotifications(res.data)
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  // Fetch orders on component mount and unmount
  useFocusEffect(
    useCallback(() => {
      getOrders();

      return () => {
        setAllOrders([]);
        setPage(1);
      };
    }, [id])
  );

  // Function to handle reaching the end of the list
  const handleEndReached = () => {
    if (!loading) {
      getOrders(); // Fetch more orders when reaching the end of the list
    }
  };

  return (
    <View className="p-3 flex-1 bg-white">
      <SafeAreaView>
        <Text className="text-xl font-bold">Notifications</Text>
      </SafeAreaView>

      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <View className="mt-5">
            <NotificationList item={item} />
          </View>
        )}
        keyExtractor={(item) => item.id?.toString()}
        // onEndReached={handleEndReached} // Call handleEndReached when reaching the end of the list
        // onEndReachedThreshold={0.1} // Define how close to the end of the list the user must scroll to trigger the onEndReached callback
        // ListFooterComponent={loading && <Text>Loading...</Text>} // Show a loading indicator at the end of the list
      />
    </View>
  );
};

export default Notifications;
