import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TextArea,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  regions,
  provinces,
  cities,
  barangays,
} from "select-philippines-address";
import AuthGlobal from "../../../Context/Store/AuthGlobal";
import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import {
  Modal,
  Button,
  Select,
  CheckIcon,
  Badge,
  ScrollView,
  FlatList,
} from "native-base";
import AddressList from "./AddressList";

const Checkout = (props) => {
  const [orderItems, setOrderItems] = useState([]);
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [regionData, setRegionData] = useState([]);
  const [provinceData, setProvinceData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [barangayData, setBarangayData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [address, setAddress] = useState("");
  const [postalcode, setPostalcode] = useState("");

  const [user, setUser] = useState("");

  const cartItems = useSelector((state) => state.cartItems);
  const context = useContext(AuthGlobal);
  const [errors, setErrors] = useState({});

  const navigation = useNavigation();

  const [usedAddress, setUsedAddress] = useState();

  const [addressList, setAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  // const [defaultAddressId, setDefaultAddressId] = useState(null); // ID of the default address

  useEffect(() => {
    regions().then((regionResponse) => setRegionData(regionResponse));
    getAddresses();
    setOrderItems(cartItems);
    fetchUser();
    if (context.stateUser.isAuthenticated) {
      setUser(context.stateUser.user.userId);
    } else {
      navigation.navigate("User", { screen: "Login" });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "You must login first to checkout",
        text2: "",
      });
    }

    return () => {
      setOrderItems();
      setSelectedAddressId();
    };
  }, []);

  // Function to handle when addresses are fetched
  const handleAddressesFetched = (res) => {
    setAddressList(res.data);

    // If there are addresses and no selected address ID is set, set the selected address ID to the ID of the first address
    if (res.data.length > 0 && selectedAddressId === null) {
      setSelectedAddressId(res.data[0]._id);
      setUsedAddress(res.data[0]); // Set the used address to the first address
    }
  };

  const getAddresses = async () => {
    axios
      .get(`${baseURL}addresses/user/${context.stateUser.user.userId}`)
      .then(handleAddressesFetched)
      .catch((error) => console.log(error));
  };

  const fetchUser = async () => {
    axios
      .get(`${baseURL}users/${context.stateUser.user.userId}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => console.log(error));
  };

  // Function to handle selecting an address
  const selectedAddress = (item) => {
    setUsedAddress(item);
    setSelectedAddressId(item._id);

    console.log(item, "item address");
  };

  // const validateForm = () => {
  //   let errors = {};

  //   if (!fullname) errors.fullname = "Full name is required";
  //   if (!phone) errors.phone = "Phone is required";
  //   if (!selectedRegion) errors.selectedRegion = "Region is required";
  //   if (!selectedProvince) errors.selectedProvince = "Province is required";
  //   if (!selectedCity) errors.selectedCity = "City is required";
  //   if (!selectedBarangay) errors.selectedBarangay = "Barangay is required";
  //   if (!postalcode) errors.postalcode = "Postal code is required";
  //   if (!address) errors.address = "Full address is required";

  //   setErrors(errors);

  //   return Object.keys(errors).length === 0;
  // };

  const checkOut = async () => {
    var total = 0;

    // if (!validateForm()) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Incomplete Form",
    //     text2: "Kindly complete all required fields.",
    //   });

    //   return;
    // }

    console.log(usedAddress, "used address");

    cartItems.forEach((cart) => {
      return (total += cart.price * cart.quantity);
    });

    const regionCode = usedAddress.region;
    const provinceCode = usedAddress.province;
    const cityCode = usedAddress.city;
    const barangayCode = usedAddress.barangay;

    const regionResponse = await regions(regionCode);
    const provinceResponse = await provinces(regionCode);
    const cityResponse = await cities(provinceCode);
    const barangayResponse = await barangays(cityCode);

    const regionName = regionResponse.find(
      (region) => region.region_code === regionCode
    )?.region_name;
    const provinceName = provinceResponse.find(
      (province) => province.province_code === provinceCode
    )?.province_name;
    const cityName = cityResponse.find(
      (city) => city.city_code === cityCode
    )?.city_name;
    const barangayName = barangayResponse.find(
      (barangay) => barangay.brgy_code === barangayCode
    )?.brgy_name;

    let order = {
      fullname: user.firstname + " " + user.lastname,
      phone: user.phone,
      region: regionName,
      province: provinceName,
      city: cityName,
      barangay: barangayName,
      postalcode: usedAddress.postalcode,
      address: usedAddress.address,
      status: "Pending",
      user: user._id,
      orderItems,
      dateOrdered: Date.now(),
      totalPrice: total,
    };

    navigation.navigate("Payment", { order: order });
    console.log("shipping details", order);
  };

  // console.log(user, "user details");
  return (
    <KeyboardAwareScrollView viewIsInsideTabBar={true} className="bg-zinc-100">
      <View className="form p-2 mt-3">
        <View className="bg-white p-3 rounded-lg mb-5 shadow-lg">
          <Text className="font-extrabold text-xl mb-3">Delivery Address</Text>

          <Text className="mb-2">Full Name</Text>
          <TextInput
            className={
              errors.fullname
                ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-5"
            }
            placeholder="Enter full name"
            name="fullname"
            id="fullname"
            readOnly={true}
            value={user.firstname + " " + user.lastname}
            onChangeText={(text) => setFullname(text)}
          />

          <View className="mb-3">
            {errors.fullname ? (
              <Text className="text-sm text-red-500">{errors.fullname}</Text>
            ) : null}
          </View>

          <Text className="mb-2">Phone Number</Text>
          <TextInput
            className={
              errors.phone
                ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-5"
            }
            readOnly={true}
            placeholder="Enter phone number"
            name="phone"
            id="phone"
            onChangeText={(text) => setPhone(text)}
            value={user.phone}
          />

          <View className="mb-3">
            {errors.phone ? (
              <Text className="text-sm text-red-500">{errors.phone}</Text>
            ) : null}
          </View>
        </View>

        <View className="bg-white p-3 rounded-lg shadow-lg space-y-3">
          <View className="flex flex-row justify-between items-center ">
            <Text className="font-bold text-base">Address</Text>

            <View className="bg-red-500 px-2 py-1 rounded">
              <Text className="text-white">Add Address</Text>
            </View>
          </View>

          <View>
            <FlatList
              data={addressList}
              keyExtractor={(item) => item.id}
              // renderItem={renderAddress}
              renderItem={({ item, index }) => (
                <View>
                  {addressList.length > 0 ? (
                    <AddressList
                      item={item}
                      index={index}
                      regionData={regionData}
                      selectedAddress={selectedAddress}
                      selectedAddressId={selectedAddressId}
                    />
                  ) : (
                    <View className="flex justify-center items-center p-5">
                      <Text>No data available.</Text>
                    </View>
                  )}
                </View>
              )}
            />
          </View>
        </View>
        <View className="bg-white rounded-lg mt-2">
          <TouchableOpacity
            className="flex-row justify-center items-center mx-5 rounded-full bg-red-500 p-4 py-3 my-5"
            onPress={() => checkOut()}
          >
            <Text className="text-white font-extrabold text-lg">Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Checkout;
