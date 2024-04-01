import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { ChevronLeftIcon, ShieldCheckIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";

const ChangePassword = (props) => {
  //   console.log(props.route.params.user)
  const navigation = useNavigation();

  const [user, setUser] = useState(props.route.params.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};

    if (!currentPassword)
      errors.currentPassword = "Current password is required";

    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (
      newPassword.length < 8 ||
      !/\d/.test(newPassword) ||
      !/[a-zA-Z]/.test(newPassword)
    ) {
      errors.newPassword =
        "Password should be at least 8 characters and include both letters and numbers";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (newPassword != confirmPassword) {
      errors.newPassword = "New Password doesn't match";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = () => {
    // Add logic to send a request to the backend to change the password
    const id = user.id;

    if (!validateForm()) {
      return;
    }

    // if (!currentPassword || !newPassword || !confirmPassword) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Please fill in all password fields",
    //     text2: "",
    //   });
    //   return;
    // }

    axios
      .put(`${baseURL}users/change-password/${id}`, {
        currentPassword,
        newPassword,
      })
      .then((res) => {
        console.log(res.data);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Password has been successfully changed",
        });

        navigation.navigate("UserProfile");
      })
      .catch((error) => {
        console.error(error);

        if (error.response && error.response.status === 400) {
          Toast.show({
            type: "error",
            text1: "Current Password is incorrect",
            text2: "Please enter the correct current password.",
          });
        } else {
          Toast.show({
            type: "error",
            text1: error,
            text2: "",
          });
        }
      });
  };

  return (
    <KeyboardAwareScrollView className="bg-red-500">
      <SafeAreaView className="flex-1">
        <View className="mt-5">
          <View className="flex-row justify-between items-center w-full absolute">
            <TouchableOpacity
              className="rounded ml-4 mt-4"
              onPress={() => navigation.goBack()}
            >
              <View className="flex-row items-center bg-red-500 rounded-full">
                <ChevronLeftIcon size={28} color="white" />
                <Text className="text-white">Back</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 justify-center items-center">
          <View className="mb-5">
            <ShieldCheckIcon size={180} color="white" />
          </View>
          <View className="flex flex-1 bg-white p-5 rounded-lg w-96">
            <Text className="text-2xl font-extrabold text-center mb-8">
              Change Password
            </Text>

            <View className="flex-1 justify-center">
              <Text className="mb-2">Current Password</Text>
              <TextInput
                className={
                  errors.currentPassword
                    ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                    : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                }
                placeholder="Enter current password"
                value={currentPassword}
                onChangeText={(text) => setCurrentPassword(text)}
                secureTextEntry={!showPassword}
              />

              {errors.currentPassword ? (
                <Text className="text-sm text-red-500 mb-3">
                  {errors.currentPassword}
                </Text>
              ) : null}

              <Text className="mb-2">New Password</Text>
              <TextInput
                className={
                  errors.newPassword
                    ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                    : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                }
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
                secureTextEntry
              />

              {errors.newPassword ? (
                <Text className="text-sm text-red-500 mb-3">
                  {errors.newPassword}
                </Text>
              ) : null}

              <Text className="mb-2">Confirm Password</Text>
              <TextInput
                className={
                  errors.confirmPassword
                    ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                    : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                }
                placeholder="Enter confirm password"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                secureTextEntry
              />

              {errors.confirmPassword ? (
                <Text className="text-sm text-red-500 mb-3">
                  {errors.confirmPassword}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="mt-3 w-full p-4">
            <TouchableOpacity
              className="bg-white py-4 rounded-2xl"
              onPress={() => handleChangePassword()}
            >
              <Text className="font-xl font-bold text-center">
                Change Password
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border border-white py-4 rounded-2xl mt-5"
              onPress={() => navigation.goBack()}
            >
              <Text className="font-xl font-bold text-center text-white">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default ChangePassword;
