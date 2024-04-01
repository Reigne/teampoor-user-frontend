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
import { CalendarDaysIcon } from "react-native-heroicons/solid";

const RequestBackJob = (props) => {
  const navigation = useNavigation();
  const item = props.route.params;

  const [comment, setComment] = useState("");

  const backjobHandler = () => {
    axios
      .put(`${baseURL}appointments/backjob/${item._id}`, {
        comment,
      })
      .then((res) => {
        Toast.show({
          type: "success",
          text1: "Back job submitted successfully",
          text2: "Please wait for the confirmation",
        });

        navigation.goBack();
      });
  };

  return (
    <View className="flex-1 p-3 justify-center space-y-3">
      <View className="space-y-3 bg-white rounded-xl p-3">
        <View>
          <Text className="text-lg font-bold">Request Back Job</Text>
          <Text className="text-xs">Fill up the details below.</Text>
        </View>

        {/* <View className="border-b border-zinc-200" />

        <View className="space-y-1">
          <Text className="text-xs text-red-500 font-semibold ">Notes</Text>
          <Text className="text-xs">
            After submitting the request for a back job, please note that it may
            take 1-2 days for us to assess the situation. Once evaluated, we
            will provide you with the date for the back job.
          </Text>
        </View> */}

        <View className="border-b border-zinc-200" />

        <View className="space-y-1">
          <View className="flex flex-row space-x-1 items-center">
            <Text className="font-semibold">Comment</Text>
            <Text className="text-xs">(Reason for back job)</Text>
          </View>
          <TextInput
            textAlignVertical="top"
            multiline={true}
            numberOfLines={6}
            className="p-2 bg-zinc-100 rounded-lg"
            placeholder="Insert comment here..."
            value={comment}
            onChangeText={(text) => setComment(text)}
          />
        </View>

        <View className="border-b border-zinc-200" />

        <View className="space-y-1">
          <Text className="text-xs text-red-500 font-semibold ">Notes</Text>
          <Text className="text-xs">
            After submitting the request for a back job, please note that it may
            take up to 24 hours for us to assess the situation. Once evaluated,
            we will provide you with the date for the back job
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className="bg-red-500 p-3 rounded-xl justify-center items-center"
        onPress={() => backjobHandler()}
      >
        <Text className="text-white font-semibold">Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border p-3 rounded-xl"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-center">Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RequestBackJob;
