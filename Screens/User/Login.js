import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Register from "./Register";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HelperText } from "react-native-paper";
import { loginUser } from "../../Context/Actions/Auth.actions";
import Error from "../../Shared/Error";
import Toast from "react-native-toast-message";
import { Formik } from "formik";
import * as Yup from "yup";

const Login = (props) => {
  const navigation = useNavigation();

  const context = useContext(AuthGlobal);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values) => {
    const user = {
      email: values.email.toLowerCase(),
      password: values.password,
    };

    console.log(user, "user log")

    if (user.email === "" || user.password === "") {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Warning!",
        text2: "Please fill in your credentials",
      });
      // setError("Please fill in your credentials");
    } else {
      loginUser(user, context.dispatch);

      // Toast.show({
      //   topOffset: 60,
      //   type: "success",
      //   text1: "Successfully Login",
      //   text2: "You can now explore our shop!",
      // });

      // console.log(user, context.dispatch);
      // console.log("error");
    }
  };

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      navigation.navigate("UserProfile");
    }
  }, [context.stateUser.isAuthenticated]);

  // AsyncStorage.getAllKeys((err, keys) => {
  //   AsyncStorage.multiGet(keys, (error, stores) => {
  //     stores.map((result, i, store) => {
  //       console.log({ [store[i][0]]: store[i][1] });
  //       return true;
  //     });
  //   });
  // });

  return (
    <KeyboardAwareScrollView className="bg-white">
      <Formik
        initialValues={{ email: "", password: "" }}
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
          <View className="flex-1 justify-start bg-red-500">
            <SafeAreaView className="flex-row justify-center mb-5">
              <Image
                source={require("../../assets/images/motorcycle2.png")}
                style={{ width: 300, height: 330 }}
                resizeMode="contain"
              />
            </SafeAreaView>
            <View
              className="flex-1 bg-white px-8 pt-8"
              style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
            >
              <View className="form space-y-2">
                <Text className="font-black text-2xl text-red-500 mb-2">
                  Login
                </Text>

                <Text>Email</Text>
                <TextInput
                  className={
                    errors.email
                      ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl"
                      : "p-4 bg-gray-100 text-gray-700 rounded-2xl"
                  }
                  placeholder="motorcycleshop@email.com"
                  name="email"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                />

                <View className="mb-3">
                  {touched.email && errors.email && (
                    <Text className="text-red-500">{errors.email}</Text>
                  )}
                </View>

                <Text>Password</Text>
                <TextInput
                  secureTextEntry={true}
                  className={
                    errors.password
                      ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl"
                      : "p-4 bg-gray-100 text-gray-700 rounded-2xl"
                  }
                  placeholder="Enter password"
                  name="password"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                />

                <View className="">
                  {touched.password && errors.password && (
                    <Text className="text-red-500">{errors.password}</Text>
                  )}
                </View>
{/* 
                <TouchableOpacity className="flex items-end mb-5">
                  <Text className="text-gray-400">Forgot Password?</Text>
                </TouchableOpacity> */}
                <Text>{error ? <Error message={error} /> : null}</Text>
                <TouchableOpacity
                  className="bg-red-500 py-4 rounded-2xl"
                  onPress={() => handleSubmit()}
                >
                  <Text className="font-xl font-bold text-center text-white">
                    Login
                  </Text>
                </TouchableOpacity>

                {/* "or" text */}

                {/* <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <View
                    className="bg-gray-200"
                    style={{ flex: 1, height: 1 }}
                  />
                  <Text
                    style={{
                      marginHorizontal: 10,
                      color: "#888888",
                      fontWeight: "bold",
                    }}
                  >
                    or
                  </Text>
                  <View
                    className="bg-gray-200"
                    style={{ flex: 1, height: 1 }}
                  />
                </View> */}

                {/* <TouchableOpacity className="bg-zinc-700 py-4 rounded-2xl items-center">
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View className="bg-white p-[2] rounded-full mr-2">
                      <Image
                        source={require("../../assets/images/google-icon.png")}
                        style={{ width: 20, height: 20 }}
                      />
                    </View>

                    <Text className="font-xl font-bold text-center text-white">
                      Sign in with Google
                    </Text>
                  </View>
                </TouchableOpacity> */}

                <View className="flex flex-row text-center justify-center mb-5">
                  <Text className="mt-2 text-gray-500">
                    Don't have an account yet?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate(Register)}
                  >
                    <Text className="mt-2 text-blue-400"> Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

export default Login;
