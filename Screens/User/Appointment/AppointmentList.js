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
import {
  CalendarDaysIcon,
  ExclamationCircleIcon,
} from "react-native-heroicons/solid";
import { Modal, Button } from "native-base";

const AppointmentList = ({ item, cancelHandler }) => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(
    item.appointmentStatus && item.appointmentStatus.length > 0
      ? item.appointmentStatus[item.appointmentStatus.length - 1].status
      : ""
  );

  //   console.log("appointment", item);
  return (
    <TouchableOpacity
      className="bg-zinc-100 p-3 rounded-xl space-y-3"
      onPress={() => navigation.navigate("AppointmentDetails", item)}
    >
      <View className="flex flex-row justify-between items-center">
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="500px">
            <Modal.CloseButton />
            <Modal.Body>
              <View className="space-y-4">
                <View className="flex-1">
                  <View className="justify-center items-center flex-1 space-y-2">
                    <ExclamationCircleIcon color="#ef4444" size={58} />

                    <View className="justify-center items-center flex-1 ">
                      <Text className="text-lg font-bold">
                        Cancel Appointment
                      </Text>
                      <Text className="text-zinc-600">
                        Are you sure you want to
                      </Text>
                      <Text className="text-zinc-600">the appointment?</Text>
                    </View>

                    <Text className="text-zinc-600 text-xs">
                      This action cannot be undone.
                    </Text>
                  </View>
                </View>
                <View className="flex-1 flex-row">
                  <View className="flex-1 flex-row justify-center items-center space-x-2">
                    <TouchableOpacity
                      className="bg-zinc-200 p-3 rounded grow items-center"
                      onPress={() => {
                        setShowModal(false);
                      }}
                    >
                      <Text>No</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="bg-red-500 p-3 rounded grow items-center"
                      onPress={() => {
                        [cancelHandler(item._id), setShowModal(false)];
                      }}
                    >
                      <Text className="text-white">Yes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Text className="font-bold">{item?.serviceType}</Text>

        <View
          className={
            status === "PENDING"
              ? "bg-yellow-200 px-2 rounded"
              : status === "Pending"
              ? "bg-yellow-200 px-2 rounded"
              : status === "CONFIRMED"
              ? "bg-green-200 px-2 rounded"
              : status === "INPROGRESS"
              ? "bg-blue-200 px-2 rounded"
              : status === "COMPLETED"
              ? "bg-green-200 px-2 rounded"
              : status === "CANCELLED"
              ? "bg-red-200 px-2 rounded"
              : status === "RESCHEDULED"
              ? "bg-purple-200 px-2 rounded"
              : status === "DELAYED"
              ? "bg-yellow-200 px-2 rounded"
              : status === "NOSHOW"
              ? "bg-red-200 px-2 rounded"
              : status === "BACKJOBPENDING"
              ? "bg-yellow-200 px-2 rounded"
              : status === "BACKJOBCONFIRMED"
              ? "bg-blue-200 px-2 rounded"
              : status === "BACKJOBCOMPLETED"
              ? "bg-green-200 px-2 rounded"
              : "bg-zinc-200 px-2 rounded"
          }
        >
          <Text
            className={
              status === "PENDING"
                ? "text-xs text-yellow-800"
                : status === "Pending"
                ? "text-xs text-yellow-800"
                : status === "CONFIRMED"
                ? "text-xs text-green-800"
                : status === "INPROGRESS"
                ? "text-xs text-blue-800"
                : status === "COMPLETED"
                ? "text-xs text-green-800"
                : status === "CANCELLED"
                ? "text-xs text-red-800"
                : status === "RESCHEDULED"
                ? "text-xs text-purple-800"
                : status === "DELAYED"
                ? "text-xs text-yellow-800"
                : status === "NOSHOW"
                ? "text-xs text-red-800"
                : status === "BACKJOBPENDING"
                ? "text-xs text-yellow-800"
                : status === "BACKJOBCONFIRMED"
                ? "text-xs text-blue-800"
                : status === "BACKJOBCOMPLETED"
                ? "text-xs text-green-800"
                : ""
            }
          >
            {status}
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

      <View className="flex flex-row justify-end space-x-2">
        {(status === "DONE" || status === "COMPLETED") && (
          <View className="flex flex-row justify-end">
            <TouchableOpacity
              className="bg-green-500 px-3 py-2 rounded-lg"
              onPress={() => navigation.navigate("MechanicFeedback", item)}
            >
              <Text className="text-white">Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* {status === "COMPLETED" && (
          <View className="flex flex-row justify-end">
            <TouchableOpacity
              className="border border-red-500 px-3 py-2 rounded-lg"
              // onPress={() => cancelHandler(item._id)}
            >
              <Text className="text-red-500 text-xs">Request Back Job</Text>
            </TouchableOpacity>
          </View>
        )} */}

        {status === "Pending" && (
          <View className="flex flex-row justify-end">
            <TouchableOpacity
              className="border border-red-500 px-3 py-2 rounded-lg"
              onPress={() =>
                // cancelHandler(item._id)
                setShowModal(true)
              }
            >
              <Text className="text-red-500 text-xs">Cancel Appointment</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AppointmentList;
