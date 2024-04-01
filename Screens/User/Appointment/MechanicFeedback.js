import React, { useState } from "react";
import { Text, Image, TextInput, TouchableOpacity } from "react-native";
import { View } from "native-base";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { AirbnbRating } from "react-native-ratings";
import { useNavigation } from "@react-navigation/native";

const MechanicFeedback = (props) => {
  const item = props.route.params;
  const navigation = useNavigation();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const feedbackHandler = () => {
    console.log(item._id);
    const user = item.user;
    const username = item.user.firstname + " " + item.user.lastname;
    axios
      .put(`${baseURL}appointments/feedback/${item._id}`, {
        username,
        comment,
        rating,
        user,
      })
      .then((res) => {
        Toast.show({
          type: "success",
          text1: "Thank you for your feedback!",
          text2: "Feedback has been created",
        });

        navigation.goBack();
      });
  };

  return (
    <View className="flex-1 bg-white px-3 space-y-2 justify-center">
      {/* <View>
        <Text className="text-xl font-bold">Mechanic Feedback</Text>
      </View> */}

      {/* <View className="space-y-1">
        <View className="bg-zinc-100 p-2 rounded-xl space-y-2">
          <View className="flex flex-row space-x-2">
            <Image
              className="rounded"
              style={{
                width: 64,
                height: 64,
              }}
              //   source={{
              //     uri: item.mechanic.avatar.url
              //       ? item.mechanic.avatar.url
              //       : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
              //   }}
              source={
                item.mechanic?.avatar?.url
                  ? { uri: item.mechanic?.avatar?.url }
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
      </View> */}

      <View className="bg-zinc-100 p-3 rounded-xl space-y-3">
        <View>
          <Text className="text-xl font-extrabold text-center">
            Mechanic Feedback
          </Text>
        </View>

        <View className="border-b border-zinc-200" />

        <View className="flex justify-center items-center space-y-2">
          <Image
            className="rounded-full"
            style={{
              width: 164,
              height: 164,
            }}
            source={
              item.mechanic?.avatar?.url
                ? { uri: item.mechanic?.avatar?.url }
                : require("../../../assets/images/teampoor-default.png")
            }
            alt="images"
          />

          <View>
            <Text className="font-bold text-xl">
              {item.mechanic?.firstname} {item.mechanic?.lastname}
            </Text>
          </View>
        </View>

        <AirbnbRating
          count={5}
          reviews={["Bad", "Not Bad", "Good", "Very Good", "Amazing"]}
          defaultRating={5}
          size={34}
          onFinishRating={(value) => setRating(value)}
        />

        <View className="space-y-1">
          <Text>Comment</Text>
          <TextInput
            textAlignVertical="top"
            multiline={true}
            numberOfLines={5}
            className="p-2 bg-zinc-200 rounded-lg"
            placeholder="Insert comment here..."
            value={comment}
            onChangeText={(text) => setComment(text)}
          />
        </View>
      </View>

      <TouchableOpacity
        className="bg-red-500 p-3 rounded-xl"
        onPress={() => feedbackHandler()}
      >
        <Text className="text-center text-white font-semibold">
          Submit Feedback
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border border-zinc-400 p-3 rounded-xl"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-center text-zinc-500">Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MechanicFeedback;
