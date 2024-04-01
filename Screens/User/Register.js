import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import Login from "./Login";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Formik } from "formik";
import * as Yup from "yup";

const Register = (props) => {
  const navigation = useNavigation();

  const phoneRegExp = /^9\d{9}$/;

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    phone: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values) => {
    let user = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      phone: "+63" + values.phone, // Prepend the phone number with "+63"
      email: values.email,
      password: values.password,
    };

    axios
      .post(`${baseURL}users/register`, user)
      .then((res) => {
        if (res.status === 200) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Registration Succeeded",
            text2: "Please Login into your account",
          });
          setTimeout(() => {
            navigation.navigate("Login");
          }, 500);
        }
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage = error.response.data;

          if (errorMessage === "Phone number already exists") {
            Toast.show({
              topOffset: 60,
              type: "error",
              text1: "Mobile number already exists",
              text2: "Please use a different mobile number",
            });
          } else if (errorMessage === "Email already exists") {
            Toast.show({
              topOffset: 60,
              type: "error",
              text1: "Email already exists",
              text2: "Please use a different email address",
            });
          } else {
            Toast.show({
              topOffset: 60,
              type: "error",
              text1: "Something went wrong",
              text2: "Please try again",
            });
          }
        } else {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Network Error",
            text2: "Please check your internet connection and try again",
          });
        }
      });
  };

  return (
    <KeyboardAwareScrollView className="bg-white">
      <SafeAreaView className="flex-1  bg-red-500">
        <Formik
          initialValues={{
            email: "",
            password: "",
            firstname: "",
            lastname: "",
            phone: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View>
              <SafeAreaView className="flex-row justify-center mb-5">
                <View className="flex-row justify-between items-center w-full absolute">
                  <TouchableOpacity
                    className="flex-row items-center rounded ml-4 mt-4"
                    onPress={() => navigation.goBack()}
                  >
                    <ChevronLeftIcon size={28} color="white" />
                    <Text className="text-white">Back</Text>
                  </TouchableOpacity>
                </View>

                <Image
                  source={require("../../assets/images/motorcycle2.png")}
                  style={{ width: 325, height: 235 }}
                  resizeMode="contain"
                />
              </SafeAreaView>

              <View
                className="flex-1 bg-white px-8 pt-8 "
                style={{
                  borderTopLeftRadius: 50,
                  borderTopRightRadius: 50,
                  // height: hp("80%")
                }}
              >
                <View className="form space-y-2">
                  <Text className="font-black text-2xl text-red-500 mb-2">
                    Register
                  </Text>
                  <View className="">
                    <Text className="mb-2">First Name *</Text>
                    <TextInput
                      className={
                        errors.firstname
                          ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                          : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                      }
                      // className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 w-44"
                      placeholder="e.g Carl"
                      name={"firstname"}
                      id={"firstname"}
                      value={values.firstname}
                      onChangeText={handleChange("firstname")}
                    ></TextInput>
                    <View className="">
                      {touched.firstname && errors.firstname && (
                        <Text className="text-red-500">{errors.firstname}</Text>
                      )}
                    </View>
                  </View>
                  <View className="">
                    <Text className="mb-2">Last Name *</Text>
                    <TextInput
                      className={
                        errors.lastname
                          ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                          : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                      }
                      // className="p-4  bg-gray-100 text-gray-700 rounded-2xl mb-1 w-44"
                      placeholder="e.g Juan"
                      name={"lastname"}
                      id={"lastname"}
                      value={values.lastname}
                      onChangeText={handleChange("lastname")}
                    ></TextInput>

                    <View className="">
                      {touched.lastname && errors.lastname && (
                        <Text className="text-red-500">{errors.lastname}</Text>
                      )}
                    </View>
                  </View>

                  {/* <View className="">
                    <Text className="mb-2">Mobile Number *</Text>
                    <TextInput
                      className={
                        errors.phone
                          ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                          : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                      }
                      // className="p-4  bg-gray-100 text-gray-700 rounded-2xl mb-1 w-44"
                      placeholder="e.g 09219201772"
                      name={"phone"}
                      id={"phone"}
                      value={values.phone}
                      onChangeText={handleChange("phone")}
                      keyboardType={"phone-pad"}
                      maxLength={11}
                    ></TextInput>

                    <View className="">
                      {touched.phone && errors.phone && (
                        <Text className="text-red-500">{errors.phone}</Text>
                      )}
                    </View>
                  </View> */}

                  <View className="">
                    <Text className="mb-2">Mobile Number *</Text>

                    <View
                      className={
                        errors.phone
                          ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                          : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                      }
                    >
                      <View className="flex-row items-center">
                        <Text>+63 </Text>
                        <TextInput
                          placeholder="e.g 9219201772"
                          name={"phone"}
                          id={"phone"}
                          value={values.phone}
                          onChangeText={handleChange("phone")}
                          keyboardType={"phone-pad"}
                          maxLength={10}
                        ></TextInput>
                      </View>
                    </View>

                    <View className="">
                      {touched.phone && errors.phone && (
                        <Text className="text-red-500">{errors.phone}</Text>
                      )}
                    </View>
                  </View>

                  <Text>Email *</Text>
                  <TextInput
                    className={
                      errors.email
                        ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl"
                        : "p-4 bg-gray-100 text-gray-700 rounded-2xl "
                    }
                    placeholder="e.g Motorcycle@email.com"
                    name={"email"}
                    id={"email"}
                    value={values.email}
                    onChangeText={(text) =>
                      handleChange("email")(text.toLowerCase())
                    }
                  />

                  <View className="">
                    {touched.email && errors.email && (
                      <Text className="text-red-500">{errors.email}</Text>
                    )}
                  </View>

                  <Text>Password *</Text>
                  <TextInput
                    secureTextEntry={true}
                    className={
                      errors.password
                        ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl"
                        : "p-4 bg-gray-100 text-gray-700 rounded-2xl"
                    }
                    placeholder="Enter password"
                    name={"password"}
                    id={"password"}
                    value={values.password}
                    onChangeText={handleChange("password")}
                  ></TextInput>

                  {touched.password && errors.password && (
                    <View className="mb-3">
                      <Text className="text-red-500 mb-3">
                        {errors.password}
                      </Text>
                    </View>
                  )}

                  <View className="mt-5">
                    <TouchableOpacity
                      className="bg-red-500 py-4 rounded-2xl mt-5"
                      onPress={() => handleSubmit()}
                    >
                      <Text className="font-xl font-bold text-center text-white">
                        Sign Up
                      </Text>
                    </TouchableOpacity>

                    <View className="flex flex-row text-center justify-center mb-5">
                      <Text className="mt-2 text-gray-400">
                        Already have account?
                      </Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                      >
                        <Text className="mt-2 text-blue-400"> Sign In</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </Formik>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default Register;
