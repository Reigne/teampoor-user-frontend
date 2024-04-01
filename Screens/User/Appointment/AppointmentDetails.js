import React, { useState } from "react";
import {
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { View, Modal } from "native-base";
// import UserOrderList from "./UserOrderList";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  CalendarDaysIcon,
  CheckIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  WrenchIcon,
  XMarkIcon,
  ReceiptRefundIcon,
  HandThumbUpIcon,
} from "react-native-heroicons/solid";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBox } from "@fortawesome/free-solid-svg-icons/faBox";
import mime from "mime";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
const AppointmentDetails = (props) => {
  const navigation = useNavigation();
  const item = props.route.params;

  const [showMore, setShowMore] = useState(false);
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const [status, setStatus] = useState(
    item.appointmentStatus && item.appointmentStatus.length > 0
      ? item.appointmentStatus[item.appointmentStatus.length - 1].status
      : ""
  );

  // console.log("Appointment", item);

  const pickProofImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
      // selectionLimit: 2,
    });
    if (!result.canceled) {
      console.log(result.assets);
      setImage(result.assets[0].uri);
    }

    // console.log(imgMotorcycle);
  };

  const validateForm = () => {
    let errors = {};

    if (image.length === 0)
      errors.image = "You need to upload the inspection report";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const updateHandler = () => {
    if (!validateForm()) {
      // setLoading(false);
      return;
    }

    let formData = new FormData();

    formData.append("status", "DONE");

    if (image) {
      const newImageUri = "file:///" + image.split("file:/").join("");

      formData.append("image", {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split("/").pop(),
      });
    }

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      axios
        .put(
          `${baseURL}appointments/customer-update/${item._id}`,
          formData,
          config
        )
        .then((res) => {
          // Update the status state variable with the newly updated status
          // setStatus(res.data.appointmentStatus?.pop()?.status);
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Uploaded Succesfully!",
            text2: `Motorcycle Inspection Report`,
          });
        });
    } catch (error) {
      console.error(error);
      // Handle errors, show an error toast, etc.
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    }
  };

  console.log(item, "item.appointmentStatus");

  return (
    <KeyboardAwareScrollView className="flex-1 bg-white px-3 space-y-3">
      <View>
        <Text className="text-lg font-bold">Appointment Details</Text>
        <Text className="text-xs font-light">
          Appointment information below.
        </Text>
      </View>

      {/* <Text className="text-base font-semibold">Appointment</Text> */}

      <View className="bg-zinc-100 p-2 rounded-xl space-y-1">
        <View className="flex flex-row justify-between items-center">
          <Text>Service Type:</Text>

          <View
            className={
              item.serviceType === "Home Service"
                ? "bg-green-200 px-2 rounded"
                : "bg-blue-200 px-2 rounded"
            }
          >
            <Text
              className={
                item.serviceType === "Home Service"
                  ? "text-xs text-green-900 font-bold"
                  : "text-xs text-blue-500 font-bold"
              }
            >
              {item.serviceType}
            </Text>
          </View>
        </View>
        <View className="flex flex-row justify-between items-center">
          <Text>Date:</Text>
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

      <View className="space-y-1">
        <View className="bg-zinc-100 p-2 space-y-3 rounded-xl">
          <View>
            <Text className="text-base font-semibold">Track Status</Text>
            <Text className="text-xs">Appointment status history.</Text>
          </View>

          <View className="border-b border-zinc-200" />

          <View
            className={showMore === false ? "overflow-hidden max-h-72" : ""}
          >
            {item.appointmentStatus
              .slice()
              .reverse()
              .map((status, index) => (
                <View key={index} className="flex flex-row space-x-3 px-2">
                  {/* <View className="border-r-2 border-red-500"></View> */}

                  <View className="w-[60] items-center">
                    <Text>
                      {status.timestamp
                        ? new Date(status.timestamp).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          ) +
                          "\n" +
                          new Date(status.timestamp).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: false,
                            }
                          )
                        : ""}
                    </Text>
                  </View>

                  <View className="items-center w-[25]">
                    {status.status === "Pending" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <ClipboardDocumentCheckIcon color="white" size={18} />
                      </View>
                    ) : status.status === "PENDING" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <ClipboardDocumentCheckIcon color="white" size={18} />
                        {/* <ArchiveBoxArrowDownIcon color="white" size={18} /> */}
                      </View>
                    ) : status.status === "CONFIRMED" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <CheckIcon color="white" size={18} />
                      </View>
                    ) : status.status === "INPROGRESS" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <WrenchIcon color="white" size={18} />
                      </View>
                    ) : status.status === "COMPLETED" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <CheckIcon color="white" size={18} />
                      </View>
                    ) : status.status === "CANCELLED" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <XMarkIcon color="white" size={18} />
                      </View>
                    ) : status.status === "RESCHEDULED" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <CalendarDaysIcon color="white" size={18} />
                      </View>
                    ) : status.status === "DELAYED" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <ClockIcon color="white" size={18} />
                      </View>
                    ) : status.status === "NOSHOW" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <XMarkIcon color="white" size={18} />
                      </View>
                    ) : status.status === "BACKJOBPENDING" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <ReceiptRefundIcon color="white" size={18} />
                      </View>
                    ) : status.status === "BACKJOBCONFIRMED" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <CheckIcon color="white" size={18} />
                      </View>
                    ) : status.status === "BACKJOBCOMPLETED" ? (
                      <View className="bg-red-500 p-1 rounded-full">
                        <CheckIcon color="white" size={18} />
                      </View>
                    ) : (
                      <View className="bg-red-500 p-1 rounded-full"></View>
                    )}

                    <View
                      className="bg-red-500"
                      style={{ width: 3, height: 75 }}
                    ></View>
                  </View>

                  <View className="px-2 w-3/4">
                    {status.status === "Pending" ? (
                      <Text className="font-bold">Pending</Text>
                    ) : status.status === "PENDING" ? (
                      <Text className="font-bold">Pending</Text>
                    ) : status.status === "CONFIRMED" ? (
                      <Text className="font-bold">Confirmed</Text>
                    ) : status.status === "INPROGRESS" ? (
                      <Text className="font-bold">Service in Progress</Text>
                    ) : status.status === "COMPLETED" ? (
                      <Text className="font-bold">Service Completed</Text>
                    ) : status.status === "RESCHEDULED" ? (
                      <Text className="font-bold">Appointment Resheduled</Text>
                    ) : status.status === "DELAYED" ? (
                      <Text className="font-bold">Appointment Delayed</Text>
                    ) : status.status === "NOSHOW" ? (
                      <Text className="font-bold">Missed Appointment</Text>
                    ) : status.status === "CANCELLED" ? (
                      <Text className="font-bold">Appointment Cancelled</Text>
                    ) : status.status === "BACKJOBPENDING" ? (
                      <Text className="font-bold">Back Job Requested</Text>
                    ) : status.status === "BACKJOBCONFIRMED" ? (
                      <Text className="font-bold">Back Job Confirmed</Text>
                    ) : status.status === "BACKJOBCOMPLETED" ? (
                      <Text className="font-bold">Back Job Completed</Text>
                    ) : (
                      ""
                    )}
                    <Text className="text-left text-wrap text-xs">
                      {status.message}
                    </Text>
                  </View>

                  {/* Add additional details as needed */}
                </View>
              ))}
          </View>
          <View className="flex justify-center items-center mt-3">
            {showMore === false ? (
              <View className="space-x-1 items-center ">
                <Text
                  className="text-zinc-700"
                  onPress={() => setShowMore(true)}
                >
                  Show More
                </Text>

                {/* <ChevronDownIcon
                color="black"
                size={14}
                onPress={() => setShowMore(true)}
              /> */}
              </View>
            ) : (
              <View className="space-x-1 items-center ">
                {/* <ChevronUpIcon
                color="black"
                size={14}
                onPress={() => setShowMore(false)}
              /> */}
                <Text
                  className="text-zinc-700"
                  onPress={() => setShowMore(false)}
                >
                  Show Less
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="space-y-1">
        <View className="bg-zinc-100 p-2 rounded-xl space-y-2">
          <View className="flex flex-row space-x-2">
            <Image
              className="rounded"
              style={{
                width: 64,
                height: 64,
              }}
              // source={{
              //   uri: item.user?.avatar?.url
              //     ? item.user?.avatar?.url
              //     : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
              // }}

              source={
                item.user?.avatar?.url
                  ? { uri: item.user?.avatar?.url }
                  : require("../../../assets/images/teampoor-default.png")
              }
              alt="images"
            />

            <View>
              <Text className="font-semibold text-base">{item.fullname}</Text>

              <View className="flex flex-row space-x-2">
                <Text className="text-xs text-zinc-700">Email:</Text>
                <Text className="text-xs">{item.user.email}</Text>
              </View>

              <View className="flex flex-row space-x-2">
                <Text className="text-xs text-zinc-700">Contact:</Text>
                <Text className="text-xs">{item.phone}</Text>
              </View>
            </View>
          </View>

          {item.serviceType === "Home Service" && (
            <View>
              <Text className="text-xs font-semibold">Home Address:</Text>
              <Text className="text-xs">
                {item.region}, {item.province}, {item.city}, {item.barangay},
                {item.postalcode}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="space-y-1">
        <View className="bg-zinc-100 p-2 rounded-xl space-y-2">
          <View>
            <Text className="font-semibold">Motorcycle</Text>

            <Text className="text-xs text-zinc-700">
              Your motorcycle information.
            </Text>
          </View>

          <View className="border-b border-zinc-200" />

          <View className="flex flex-row space-x-2 justify-between items-center">
            <Text className="">Brand:</Text>
            <Text className="font-semibold">{item.brand}</Text>
          </View>

          {/* <View className="flex flex-row space-x-2 justify-between items-center">
            <Text className="">Model:</Text>
            <Text className="font-semibold">{item.model}</Text>
          </View> */}

          <View className="flex flex-row space-x-2 justify-between items-center">
            <Text className="">Year Model:</Text>
            <Text className="font-semibold">{item.year}</Text>
          </View>

          <View className="flex flex-row space-x-2 justify-between items-center">
            <Text className="">Plate Number:</Text>
            <Text className="font-semibold">{item.plateNumber}</Text>
          </View>

          <View className="flex flex-row space-x-2 justify-between items-center">
            <Text className="">Engine Number:</Text>
            <Text className="font-semibold">{item.engineNumber}</Text>
          </View>

          <View className="flex flex-row space-x-2 justify-between items-center">
            <Text className="">Type of Fuel:</Text>
            <Text className="font-semibold">{item.fuel}</Text>
          </View>
          <View className="flex flex-row space-x-2 justify-between items-center">
            <Text className="">Vehicle Category:</Text>
            <Text className="font-semibold">{item.type}</Text>
          </View>
        </View>
      </View>

      <View className="space-y-1">
        <View className="bg-zinc-100 p-2 rounded-xl space-y-2">
          <View>
            <Text className="font-semibold">Service's</Text>
            <Text className="text-xs">
              Services that you have chosen for your motorcycle.
            </Text>
          </View>

          <View className="border-b border-zinc-200" />

          {item.appointmentService.map((service, index) => (
            <View className="bg-zinc-100 p-2 rounded flex flex-row space-x-2 items-center">
              <Image
                className="rounded"
                style={{
                  width: 44,
                  height: 44,
                }}
                // source={{
                //   uri: service.service.images[0]?.url
                //     ? service.service.images[0]?.url
                //     : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
                // }}
                source={
                  service.service.images[0]?.url
                    ? { uri: service.service.images[0]?.url }
                    : require("../../../assets/images/teampoor-default.png")
                }
                alt="images"
              />

              <View className="flex-1 flex-row justify-between items-center">
                <View className="w-1/2 text-start">
                  <Text className="text-xs font-semibold">
                    {service.service.name}
                  </Text>

                  <Text
                    className="text-xs text-zinc-700"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {service.service.description}
                  </Text>
                </View>

                <Text className="text-xs">
                  ₱
                  {service.service.price?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
            </View>
          ))}

          <View className="border-b border-zinc-200" />

          <View className="flex flex-row space-x-1 items-center justify-end">
            <Text className="text-xs">Total Price:</Text>
            <Text className="text-red-500 font-semibold">
              ₱
              {item.totalPrice?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>
      </View>

      {item?.parts[0] && (
        <View className="bg-zinc-100 p-3 rounded-xl space-y-2">
          <View>
            <Text className="font-semibold">Additional Parts</Text>
            <Text className="text-xs">
              Parts that have been installed or modified on your motorcycle.
            </Text>
          </View>
          <View className="border-b border-zinc-200" />

          <View className="space-y-1">
            <View>
              <View className="flex flex-row justify-around items-center">
                <Text className="w-1/3 font-semibold">Product</Text>
                <Text className="w-1/3 text-center font-semibold">
                  Quantity
                </Text>
                <View className="w-1/3 items-end">
                  <Text className="font-semibold">Price</Text>
                </View>
              </View>
            </View>

            <View className="space-y-1">
              {item.parts.map((part, index) => (
                <View className="bg-zinc-200 p-2 rounded-lg">
                  <View className="flex flex-row justify-between items-center">
                    <Text className="w-1/3">{part.productName}</Text>
                    <Text className="w-1/3 text-center">{part.quantity}</Text>

                    <View className="w-1/3 items-end">
                      <Text>{part.price}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="flex flex-row justify-end items-center space-x-1">
            <Text className="text">Total Price:</Text>
            <Text className="text-red-500 font-semibold">
              {item?.totalPartPrice}
            </Text>
          </View>
        </View>
      )}

      {item?.customerProof?.url && (
        <View className="bg-zinc-100 rounded-xl p-3 space-y-3">
          <View>
            <Text className="font-semibold text-base">Inspection Report</Text>
          </View>

          <TouchableOpacity
            className="bg-blue-400 p-3 rounded-lg grow"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white font-semibold text-center text-xs">
              View Image
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="bg-zinc-100 rounded-xl p-3 space-y-3">
        <View>
          <Text className="font-semibold text-base">Inspection Report</Text>
          <Text className="text-xs">
            Upload if you have motorcycle inspection report.
          </Text>
        </View>

        <View>
          {image.length > 0 && (
            <View>
              <Image
                source={
                  image
                    ? { uri: image }
                    : require("../../../assets/images/teampoor-default.png")
                }
                style={{ width: 100, height: 100 }}
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        <View className="">
          <TouchableOpacity
            className={
              errors.image
                ? "p-8 border border-red-500 rounded-2xl justify-center items-center space-y-3"
                : "p-8 border-2 border-gray-100 rounded-2xl justify-center items-center space-y-3"
            }
            onPress={pickProofImage}
          >
            <ArrowDownTrayIcon color="#374151" size={24} />
            <Text className="text-gray-700">Browse image to upload</Text>
          </TouchableOpacity>
          <View>
            {errors.image ? (
              <Text className="text-sm text-red-500">{errors.image}</Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity className="" onPress={() => updateHandler()}>
          <View className="bg-blue-400 p-3 rounded-lg">
            <Text className="text-white font-semibold text-center">Upload</Text>
          </View>
        </TouchableOpacity>
      </View>

      {status === "COMPLETED" && (
        <View className="bg-zinc-100 p-3 rounded-xl space-y-2">
          <View>
            <Text className="text-red-500 text-xs font-semibold">Notes</Text>
            <Text className="text-xs text-zinc-800">
              Back Job will not be avaiable after 14 days of services.
            </Text>
          </View>
          <View className="justify-end">
            <TouchableOpacity
              className="border border-red-500 p-3 rounded-lg"
              onPress={() => navigation.navigate("RequestBackJob", item)}
            >
              <Text className="text-red-500 text-center">Request Back Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        isOpen={modalVisible}
        transparent={true}
        onClose={() => setModalVisible(false)}
        backgroundColor="rgba(0, 0, 0, 0.5)"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <Image
              style={{ width: wp("100%"), height: hp("100%") }}
              source={{
                uri: item?.customerProof?.url
                  ? item?.customerProof?.url
                  : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
              }}
              alt="images"
              resizeMode="contain"
            />
          </TouchableWithoutFeedback>
        </View>
      </Modal>

      <View className="mb-6" />
    </KeyboardAwareScrollView>
  );
};

export default AppointmentDetails;
