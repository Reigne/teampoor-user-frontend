import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import { Formik } from "formik";
import * as Yup from "yup";
import { Checkbox, Modal } from "native-base";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    setIsLoading(true);

    let user = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      phone: "+63" + values.phone,
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
            setIsLoading(false);
            navigation.navigate("Login");
          }, 500);
        }
      })
      .catch((error) => {
        setIsLoading(false);
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

                  <View className="space-y-1">
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
                  </View>

                  <View className="space-y-1">
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
                  </View>

                  <View className="mt-5">
                    <View className="flex flex-row space-x-2 items-center">
                      <Checkbox
                        colorScheme="info"
                        isChecked={isCheck}
                        onPress={() => setIsCheck(!isCheck)}
                      />

                      <View className="flex flex-row space-x-1 items-center">
                        <Text>By signup you agree to the</Text>
                        <TouchableOpacity onPress={() => setShowModal(true)}>
                          <Text className="text-blue-500">
                            terms and conditions *
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity
                      className={
                        isLoading
                          ? "bg-zinc-500 py-4 rounded-2xl mt-5"
                          : isCheck === false
                          ? "bg-zinc-500 py-4 rounded-2xl mt-5"
                          : "bg-red-500 py-4 rounded-2xl mt-5"
                      }
                      onPress={() => handleSubmit()}
                      disabled={isLoading === true || isCheck === false}
                    >
                      <View className="flex flex-row space-x-2 items-center justify-center">
                        <Text className="font-xl font-bold text-center text-white">
                          {isLoading ? "Loading..." : "Sign Up"}
                        </Text>

                        {isLoading && (
                          <ActivityIndicator size="small" color="white" />
                        )}
                      </View>
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

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="500px">
            <Modal.CloseButton />
            <Modal.Body>
              <View className="space-y-4">
                <View className="flex-1">
                  <View className="flex-1 space-y-2">
                    <View>
                      <Text className="text-xl font-bold">
                        Terms and Conditions
                      </Text>
                    </View>

                    <View className="flex-1 space-y-1">
                      <Text className="font-semibold">1. Introduction</Text>

                      <Text>
                        These Terms and Conditions govern the use of the
                        products and services provided by TEAM POOR: System for
                        Managing Motorcycle Parts and Services on our website
                        and mobile application. By accessing or using the
                        Platform, you agree to be bound by these Terms and
                        Conditions in full. If you disagree with these Terms and
                        Conditions or any part of these terms, you must not use
                        the Platform.
                      </Text>
                    </View>

                    <View className="flex-1 space-y-1">
                      <Text className="font-semibold">
                        2. Products and Services
                      </Text>

                      <Text>
                        2.1. TEAM POOR: System for Managing Motorcycle Parts and
                        Services provides motorcycle products and services
                        including but not limited to sales of motorcycles,
                        parts, accessories, maintenance, repair services, and
                        related products.
                      </Text>
                      <Text>
                        2.2. The availability of products and services may vary
                        depending on location and other factors. The Company
                        reserves the right to modify, suspend, or discontinue
                        any aspect of the products or services at any time
                        without prior notice.
                      </Text>
                    </View>

                    <View className="flex-1 space-y-1">
                      <Text className="font-semibold">
                        3. Orders and Payments
                      </Text>

                      <Text>
                        3.1. By placing an order through the Platform, you agree
                        to provide accurate and complete information about
                        yourself and your payment method. You also authorize the
                        TEAM POOR to charge the specified payment method for the
                        total amount of the order, including any applicable
                        taxes and shipping fees.
                      </Text>
                      <Text>
                        3.2. TEAM POOR: System for Managing Motorcycle Parts and
                        Services reserves the right to refuse or cancel any
                        order for any reason, including but not limited to
                        product availability, errors in pricing or product
                        information, or suspicion of fraudulent activity.
                      </Text>
                      <Text>
                        3.3. All prices displayed on the Platform are in the
                        local currency and are subject to change without notice.
                        The TEAM POOR is not responsible for any discrepancies
                        in pricing or product information provided by
                        third-party vendors.
                      </Text>
                    </View>

                    <View className="flex-1 space-y-1">
                      <Text className="font-semibold">4. Product Warranty</Text>

                      <Text>
                        4.1. The TEAM POOR: System for Managing Motorcycle Parts
                        and Services warrants that all products sold through the
                        Platform are free from defects in materials and
                        workmanship under normal use for a period of 7 days from
                        the date of purchase, unless otherwise specified.
                      </Text>
                      <Text>
                        4.2. During the Warranty Period, if the Product fails to
                        conform to the above warranty, Customer may submit a
                        warranty claim to TEAM POOR. Customer must provide proof
                        of purchase and a description of the defect.
                      </Text>
                      <Text>
                        4.3. If the TEAM POOR determines that the Product is
                        defective within the Warranty Period, TEAM POOR shall,
                        at its option, repair or replace the defective Product,
                        or refund the purchase price.
                      </Text>
                      <Text>
                        4.5. TEAM POOR'S liability under this warranty shall be
                        limited to the repair, replacement, or refund of the
                        purchase price of the defective Product. In no event
                        shall Manufacturer be liable for any incidental,
                        consequential, or punitive damages.
                      </Text>
                    </View>

                    <View className="flex-1 space-y-1">
                      <Text className="font-semibold">
                        5. Limitation of Liability
                      </Text>

                      <Text>
                        5.1. In no event shall the TEAM POOR: System for
                        Managing Motorcycle Parts and Services be liable for any
                        indirect, incidental, special, consequential, or
                        punitive damages, including but not limited to loss of
                        profits, data, or goodwill, arising out of or in
                        connection with the use of or inability to use the
                        Platform or any products or services obtained through
                        the Platform.
                      </Text>
                      <Text>
                        5.2. The total liability of the TEAM POOR for any claim
                        arising out of or relating to these Terms and Conditions
                        or the use of the Platform shall not exceed the total
                        amount paid by you to the Company for the products or
                        services giving rise to the claim.
                      </Text>
                    </View>

                    <View className="flex-1 space-y-1">
                      <Text className="font-semibold">
                        6. Changes to Terms and Conditions
                      </Text>

                      <Text>
                        6.1. The TEAM POOR: System for Managing Motorcycle Parts
                        and Services reserves the right to modify or replace
                        these Terms and Conditions at any time without prior
                        notice. Your continued use of the Platform after any
                        such changes constitutes your acceptance of the new
                        Terms and Conditions.
                      </Text>
                    </View>

                    <View className="flex-1 space-y-1">
                      <Text>
                        By engaging in TEAM POOR: System for Managing Motorcycle
                        Parts and Services reserves, you acknowledge that you
                        have read, understood, and agreed to abide by these
                        terms and conditions. If you have any questions or
                        concerns, please contact us before clicking the 'Agree'
                        button to proceed. If you do not agree with the terms
                        and conditions, please click the 'Disagree' button. Your
                        continued use or acceptance of the agreement implies
                        your understanding and acceptance of the terms and
                        conditions.
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex-1 flex-row">
                  <View className="flex-1 flex-row justify-center items-center space-x-2">
                    <TouchableOpacity
                      className="border border-zinc-500 p-2 rounded grow items-center"
                      onPress={() => {
                        [setShowModal(false)];
                      }}
                    >
                      <Text className="">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-green-500 p-2 rounded grow items-center"
                      onPress={() => {
                        [setShowModal(false), setIsCheck(true)];
                      }}
                    >
                      <Text className="text-white">Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default Register;
