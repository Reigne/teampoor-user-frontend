import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import baseURL from "../../../assets/common/baseUrl";
import AuthGlobal from "../../../Context/Store/AuthGlobal";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ScrollView, FlatList } from "native-base";
import AppointmentList from "./AppointmentList";
import { CalendarDaysIcon } from "react-native-heroicons/solid";

const Appointment = (props) => {
  const userID = props.route.params.user._id;
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const navigation = useNavigation();
  // console.log("user id", userID);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();

      return () => {
        // setAppointments();
      };
    }, [])
  );

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}appointments/user/${userID}?page=${page}`
      );
      if (page === 1) {
        setAppointments(response.data);
      } else {
        setAppointments([...appointments, ...response.data]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  const cancelHandler = async (id) => {
    try {
      await axios.put(`${baseURL}appointments/update/${id}`, {
        status: "CANCELLED",
      });
      // Call fetchAppointments again to update the list
      fetchAppointments();

      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Appointment Status Updated",
        text2: `#${id} Appointment has been Cancelled`, // Use id directly
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    }
  };

  const loadMore = () => {
    if (!isFetching) {
      setPage(page + 1);
      setIsFetching(true);
    }
  };

  console.log("appointments", appointments);

  const renderAppointment = ({ item }) => {
    return (
      <TouchableOpacity
        className="bg-zinc-100 p-3 rounded-xl space-y-3"
        onPress={() => navigation.navigate("AppointmentDetails", item)}
      >
        <View className="flex flex-row justify-between items-center">
          <Text className="font-bold">{item?.serviceType}</Text>

          <View
            className={
              item.appointmentStatus?.pop()?.status === "PENDING"
                ? "bg-yellow-200 px-2 rounded"
                : item.appointmentStatus?.pop()?.status === "Pending"
                ? "bg-yellow-200 px-2 rounded"
                : item.appointmentStatus?.pop()?.status === "CONFIRMED"
                ? "bg-green-200 px-2 rounded"
                : item.appointmentStatus?.pop()?.status === "INPROGRESS"
                ? "bg-blue-200 px-2 rounded"
                : item.appointmentStatus?.pop()?.status === "COMPLETED"
                ? "bg-green-200 px-2 rounded"
                : item.appointmentStatus?.pop()?.status === "CANCELLED"
                ? "bg-red-200 px-2 rounded"
                : item.appointmentStatus?.pop()?.status === "RESCHEDULED"
                ? "bg-purple-200 px-2 rounded"
                : item.appointmentStatus?.pop()?.status === "DELAYED"
                ? "bg-yellow-200 px-2 rounded"
                : item.appointmentStatus?.pop()?.status === "NOSHOW"
                ? "bg-red-200 px-2 rounded"
                : item.appointmentStatus?.pop()?.status === "BACKJOBPENDING"
                ? "bg-red-200 px-2 rounded"
                : "bg-zinc-200 px-2 rounded"
            }
          >
            <Text
              className={
                item.appointmentStatus?.pop()?.status === "PENDING"
                  ? "text-xs text-yellow-800"
                  : item.appointmentStatus?.pop()?.status === "Pending"
                  ? "text-xs text-yellow-800"
                  : item.appointmentStatus?.pop()?.status === "CONFIRMED"
                  ? "text-xs text-green-800"
                  : item.appointmentStatus?.pop()?.status === "INPROGRESS"
                  ? "text-xs text-blue-800"
                  : item.appointmentStatus?.pop()?.status === "COMPLETED"
                  ? "text-xs text-green-800"
                  : item.appointmentStatus?.pop()?.status === "CANCELLED"
                  ? "text-xs text-red-800"
                  : item.appointmentStatus?.pop()?.status === "RESCHEDULED"
                  ? "text-xs text-purple-800"
                  : item.appointmentStatus?.pop()?.status === "DELAYED"
                  ? "text-xs text-yellow-800"
                  : item.appointmentStatus?.pop()?.status === "NOSHOW"
                  ? "text-xs text-red-800"
                  : ""
              }
            >
              {item.appointmentStatus?.pop()?.status}
            </Text>
          </View>
        </View>

        <View>
          {/* <Text className="text-xs">Service Type: {item?.serviceType}</Text> */}
          <View>
            <Text className="text-xs">Appointment Date:</Text>
            <View className="flex-row space-x-1 items-center">
              <CalendarDaysIcon size={18} color="black" />
              <Text className="text-xs font-semibold">
                {item.appointmentDate
                  ? new Date(item.appointmentDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "2-digit",
                      year: "numeric",
                    }) + " "
                  : ""}{" "}
                - {item.timeSlot}
              </Text>
            </View>
          </View>
        </View>

        <View className="border-b border-zinc-300" />

        <View className="space-y-2">
          {item?.appointmentService?.map((service, index) => (
            <View className="flex flex-row space-x-4">
              <View>
                <Image
                  className="rounded mb-1"
                  style={{
                    width: 48,
                    height: 48,
                  }}
                  source={
                    service.service.images[0]?.url
                      ? { uri: service.service.images[0]?.url }
                      : require("../../../assets/images/teampoor-default.png")
                  }
                  alt="images"
                />
              </View>

              <View className="w-1/2">
                <Text>{service.service.name}</Text>
                <Text className="font-light text-xs" numberOfLines={2}>
                  {service.service.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {item.appointmentStatus?.pop()?.status === "DONE" && (
          <View className="flex flex-row justify-end">
            <TouchableOpacity
              className="bg-green-500 px-3 py-2 rounded-lg"
              onPress={() => navigation.navigate("MechanicFeedback", item)}
            >
              <Text className="text-white">Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.appointmentStatus?.pop()?.status === "Pending" && (
          <View className="flex flex-row justify-end">
            <TouchableOpacity
              className="border border-red-500 px-3 py-2 rounded-lg"
              onPress={() => cancelHandler(item._id)}
            >
              <Text className="text-red-500 text-xs">Cancel Appointment</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white p-3 ">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="red" size={34} />
        </View>
      ) : (
        <View className="flex-1 space-y-3">
          <Text className="text-lg font-bold">My Service Appointment</Text>

          <View className="flex-1">
            <FlatList
              contentContainerStyle={{ flexGrow: 1 }}
              data={appointments.slice().reverse()}
              keyExtractor={(item) => item.id?.toString()}
              renderItem={({ item, index }) => (
                <View className="mb-2">
                  <AppointmentList
                    item={item}
                    index={index}
                    cancelHandler={cancelHandler}
                  />
                </View>
              )}
              // renderItem={renderAppointment}
              onEndReached={loadMore}
              onEndReachedThreshold={0.1}
              // ListFooterComponent={() =>
              //   isFetching ? (
              //     <ActivityIndicator size="large" color="red" />
              //   ) : null
              // }
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center">
                  <View>
                    <Image
                      style={{ width: 120, height: 120 }} // Adjust the width and height as needed
                      source={require("../../../assets/images/no-found.png")}
                      alt="empty-cart"
                    />
                  </View>
                  <Text className="text-xl font-bold text-red-500">
                    NO APPOINTMENT FOUND
                  </Text>
                  <Text className="text-xs">
                    Looks like you haven't added any appointment yet.
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Appointment;
