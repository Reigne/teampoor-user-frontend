import React, { useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableHighlight,
  Image,
  TouchableOpacity,
} from "react-native";
import { Text, Center, KeyboardAvoidingView } from "native-base";
import Banner from "../../Shared/Banner";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  UserIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ServiceList from "./ServiceList";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import Toast from "react-native-toast-message";

const ServiceContainer = () => {
  const [services, setServices] = useState([]);
  const [servicesCtg, setServicesCtg] = useState([]);
  const [serviceFiltered, setServiceFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);

  const seachSEr = (text) => {
    // console.log(text);
    setSearchText(text);
    setServiceFiltered(
      services.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const closeList = () => {
    setFocus(false);
    setSearchText("");
  };

  const changeCtg = (ctg) => {
    {
      console.log(ctg);
      ctg === "all"
        ? [setServicesCtg(initialState), setActive(true)]
        : [
            setServicesCtg(
              services.filter(
                (i) => i.service !== null && i.service._id === ctg
              ),
              setActive(true)
            ),
            console.log(setServices),
          ];
    }
  };

  useFocusEffect(
    useCallback(() => {
      setFocus(false);
      setActive(-1);

      // call categories
      axios
        .get(`${baseURL}services`)
        .then((res) => {
          setCategories(res.data);
        })
        .catch((error) => {
          console.log("Api categories call error");
        });

      // call products
      axios
        .get(`${baseURL}services`)
        .then((res) => {
          setServices(res.data);
          setServiceFiltered(res.data);
          setServicesCtg(res.data);
          setInitialState(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Api products call error!");
          console.log(error);
        });

      console.log(services, "services asdasd");

      return () => {
        setServicesCtg([]);
        setFocus();
        setCategories([]);
        setActive();
        setInitialState();
      };
    }, [])
  );

  const appointmentHandler = () => {
    if (context.stateUser.isAuthenticated === true) {
      navigation.navigate("Checkout Service");
    } else {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Authentication Required",
        text2: "Please log in to your account before proceeding to checkout.",
      });

      navigation.navigate("User");
    }
  };

  return (
    <KeyboardAwareScrollView>
      <SafeAreaView>
        <View className="mt-2 p-3">
          <View className="flex justify-center items-center  bg-white rounded-lg overflow-hidden">
            <Image
              style={{ width: wp(100), height: hp("20%") }}
              source={require("../../assets/images/header-teampoor.jpg")}
              resizeMode="contain"
            />
            {/*  <Image
                source={require("../../assets/images/motorcycle2.png")}
                style={{ width: 325, height: 235 }}
                resizeMode="contain"
              /> */}
          </View>
        </View>
      </SafeAreaView>

      <View className="mt-2 ">
        {/* <Banner /> */}

        <View className="flex-row items-center space-x-2 px-2 pb-1">
          {/* <View className="flex-1 flex-row items-center bg-white rounded p-2 space-x-2">
              <View className="">
                <MagnifyingGlassIcon
                  color="#52525b"
                  size={hp(2)}
                  strokeWidth={5}
                />
              </View>
              <TextInput placeholder="Search Services" />
            </View> */}
          <TouchableOpacity
            className="bg-red-500 rounded-lg p-3 flex-1 flex-row space-x-1 items-center"
            // onPress={() => navigation.navigate("Home Service Cart")}
            onPress={() => appointmentHandler()}
          >
            <WrenchScrewdriverIcon
              height="15"
              width="15"
              strokeWidth={1.5}
              stroke="white"
            />

            <Text className="text-white">Appointment Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-3">
        <Text className="font-bold text-xl mt-3">Services</Text>
      </View>

      <View>
        <View>
          {servicesCtg.length > 0 ? (
            servicesCtg.map((item, index) => (
              <ServiceList key={item._id} item={item} />
            ))
          ) : (
            <Center flex={1}>
              <Text>No products found</Text>
            </Center>
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ServiceContainer;
